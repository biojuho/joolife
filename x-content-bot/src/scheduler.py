"""스케줄러 모듈 - 매시간 자동 실행"""

import logging
import time

import schedule

logger = logging.getLogger("x-content-bot")


def run_scheduler(job_fn: callable, interval_minutes: int = 60) -> None:
    """매 interval_minutes분마다 job_fn을 실행하는 스케줄러.

    Args:
        job_fn: 실행할 함수 (인자 없음)
        interval_minutes: 실행 간격 (분). 기본 60분.
    """
    # 즉시 1회 실행
    logger.info("스케줄러 시작 - 첫 실행...")
    job_fn()

    # 이후 매 interval_minutes분마다 실행
    schedule.every(interval_minutes).minutes.do(job_fn)
    logger.info(f"스케줄러 등록 완료: 매 {interval_minutes}분마다 실행")

    try:
        while True:
            schedule.run_pending()
            time.sleep(30)  # 30초마다 체크
    except KeyboardInterrupt:
        logger.info("스케줄러 종료 (Ctrl+C)")
