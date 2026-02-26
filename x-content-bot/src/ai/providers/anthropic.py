"""Anthropic (Claude) AI 프로바이더"""

import logging

import anthropic

logger = logging.getLogger("x-content-bot")


def generate_with_anthropic(
    api_key: str,
    system_prompt: str,
    user_prompt: str,
    model: str = "claude-sonnet-4-5-20250929",
) -> str:
    """Claude API로 콘텐츠를 생성한다.

    Args:
        api_key: Anthropic API 키
        system_prompt: 시스템 프롬프트
        user_prompt: 사용자 프롬프트
        model: 사용할 모델

    Returns:
        생성된 텍스트 (JSON 문자열)
    """
    client = anthropic.Anthropic(api_key=api_key)

    message = client.messages.create(
        model=model,
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )

    result = message.content[0].text
    logger.debug(f"Anthropic 응답: {result[:100]}...")
    return result
