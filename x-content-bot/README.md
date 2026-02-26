# X 콘텐츠 자동 생성 → 노션 파이프라인

매시간 자동으로 최신 뉴스(경제, 사회, 기술)를 수집하고, AI로 X용 포스트 3~5개를 생성하여 노션 DB에 업로드하는 시스템.

## 워크플로우

```
뉴스 수집 (Google RSS + α) → AI 콘텐츠 생성 → 노션 DB 업로드 → 노션에서 채택 → X 포스팅
```

## 설치

### 사전 요구사항

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) 패키지 매니저

### 설치 방법

```bash
cd x-content-bot

# 의존성 설치
uv sync

# 환경변수 설정
cp .env.template .env
# .env 파일을 편집하여 토큰 입력
```

## 환경변수 설정

`.env` 파일에 아래 값을 입력하세요.

| 변수 | 필수 | 설명 |
|------|------|------|
| `NOTION_TOKEN` | O | 노션 Integration 토큰 |
| `NOTION_DB_ID` | O | 노션 DB ID |
| `AI_PROVIDER` | O | AI 프로바이더 (`anthropic` / `google` / `openai`) |
| `AI_API_KEY` | O | AI API 키 |
| `NEWS_API_KEY` | - | NewsAPI 키 (선택) |
| `NAVER_CLIENT_ID` | - | 네이버 개발자 Client ID (선택) |
| `NAVER_CLIENT_SECRET` | - | 네이버 개발자 Client Secret (선택) |
| `BRAVE_API_KEY` | - | Brave Search API 키 (선택, 무료 월 2,000건) |
| `CONTENT_COUNT` | - | 매 실행시 생성할 콘텐츠 수 (기본: 3) |
| `LOG_LEVEL` | - | 로그 레벨 (기본: INFO) |

## 실행

```bash
# 1회 실행 (테스트용)
uv run python -m src.main run

# 생성 개수 지정
uv run python -m src.main run --count 5

# 특정 콘텐츠 유형만 생성
uv run python -m src.main run --type "양자택일 논쟁"

# 매시간 자동 실행 (스케줄러)
uv run python -m src.main cron

# 실행 간격 변경 (30분마다)
uv run python -m src.main cron --interval 30
```

## 콘텐츠 유형 (10가지)

| # | 유형 | 설명 |
|---|------|------|
| 1 | 양자택일 논쟁 | 두 가지 선택지로 참여 유도 |
| 2 | 틀린답만 유머 | "틀린 답만 달아주세요" 유머 |
| 3 | 트렌드 스레드 | 최신 트렌드 인사이트 |
| 4 | 꿀팁 리스트 | 실용적 팁 리스트 |
| 5 | 비포/애프터 | 과거 vs 현재 대비 |
| 6 | 빈칸 채우기 | 빈칸 채우기 참여형 |
| 7 | 숫자 경험담 | 구체적 숫자 기반 이야기 |
| 8 | 시사 밈 | 시사 뉴스를 밈으로 |
| 9 | 공감 시리즈 | "나만 그런가?" 공감 |
| 10 | 예측 베팅 | 미래 전망 투표 |

## 테스트

```bash
uv run pytest -v
```

## 프로젝트 구조

```
x-content-bot/
├── pyproject.toml          # uv 패키지 매니저 설정
├── .env.template           # 환경변수 템플릿
├── .env                    # 실제 환경변수 (gitignore)
├── src/
│   ├── main.py             # CLI 진입점
│   ├── config.py           # 설정 관리
│   ├── scheduler.py        # 스케줄러
│   ├── news/
│   │   ├── collector.py    # 뉴스 수집 총괄
│   │   └── sources/
│   │       ├── google_rss.py   # Google News RSS
│   │       ├── newsapi.py      # NewsAPI
│   │       ├── naver.py        # 네이버 뉴스
│   │       └── brave.py        # Brave Search
│   ├── ai/
│   │   ├── generator.py    # AI 콘텐츠 생성
│   │   ├── prompts.py      # 프롬프트 템플릿
│   │   └── providers/
│   │       ├── anthropic.py
│   │       ├── google.py
│   │       └── openai.py
│   └── notion/
│       └── uploader.py     # 노션 업로드
└── tests/
    ├── test_news.py
    ├── test_generator.py
    └── test_notion.py
```
