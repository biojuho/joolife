"""CLI 진입점 - X 콘텐츠 자동 생성 파이프라인"""

import logging
import sys

import click

from src.ai.generator import generate_contents
from src.config import Config, setup_logging
from src.news.collector import collect_news
from src.notion.uploader import upload_to_notion
from src.scheduler import run_scheduler

logger: logging.Logger | None = None


def _run_pipeline(config: Config, count: int = 3, content_type: str | None = None) -> None:
    """파이프라인 1회 실행: 뉴스 수집 → AI 생성 → 노션 업로드"""
    assert logger is not None

    logger.info("=" * 50)
    logger.info("파이프라인 실행 시작")
    logger.info("=" * 50)

    # 1단계: 뉴스 수집
    logger.info("[1/3] 뉴스 수집 중...")
    news_items = collect_news(config.news)
    if not news_items:
        logger.warning("수집된 뉴스가 없습니다. 파이프라인 종료.")
        return

    # 2단계: AI 콘텐츠 생성
    logger.info(f"[2/3] AI 콘텐츠 생성 중 ({config.ai.provider})...")
    contents = generate_contents(
        ai_config=config.ai,
        news_items=news_items,
        count=count,
        content_type=content_type,
    )
    if not contents:
        logger.warning("생성된 콘텐츠가 없습니다. 파이프라인 종료.")
        return

    # 3단계: 노션 업로드
    logger.info("[3/3] 노션 업로드 중...")
    created_ids = upload_to_notion(config.notion, contents)

    logger.info("=" * 50)
    logger.info(f"파이프라인 완료: {len(created_ids)}건 업로드 성공")
    logger.info("=" * 50)


@click.group()
def cli():
    """X 콘텐츠 자동 생성 → 노션 파이프라인"""
    pass


@cli.command()
@click.option("--count", "-n", default=0, help="생성할 콘텐츠 수 (기본: .env의 CONTENT_COUNT)")
@click.option("--type", "-t", "content_type", default=None, help="특정 콘텐츠 유형만 생성")
def run(count: int, content_type: str | None):
    """1회 실행 (테스트용)"""
    global logger
    config = Config.from_env()
    logger = setup_logging(config.log_level)

    # 설정 검증
    missing = config.validate()
    if missing:
        logger.error(f"필수 환경변수 누락: {', '.join(missing)}")
        logger.error(".env 파일을 확인해주세요.")
        sys.exit(1)

    actual_count = count if count > 0 else config.content_count
    _run_pipeline(config, count=actual_count, content_type=content_type)


@cli.command()
@click.option("--interval", "-i", default=60, help="실행 간격 (분, 기본: 60)")
def cron(interval: int):
    """매시간 자동 실행 (스케줄러)"""
    global logger
    config = Config.from_env()
    logger = setup_logging(config.log_level)

    missing = config.validate()
    if missing:
        logger.error(f"필수 환경변수 누락: {', '.join(missing)}")
        sys.exit(1)

    def job():
        _run_pipeline(config, count=config.content_count)

    run_scheduler(job, interval_minutes=interval)


if __name__ == "__main__":
    cli()
