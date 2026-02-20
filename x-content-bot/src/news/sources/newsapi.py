"""NewsAPI 뉴스 수집기 (선택적, API 키 필요)"""

import logging
from dataclasses import dataclass

import requests

from src.news.sources.google_rss import NewsItem

logger = logging.getLogger("x-content-bot")

NEWSAPI_URL = "https://newsapi.org/v2/top-headlines"


def fetch_newsapi(api_key: str, max_items: int = 10) -> list[NewsItem]:
    """NewsAPI에서 한국 톱 헤드라인을 수집한다.

    Args:
        api_key: NewsAPI 키
        max_items: 최대 수집 수

    Returns:
        수집된 뉴스 아이템 리스트
    """
    if not api_key:
        return []

    items: list[NewsItem] = []

    try:
        resp = requests.get(
            NEWSAPI_URL,
            params={
                "country": "kr",
                "pageSize": max_items,
                "apiKey": api_key,
            },
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()

        for article in data.get("articles", []):
            title = article.get("title", "")
            if not title:
                continue

            # "[Removed]" 같은 삭제된 기사 필터링
            if title.lower().strip() == "[removed]":
                continue

            items.append(NewsItem(
                title=title,
                source=article.get("source", {}).get("name", "알 수 없음"),
                category="글로벌",
                link=article.get("url", ""),
                published=article.get("publishedAt", ""),
            ))

        logger.info(f"NewsAPI {len(items)}건 수집")

    except requests.RequestException as e:
        logger.error(f"NewsAPI 수집 실패: {e}")

    return items
