"""AI 콘텐츠 생성 총괄 모듈"""

import json
import logging
import random
from dataclasses import dataclass

from src.ai.prompts import ALL_CONTENT_TYPES, SYSTEM_PROMPT, build_user_prompt
from src.ai.providers.anthropic import generate_with_anthropic
from src.ai.providers.google import generate_with_google
from src.ai.providers.openai import generate_with_openai
from src.config import AIConfig
from src.news.sources.google_rss import NewsItem

logger = logging.getLogger("x-content-bot")


@dataclass
class GeneratedContent:
    """AI가 생성한 콘텐츠"""
    title: str
    tweet: str
    content_type: str
    needs_image: bool
    image_prompt: str
    memo: str


def _get_provider(name: str):
    """프로바이더 이름으로 생성 함수를 반환한다. (테스트 모킹을 위해 함수로 분리)"""
    providers = {
        "anthropic": generate_with_anthropic,
        "google": generate_with_google,
        "openai": generate_with_openai,
    }
    return providers.get(name)


def _format_news_summary(news_items: list[NewsItem]) -> str:
    """뉴스 아이템들을 AI에게 전달할 요약 텍스트로 변환한다."""
    lines = []
    for i, item in enumerate(news_items, 1):
        lines.append(f"{i}. [{item.category}] {item.title} (출처: {item.source})")
    return "\n".join(lines)


def _parse_ai_response(raw: str, content_type: str) -> GeneratedContent | None:
    """AI 응답(JSON 문자열)을 파싱하여 GeneratedContent로 변환한다."""
    # JSON 블록 추출 (```json ... ``` 또는 순수 JSON)
    text = raw.strip()
    if "```json" in text:
        start = text.index("```json") + 7
        end = text.index("```", start)
        text = text[start:end].strip()
    elif "```" in text:
        start = text.index("```") + 3
        end = text.index("```", start)
        text = text[start:end].strip()

    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        logger.error(f"JSON 파싱 실패: {e}\n원본: {raw[:200]}")
        return None

    return GeneratedContent(
        title=data.get("title", "제목 없음"),
        tweet=data.get("tweet", ""),
        content_type=data.get("content_type", content_type),
        needs_image=data.get("needs_image", False),
        image_prompt=data.get("image_prompt", ""),
        memo=data.get("memo", ""),
    )


def generate_contents(
    ai_config: AIConfig,
    news_items: list[NewsItem],
    count: int = 3,
    content_type: str | None = None,
) -> list[GeneratedContent]:
    """뉴스 기반으로 X 콘텐츠를 생성한다.

    Args:
        ai_config: AI 프로바이더 설정
        news_items: 수집된 뉴스 아이템 리스트
        count: 생성할 콘텐츠 수 (3~5)
        content_type: 특정 유형만 생성할 경우 지정. None이면 랜덤 선택.

    Returns:
        생성된 콘텐츠 리스트
    """
    provider_fn = _get_provider(ai_config.provider)
    if not provider_fn:
        logger.error(f"지원하지 않는 AI 프로바이더: {ai_config.provider}")
        return []

    # 콘텐츠 유형 선택
    if content_type:
        selected_types = [content_type] * count
    else:
        # 랜덤으로 count개 유형 선택 (중복 가능하되, 가능하면 다양하게)
        count = min(count, 5)
        count = max(count, 3)
        if count <= len(ALL_CONTENT_TYPES):
            selected_types = random.sample(ALL_CONTENT_TYPES, count)
        else:
            selected_types = random.choices(ALL_CONTENT_TYPES, k=count)

    news_summary = _format_news_summary(news_items)
    results: list[GeneratedContent] = []

    for i, ctype in enumerate(selected_types):
        logger.info(f"[{i + 1}/{len(selected_types)}] '{ctype}' 콘텐츠 생성 중...")

        user_prompt = build_user_prompt(ctype, news_summary)

        try:
            raw_response = provider_fn(
                api_key=ai_config.api_key,
                system_prompt=SYSTEM_PROMPT,
                user_prompt=user_prompt,
            )

            content = _parse_ai_response(raw_response, ctype)
            if content and content.tweet:
                results.append(content)
                logger.info(f"  ✓ '{content.title}' 생성 완료 ({len(content.tweet)}자)")
            else:
                logger.warning(f"  ✗ '{ctype}' 콘텐츠 파싱 실패, 건너뜀")

        except Exception as e:
            logger.error(f"  ✗ '{ctype}' 콘텐츠 생성 실패: {e}")

    logger.info(f"콘텐츠 생성 완료: {len(results)}/{len(selected_types)}건 성공")
    return results
