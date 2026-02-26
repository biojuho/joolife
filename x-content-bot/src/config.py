"""설정 관리 모듈"""

import logging
import os
import sys
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

# 프로젝트 루트에서 .env 로드
_PROJECT_ROOT = Path(__file__).parent.parent
load_dotenv(_PROJECT_ROOT / ".env")


@dataclass
class NotionConfig:
    token: str = ""
    db_id: str = ""


@dataclass
class AIConfig:
    provider: str = "anthropic"  # anthropic | google | openai
    api_key: str = ""


@dataclass
class NewsConfig:
    newsapi_key: str = ""
    naver_client_id: str = ""
    naver_client_secret: str = ""
    brave_api_key: str = ""


@dataclass
class Config:
    notion: NotionConfig = field(default_factory=NotionConfig)
    ai: AIConfig = field(default_factory=AIConfig)
    news: NewsConfig = field(default_factory=NewsConfig)
    content_count: int = 3
    log_level: str = "INFO"

    @classmethod
    def from_env(cls) -> "Config":
        """환경변수에서 설정을 로드한다."""
        return cls(
            notion=NotionConfig(
                token=os.getenv("NOTION_TOKEN", ""),
                db_id=os.getenv("NOTION_DB_ID", ""),
            ),
            ai=AIConfig(
                provider=os.getenv("AI_PROVIDER", "anthropic"),
                api_key=os.getenv("AI_API_KEY", ""),
            ),
            news=NewsConfig(
                newsapi_key=os.getenv("NEWS_API_KEY", ""),
                naver_client_id=os.getenv("NAVER_CLIENT_ID", ""),
                naver_client_secret=os.getenv("NAVER_CLIENT_SECRET", ""),
                brave_api_key=os.getenv("BRAVE_API_KEY", ""),
            ),
            content_count=int(os.getenv("CONTENT_COUNT", "3")),
            log_level=os.getenv("LOG_LEVEL", "INFO"),
        )

    def validate(self) -> list[str]:
        """필수 설정이 있는지 검증한다. 누락된 항목 목록을 반환."""
        missing = []
        if not self.notion.token:
            missing.append("NOTION_TOKEN")
        if not self.notion.db_id:
            missing.append("NOTION_DB_ID")
        if not self.ai.api_key:
            missing.append("AI_API_KEY")
        return missing


def setup_logging(level: str = "INFO") -> logging.Logger:
    """로깅 설정: 콘솔 + 파일 동시 출력"""
    logger = logging.getLogger("x-content-bot")
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))

    # 이미 핸들러가 있으면 중복 추가 방지
    if logger.handlers:
        return logger

    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # 콘솔 핸들러
    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(formatter)
    logger.addHandler(console)

    # 파일 핸들러
    log_dir = _PROJECT_ROOT / "logs"
    log_dir.mkdir(exist_ok=True)
    file_handler = logging.FileHandler(
        log_dir / "bot.log", encoding="utf-8"
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger
