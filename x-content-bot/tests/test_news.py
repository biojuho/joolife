"""뉴스 수집 모듈 테스트"""

from unittest.mock import MagicMock, patch

from src.config import NewsConfig
from src.news.collector import _is_duplicate, collect_news
from src.news.sources.brave import fetch_brave_news
from src.news.sources.google_rss import NewsItem, fetch_google_news


class TestDuplicateDetection:
    """중복 뉴스 감지 테스트"""

    def test_동일_제목_중복(self):
        assert _is_duplicate("삼성전자 주가 급등", ["삼성전자 주가 급등"])

    def test_유사_제목_중복(self):
        assert _is_duplicate(
            "삼성전자 주가 급등세 지속",
            ["삼성전자 주가 급등세 이어져"],
        )

    def test_다른_제목_비중복(self):
        assert not _is_duplicate(
            "AI 기술 혁신 가속화",
            ["부동산 시장 동향 분석"],
        )

    def test_빈_목록(self):
        assert not _is_duplicate("아무 제목", [])


class TestGoogleRSS:
    """Google News RSS 수집 테스트"""

    @patch("src.news.sources.google_rss.feedparser.parse")
    def test_정상_수집(self, mock_parse):
        mock_parse.return_value = MagicMock(
            bozo=False,
            entries=[
                {
                    "title": "테스트 뉴스 - 조선일보",
                    "link": "https://example.com/1",
                    "published": "2024-01-01",
                },
                {
                    "title": "다른 뉴스 - 한겨레",
                    "link": "https://example.com/2",
                    "published": "2024-01-01",
                },
            ],
        )

        items = fetch_google_news(categories=["헤드라인"], max_per_category=5)
        assert len(items) == 2
        assert items[0].title == "테스트 뉴스"
        assert items[0].source == "조선일보"

    @patch("src.news.sources.google_rss.feedparser.parse")
    def test_파싱_실패시_빈_리스트(self, mock_parse):
        mock_parse.return_value = MagicMock(
            bozo=True,
            bozo_exception=Exception("파싱 에러"),
            entries=[],
        )

        items = fetch_google_news(categories=["헤드라인"])
        assert len(items) == 0


class TestBraveNews:
    """Brave News Search 수집 테스트"""

    @patch("src.news.sources.brave.requests.get")
    def test_정상_수집(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "type": "news",
            "results": [
                {
                    "title": "한국 경제 성장률 전망",
                    "url": "https://example.com/news/1",
                    "description": "한국 경제 성장률 전망에 대한 기사",
                    "age": "2시간 전",
                    "page_age": "2025-01-15T10:00:00Z",
                    "meta_url": {"hostname": "example.com"},
                },
                {
                    "title": "AI 기술 동향 분석",
                    "url": "https://tech.example.com/ai",
                    "description": "AI 기술 동향",
                    "age": "1시간 전",
                    "meta_url": {"hostname": "tech.example.com"},
                },
            ],
        }
        mock_resp.raise_for_status = MagicMock()
        mock_get.return_value = mock_resp

        items = fetch_brave_news("test-api-key", keywords=["한국 경제"])
        assert len(items) == 2
        assert items[0].title == "한국 경제 성장률 전망"
        assert items[0].source == "example.com"
        assert items[0].published == "2025-01-15T10:00:00Z"

    @patch("src.news.sources.brave.requests.get")
    def test_meta_url_없으면_url에서_추출(self, mock_get):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "results": [
                {
                    "title": "테스트 뉴스",
                    "url": "https://news.example.org/article/123",
                    "age": "3시간 전",
                },
            ],
        }
        mock_resp.raise_for_status = MagicMock()
        mock_get.return_value = mock_resp

        items = fetch_brave_news("test-key", keywords=["테스트"])
        assert len(items) == 1
        assert items[0].source == "news.example.org"
        assert items[0].published == "3시간 전"  # page_age 없으면 age 사용

    def test_api_키_없으면_빈_리스트(self):
        items = fetch_brave_news("")
        assert items == []


class TestCollector:
    """뉴스 수집 총괄 테스트"""

    @patch("src.news.collector.fetch_google_news")
    def test_기본_수집_google_only(self, mock_google):
        mock_google.return_value = [
            NewsItem("삼성전자 실적 발표 임박", "한국경제", "경제", "http://a", "2024-01-01"),
            NewsItem("서울 지하철 무인화 추진 논란", "조선일보", "사회", "http://b", "2024-01-01"),
        ]

        config = NewsConfig()  # API 키 없음 → Google RSS만 사용
        items = collect_news(config)

        assert len(items) == 2
        mock_google.assert_called_once()

    @patch("src.news.collector.fetch_google_news")
    def test_중복_제거(self, mock_google):
        mock_google.return_value = [
            NewsItem("삼성전자 주가 급등", "출처1", "경제", "http://a", "2024-01-01"),
            NewsItem("삼성전자 주가 급등세", "출처2", "경제", "http://b", "2024-01-01"),
            NewsItem("AI 혁신 뉴스", "출처3", "기술", "http://c", "2024-01-01"),
        ]

        config = NewsConfig()
        items = collect_news(config)

        # 유사한 제목 2개 중 1개만 남아야 함
        assert len(items) == 2
