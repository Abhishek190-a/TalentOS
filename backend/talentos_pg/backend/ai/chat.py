from backend.ai.llm_client import complete
from backend.ai.prompts import CHAT_SYSTEM
from backend.ai.fallback import fallback_chat

async def answer_chat(message: str, context: dict) -> dict:
    raw = await complete(CHAT_SYSTEM, f"Context: {context}\nUser question: {message}")
    if raw and raw.strip():
        return {"answer": raw.strip(), "source": "llm"}
    return {"answer": fallback_chat(message), "source": "template_fallback"}
