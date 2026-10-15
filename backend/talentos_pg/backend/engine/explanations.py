def explain_selection(member: dict) -> str:
    b = member.get("breakdown", {})
    return f"Selected with {member.get('match', 0):.1f}% match: skills {b.get('skill', 0):.0f}%, experience {b.get('exp', 0):.0f}%, availability {b.get('avail', 0):.0f}%."
