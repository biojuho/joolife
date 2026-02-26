"""뉴스 수집 총괄 모듈 - 다중 소스 통합 및 중복 필터링"""

import logging
from difflib import SequenceMatcher

from src.config import NewsConfig
from src.news.sources.brave import fetch_brave_news
from src.news.sources.google_rss import NewsItem, fetch_google_news
from src.news.sources.naver import fetch_naver_news
from src.news.sources.newsapi import fetch_newsapi

logger = logging.getLogger("x-content-bot")

# 제목 유사도 임계값 (이 값 이상이면 중복으로 판단)
SIMILARITY_THRESHOLD = 0.65


def _is_duplicate(title: str, existing_titles: list[str]) -> bool:
    """제목 유사도 기반 중복 검사"""
    for existing in existing_titles:
        ratio = SequenceMatcher(None, title, existing).ratio()
        if ratio >= SIMILARITY_THRESHOLD:
            return True
    return False


def collect_news(config: NewsConfig, max_total: int = 20) -> list[NewsItem]:
    """모든 활성 소스에서 뉴스를 수집하고 중복을 제거한다.

    Args:
        config: 뉴스 소스 설정
        max_total: 최대 수집 뉴스 수

    Returns:
        중복 제거된 뉴스 아이템 리스트
    """
    all_items: list[NewsItem] = []

    # 1. Google News RSS (항상 사용, 무료)
    logger.info("Google News RSS 수집 시작...")
    google_items = fetch_google_news()
    all_items.extend(google_items)

    # 2. NewsAPI (API 키가 있을 때만)
    if config.newsapi_key:
        logger.info("NewsAPI 수집 시작...")
        newsapi_items = fetch_newsapi(config.newsapi_key)
        all_items.extend(newsapi_items)

    # 3. 네이버 뉴스 (클라이언트 ID/Secret이 있을 때만)
    if config.naver_client_id and config.naver_client_secret:
        logger.info("네이버 뉴스 수집 시작...")
        naver_items = fetch_naver_news(
            config.naver_client_id, config.naver_client_secret
        )
        all_items.extend(naver_items)

    # 4. Brave News (API 키가 있을 때만, 무료 월 2,000건)
    if config.brave_api_key:
        logger.info("Brave News 수집 시작...")
        brave_items = fetch_brave_news(config.brave_api_key)
        all_items.extend(brave_items)

    # 중복 제거
    unique_items: list[NewsItem] = []
    seen_titles: list[str] = []

    for item in all_items:
        if not _is_duplicate(item.title, seen_titles):
            unique_items.append(item)
            seen_titles.append(item.title)

    logger.info(
        f"뉴스 수집 완료: 전체 {len(all_items)}건 → 중복 제거 후 {len(unique_items)}건"
    )

    return unique_items[:max_total]
