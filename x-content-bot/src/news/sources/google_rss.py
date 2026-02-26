"""Google News RSS 수집기 (무료, 기본 소스)"""

import logging
from dataclasses import dataclass

import feedparser

logger = logging.getLogger("x-content-bot")

# Google News RSS 카테고리별 URL (한국)
FEEDS: dict[str, str] = {
    "경제": "https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR2RtZUhNU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR:ko",
    "사회": "https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRFp0Y1RjU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR:ko",
    "기술": "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR:ko",
    "헤드라인": "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko",
}


@dataclass
class NewsItem:
    """수집된 뉴스 아이템"""
    title: str
    source: str
    category: str
    link: str
    published: str


def fetch_google_news(categories: list[str] | None = None, max_per_category: int = 5) -> list[NewsItem]:
    """Google News RSS에서 뉴스를 수집한다.

    Args:
        categories: 수집할 카테고리 목록. None이면 전체.
        max_per_category: 카테고리당 최대 수집 수.

    Returns:
        수집된 뉴스 아이템 리스트
    """
    if categories is None:
        categories = list(FEEDS.keys())

    items: list[NewsItem] = []

    for category in categories:
        url = FEEDS.get(category)
        if not url:
            logger.warning(f"알 수 없는 카테고리: {category}")
            continue

        try:
            feed = feedparser.parse(url)
            if feed.bozo and not feed.entries:
                logger.warning(f"Google RSS 파싱 실패 ({category}): {feed.bozo_exception}")
                continue

            for entry in feed.entries[:max_per_category]:
                # Google News RSS의 source는 title에 " - 출처" 형태로 포함
                title = entry.get("title", "")
                source_name = "알 수 없음"
                if " - " in title:
                    parts = title.rsplit(" - ", 1)
                    title = parts[0].strip()
                    source_name = parts[1].strip()

                items.append(NewsItem(
                    title=title,
                    source=source_name,
                    category=category,
                    link=entry.get("link", ""),
                    published=entry.get("published", ""),
                ))

            logger.info(f"Google RSS [{category}] {len(feed.entries[:max_per_category])}건 수집")

        except Exception as e:
            logger.error(f"Google RSS 수집 실패 ({category}): {e}")

    return items
