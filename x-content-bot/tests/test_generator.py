"""AI 콘텐츠 생성 모듈 테스트"""

import json
from unittest.mock import MagicMock, patch

from src.ai.generator import GeneratedContent, _parse_ai_response, generate_contents
from src.ai.prompts import ALL_CONTENT_TYPES, SYSTEM_PROMPT, build_user_prompt
from src.config import AIConfig
from src.news.sources.google_rss import NewsItem


class TestParseResponse:
    """AI 응답 파싱 테스트"""

    def test_정상_JSON(self):
        raw = json.dumps({
            "title": "테스트",
            "tweet": "트윗 내용",
            "content_type": "시사 밈",
            "needs_image": False,
            "image_prompt": "",
            "memo": "메모",
        })

        result = _parse_ai_response(raw, "시사 밈")
        assert result is not None
        assert result.title == "테스트"
        assert result.tweet == "트윗 내용"

    def test_코드블록_JSON(self):
        raw = """```json
{
  "title": "테스트",
  "tweet": "내용",
  "content_type": "공감 시리즈",
  "needs_image": true,
  "image_prompt": "test prompt",
  "memo": ""
}
```"""
        result = _parse_ai_response(raw, "공감 시리즈")
        assert result is not None
        assert result.needs_image is True

    def test_잘못된_JSON(self):
        result = _parse_ai_response("이건 JSON이 아닙니다", "시사 밈")
        assert result is None

    def test_빈_트윗(self):
        raw = json.dumps({
            "title": "테스트",
            "tweet": "",
            "content_type": "시사 밈",
        })
        result = _parse_ai_response(raw, "시사 밈")
        assert result is not None
        assert result.tweet == ""


class TestPrompts:
    """프롬프트 테스트"""

    def test_모든_유형_프롬프트_존재(self):
        assert len(ALL_CONTENT_TYPES) == 10

    def test_사용자_프롬프트_생성(self):
        prompt = build_user_prompt("양자택일 논쟁", "1. [경제] 금리 인하 - 한국은행")
        assert "양자택일 논쟁" in prompt
        assert "금리 인하" in prompt

    def test_알수없는_유형_에러(self):
        try:
            build_user_prompt("존재하지않는유형", "뉴스")
            assert False, "ValueError가 발생해야 합니다"
        except ValueError:
            pass

    def test_시스템_프롬프트_JSON_형식_포함(self):
        assert "json" in SYSTEM_PROMPT.lower()
        assert "title" in SYSTEM_PROMPT
        assert "tweet" in SYSTEM_PROMPT


class TestGenerateContents:
    """콘텐츠 생성 테스트"""

    @patch("src.ai.generator._get_provider")
    def test_정상_생성(self, mock_get_provider):
        mock_fn = MagicMock(return_value=json.dumps({
            "title": "테스트 콘텐츠",
            "tweet": "이것은 테스트 트윗입니다 🔥\n여러분은 어떻게 생각하세요?",
            "content_type": "시사 밈",
            "needs_image": False,
            "image_prompt": "",
            "memo": "테스트",
        }))
        mock_get_provider.return_value = mock_fn

        news = [
            NewsItem("AI 발전 뉴스", "조선일보", "기술", "http://a", "2024-01-01"),
        ]
        config = AIConfig(provider="anthropic", api_key="test-key")

        results = generate_contents(config, news, count=3)
        assert len(results) == 3
        assert all(isinstance(r, GeneratedContent) for r in results)

    def test_지원하지않는_프로바이더(self):
        config = AIConfig(provider="unknown", api_key="test")
        results = generate_contents(config, [], count=3)
        assert results == []
