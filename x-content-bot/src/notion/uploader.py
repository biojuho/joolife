"""노션 API 업로드 모듈"""

import logging
import time
from datetime import datetime

import requests

from src.ai.generator import GeneratedContent
from src.config import NotionConfig

logger = logging.getLogger("x-content-bot")

NOTION_API_BASE = "https://api.notion.com/v1"
NOTION_VERSION = "2022-06-28"
MAX_RETRIES = 3
RETRY_DELAY = 2  # 초


def _get_recommended_time() -> str:
    """현재 시간 기반으로 추천 시간대를 반환한다."""
    hour = datetime.now().hour

    if 6 <= hour < 10:
        return "🌅 오전 (8-9시)"
    elif 10 <= hour < 14:
        return "☀️ 점심 (12-1시)"
    elif 14 <= hour < 20:
        return "🌆 저녁 (18-19시)"
    else:
        return "🌙 밤 (21-22시)"


def _build_page_properties(content: GeneratedContent) -> dict:
    """GeneratedContent를 노션 DB 프로퍼티 형식으로 변환한다."""
    now_iso = datetime.now().astimezone().isoformat()

    properties: dict = {
        # title 타입: 콘텐츠
        "콘텐츠": {
            "title": [{"text": {"content": content.title}}]
        },
        # rich_text 타입: 트윗 본문
        "트윗 본문": {
            "rich_text": [{"text": {"content": content.tweet[:2000]}}]
        },
        # select 타입: 콘텐츠 유형
        "콘텐츠 유형": {
            "select": {"name": content.content_type}
        },
        # select 타입: 상태 (항상 "🆕 생성됨")
        "상태": {
            "select": {"name": "🆕 생성됨"}
        },
        # select 타입: 추천 시간대
        "추천 시간대": {
            "select": {"name": _get_recommended_time()}
        },
        # date 타입: 생성일
        "생성일": {
            "date": {"start": now_iso}
        },
        # checkbox 타입: 이미지 필요
        "이미지 필요": {
            "checkbox": content.needs_image
        },
    }

    # 선택적 rich_text 필드
    if content.image_prompt:
        properties["이미지 프롬프트"] = {
            "rich_text": [{"text": {"content": content.image_prompt[:2000]}}]
        }

    if content.memo:
        properties["메모"] = {
            "rich_text": [{"text": {"content": content.memo[:2000]}}]
        }

    return properties


def upload_to_notion(
    config: NotionConfig,
    contents: list[GeneratedContent],
) -> list[str]:
    """생성된 콘텐츠를 노션 DB에 업로드한다.

    Args:
        config: 노션 설정 (토큰, DB ID)
        contents: 업로드할 콘텐츠 리스트

    Returns:
        성공적으로 생성된 페이지 ID 리스트
    """
    headers = {
        "Authorization": f"Bearer {config.token}",
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
    }

    created_ids: list[str] = []

    for content in contents:
        properties = _build_page_properties(content)
        payload = {
            "parent": {"database_id": config.db_id},
            "properties": properties,
        }

        success = False
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                resp = requests.post(
                    f"{NOTION_API_BASE}/pages",
                    headers=headers,
                    json=payload,
                    timeout=30,
                )

                if resp.status_code == 200:
                    page_id = resp.json().get("id", "")
                    created_ids.append(page_id)
                    logger.info(f"노션 업로드 성공: '{content.title}' (ID: {page_id})")
                    success = True
                    break
                elif resp.status_code == 429:
                    # Rate limit - 재시도
                    retry_after = int(resp.headers.get("Retry-After", RETRY_DELAY))
                    logger.warning(f"노션 Rate limit, {retry_after}초 후 재시도... ({attempt}/{MAX_RETRIES})")
                    time.sleep(retry_after)
                else:
                    logger.error(
                        f"노션 업로드 실패 (HTTP {resp.status_code}): {resp.text[:300]}"
                    )
                    if attempt < MAX_RETRIES:
                        time.sleep(RETRY_DELAY)

            except requests.RequestException as e:
                logger.error(f"노션 API 요청 실패: {e} ({attempt}/{MAX_RETRIES})")
                if attempt < MAX_RETRIES:
                    time.sleep(RETRY_DELAY)

        if not success:
            logger.error(f"노션 업로드 최종 실패: '{content.title}'")

    logger.info(f"노션 업로드 완료: {len(created_ids)}/{len(contents)}건 성공")
    return created_ids
