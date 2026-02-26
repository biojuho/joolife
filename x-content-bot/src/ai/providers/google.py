"""Google (Gemini) AI 프로바이더"""

import logging

import google.generativeai as genai

logger = logging.getLogger("x-content-bot")


def generate_with_google(
    api_key: str,
    system_prompt: str,
    user_prompt: str,
    model: str = "gemini-2.0-flash",
) -> str:
    """Gemini API로 콘텐츠를 생성한다.

    Args:
        api_key: Google AI API 키
        system_prompt: 시스템 프롬프트
        user_prompt: 사용자 프롬프트
        model: 사용할 모델

    Returns:
        생성된 텍스트 (JSON 문자열)
    """
    genai.configure(api_key=api_key)

    gen_model = genai.GenerativeModel(
        model_name=model,
        system_instruction=system_prompt,
    )

    response = gen_model.generate_content(user_prompt)
    result = response.text
    logger.debug(f"Google 응답: {result[:100]}...")
    return result
