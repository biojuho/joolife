"""네이버 뉴스 검색 API 수집기 (선택적, 클라이언트 ID/Secret 필요)"""

import logging

import requests

from src.news.sources.google_rss import NewsItem

logger = logging.getLogger("x-content-bot")

NAVER_SEARCH_URL = "https://openapi.naver.com/v1/search/news.json"

# 검색할 키워드 목록 (경제/사회/기술 관련)
SEARCH_KEYWORDS = [
    "경제 동향",
    "부동산 시장",
    "AI 인공지능",
    "스타트업",
    "MZ세대",
    "사회 이슈",
    "IT 트렌드",
]


def fetch_naver_news(
    client_id: str,
    client_secret: str,
    keywords: list[str] | None = None,
    max_per_keyword: int = 3,
) -> list[NewsItem]:
    """네이버 뉴스 검색 API에서 뉴스를 수집한다.

    Args:
        client_id: 네이버 개발자 Client ID
        client_secret: 네이버 개발자 Client Secret
        keywords: 검색할 키워드 목록. None이면 기본 키워드 사용.
        max_per_keyword: 키워드당 최대 수집 수.

    Returns:
        수집된 뉴스 아이템 리스트
    """
    if not client_id or not client_secret:
        return []

    if keywords is None:
        keywords = SEARCH_KEYWORDS

    items: list[NewsItem] = []
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
    }

    for keyword in keywords:
        try:
            resp = requests.get(
                NAVER_SEARCH_URL,
                headers=headers,
                params={
                    "query": keyword,
                    "display": max_per_keyword,
                    "sort": "date",
                },
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()

            for item in data.get("items", []):
                # HTML 태그 제거
                title = item.get("title", "")
                title = title.replace("<b>", "").replace("</b>", "")
                title = title.replace("&quot;", '"').replace("&amp;", "&")

                if not title:
                    continue

                items.append(NewsItem(
                    title=title,
                    source="네이버뉴스",
                    category=keyword,
                    link=item.get("originallink", item.get("link", "")),
                    published=item.get("pubDate", ""),
                ))

            logger.info(f"네이버 [{keyword}] {len(data.get('items', []))}건 수집")

        except requests.RequestException as e:
            logger.error(f"네이버 뉴스 수집 실패 ({keyword}): {e}")

    return items
