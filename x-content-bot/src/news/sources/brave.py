"""Brave Search API 뉴스 수집기 (선택적, API 키 필요 - 무료 월 2,000건)"""

import logging
from urllib.parse import urlparse

import requests

from src.news.sources.google_rss import NewsItem

logger = logging.getLogger("x-content-bot")

BRAVE_NEWS_URL = "https://api.search.brave.com/res/v1/news/search"

# 검색할 키워드 목록
SEARCH_KEYWORDS = [
    "한국 경제",
    "사회 이슈",
    "기술 트렌드",
    "AI",
]


def _extract_hostname(url: str) -> str:
    """URL에서 호스트명을 추출한다."""
    try:
        return urlparse(url).hostname or "알 수 없음"
    except Exception:
        return "알 수 없음"


def fetch_brave_news(
    api_key: str,
    keywords: list[str] | None = None,
    max_per_keyword: int = 5,
) -> list[NewsItem]:
    """Brave News Search API에서 뉴스를 수집한다.

    Args:
        api_key: Brave Search API 키
        keywords: 검색할 키워드 목록. None이면 기본 키워드 사용.
        max_per_keyword: 키워드당 최대 수집 수.

    Returns:
        수집된 뉴스 아이템 리스트
    """
    if not api_key:
        return []

    if keywords is None:
        keywords = SEARCH_KEYWORDS

    items: list[NewsItem] = []
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": api_key,
    }

    for keyword in keywords:
        try:
            resp = requests.get(
                BRAVE_NEWS_URL,
                headers=headers,
                params={
                    "q": keyword,
                    "country": "KR",
                    "search_lang": "ko",
                    "freshness": "pd",  # 최근 24시간
                    "count": max_per_keyword,
                },
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()

            for result in data.get("results", []):
                title = result.get("title", "")
                if not title:
                    continue

                # 출처: meta_url.hostname 우선, 없으면 URL에서 추출
                meta_url = result.get("meta_url") or {}
                source = meta_url.get("hostname") or _extract_hostname(result.get("url", ""))

                # 날짜: page_age 우선, 없으면 age (상대 시간 문자열)
                published = result.get("page_age") or result.get("age", "")

                items.append(NewsItem(
                    title=title,
                    source=source,
                    category=keyword,
                    link=result.get("url", ""),
                    published=published,
                ))

            logger.info(f"Brave [{keyword}] {len(data.get('results', []))}건 수집")

        except requests.RequestException as e:
            logger.error(f"Brave 뉴스 수집 실패 ({keyword}): {e}")

    return items
