"""노션 업로드 모듈 테스트"""

from unittest.mock import MagicMock, patch

from src.ai.generator import GeneratedContent
from src.config import NotionConfig
from src.notion.uploader import _build_page_properties, _get_recommended_time, upload_to_notion


class TestRecommendedTime:
    """추천 시간대 테스트"""

    @patch("src.notion.uploader.datetime")
    def test_오전(self, mock_dt):
        mock_dt.now.return_value.hour = 8
        result = _get_recommended_time()
        assert "오전" in result

    @patch("src.notion.uploader.datetime")
    def test_점심(self, mock_dt):
        mock_dt.now.return_value.hour = 12
        result = _get_recommended_time()
        assert "점심" in result

    @patch("src.notion.uploader.datetime")
    def test_저녁(self, mock_dt):
        mock_dt.now.return_value.hour = 18
        result = _get_recommended_time()
        assert "저녁" in result

    @patch("src.notion.uploader.datetime")
    def test_밤(self, mock_dt):
        mock_dt.now.return_value.hour = 22
        result = _get_recommended_time()
        assert "밤" in result


class TestBuildProperties:
    """프로퍼티 빌드 테스트"""

    def test_기본_프로퍼티(self):
        content = GeneratedContent(
            title="테스트",
            tweet="트윗 내용",
            content_type="시사 밈",
            needs_image=False,
            image_prompt="",
            memo="메모",
        )

        props = _build_page_properties(content)

        assert props["콘텐츠"]["title"][0]["text"]["content"] == "테스트"
        assert props["트윗 본문"]["rich_text"][0]["text"]["content"] == "트윗 내용"
        assert props["콘텐츠 유형"]["select"]["name"] == "시사 밈"
        assert props["상태"]["select"]["name"] == "🆕 생성됨"
        assert props["이미지 필요"]["checkbox"] is False

    def test_이미지_프롬프트_포함(self):
        content = GeneratedContent(
            title="테스트",
            tweet="내용",
            content_type="비포/애프터",
            needs_image=True,
            image_prompt="A comparison image",
            memo="",
        )

        props = _build_page_properties(content)
        assert "이미지 프롬프트" in props
        assert props["이미지 필요"]["checkbox"] is True


class TestUpload:
    """노션 업로드 테스트"""

    @patch("src.notion.uploader.requests.post")
    def test_정상_업로드(self, mock_post):
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {"id": "page-123"}
        mock_post.return_value = mock_resp

        config = NotionConfig(token="test-token", db_id="test-db")
        contents = [
            GeneratedContent("테스트", "트윗", "시사 밈", False, "", ""),
        ]

        ids = upload_to_notion(config, contents)
        assert len(ids) == 1
        assert ids[0] == "page-123"

    @patch("src.notion.uploader.requests.post")
    def test_업로드_실패_재시도(self, mock_post):
        # 처음 2번 실패, 3번째 성공
        fail_resp = MagicMock()
        fail_resp.status_code = 500
        fail_resp.text = "Server Error"

        success_resp = MagicMock()
        success_resp.status_code = 200
        success_resp.json.return_value = {"id": "page-456"}

        mock_post.side_effect = [fail_resp, fail_resp, success_resp]

        config = NotionConfig(token="test-token", db_id="test-db")
        contents = [
            GeneratedContent("테스트", "트윗", "시사 밈", False, "", ""),
        ]

        ids = upload_to_notion(config, contents)
        assert len(ids) == 1
        assert mock_post.call_count == 3

    @patch("src.notion.uploader.requests.post")
    def test_최종_실패(self, mock_post):
        fail_resp = MagicMock()
        fail_resp.status_code = 500
        fail_resp.text = "Server Error"
        mock_post.return_value = fail_resp

        config = NotionConfig(token="test-token", db_id="test-db")
        contents = [
            GeneratedContent("테스트", "트윗", "시사 밈", False, "", ""),
        ]

        ids = upload_to_notion(config, contents)
        assert len(ids) == 0
        assert mock_post.call_count == 3  # MAX_RETRIES
