from backend.config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL

_client = None
_client_initialized = False

def _get_client():
    global _client, _client_initialized
    if _client_initialized:
        return _client
    _client_initialized = True
    if not LLM_API_KEY:
        return None
    try:
        from openai import AsyncOpenAI
        _client = AsyncOpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)
    except ImportError:
        _client = None
    return _client

async def complete(system_prompt: str, user_prompt: str) -> str | None:
    """Return generated text, or None when Groq is unavailable so callers can fall back."""
    client = _get_client()
    if client is None:
        return None
    try:
        response = await client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role":"system","content":system_prompt},{"role":"user","content":user_prompt}],
            temperature=0.2,
        )
        return response.choices[0].message.content or None
    except Exception:
        return None

async def generate_response(prompt: str) -> str:
    result = await complete("You are the TalentOS workforce intelligence assistant.", prompt)
    if result is None:
        raise RuntimeError("Groq is unavailable or LLM_API_KEY is not configured")
    return result
