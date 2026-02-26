"""OpenAI (GPT) AI 프로바이더"""

import logging

import openai

logger = logging.getLogger("x-content-bot")


def generate_with_openai(
    api_key: str,
    system_prompt: str,
    user_prompt: str,
    model: str = "gpt-4o-mini",
) -> str:
    """OpenAI API로 콘텐츠를 생성한다.

    Args:
        api_key: OpenAI API 키
        system_prompt: 시스템 프롬프트
        user_prompt: 사용자 프롬프트
        model: 사용할 모델

    Returns:
        생성된 텍스트 (JSON 문자열)
    """
    client = openai.OpenAI(api_key=api_key)

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=1024,
        temperature=0.8,
    )

    result = response.choices[0].message.content or ""
    logger.debug(f"OpenAI 응답: {result[:100]}...")
    return result
