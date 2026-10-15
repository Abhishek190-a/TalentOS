import json, re
from backend.ai.llm_client import complete
from backend.ai.prompts import BRIEF_EXTRACTION_SYSTEM
from backend.ai.fallback import parse_brief_fallback

async def parse_brief(text: str, projects: list[dict]) -> dict:
    raw=await complete(BRIEF_EXTRACTION_SYSTEM, text)
    parsed=None
    if raw:
        try:
            cleaned=re.sub(r"^```(?:json)?|```$", "", raw.strip(), flags=re.I|re.M).strip()
            obj=json.loads(cleaned)
            required=obj.get("required",{})
            if isinstance(required,dict) and required:
                total=sum(max(0,float(v.get("weight",1))) for v in required.values()) or 1
                normalized={}
                for skill,v in required.items():
                    normalized[str(skill)]={"level":max(1,min(int(v.get("level",3)),5)),"weight":round(max(0,float(v.get("weight",1)))/total,3)}
                parsed={"name":str(obj.get("name","Brief project")),"brief":text,"hours_needed":max(8,min(int(obj.get("hours_needed",120)),1000)),"team_size":max(1,min(int(obj.get("team_size",4)),8)),"required":normalized,"source":"llm"}
        except (json.JSONDecodeError, TypeError, ValueError, AttributeError):
            parsed=None
    return parsed or parse_brief_fallback(text,projects)
