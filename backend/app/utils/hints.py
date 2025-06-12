import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

import random

CLUE_TYPES = ["geography", "culture", "politics", "economy", "history", "demographics", "language"]

def generate_clue(country: str, previous_clues: list[str] = []) -> str:
    clue_type = random.choice(CLUE_TYPES)

    previous_clue_text = "\n".join(f"- {clue}" for clue in previous_clues)
    no_repeat_note = (
        f"Do not repeat or paraphrase any of the following previous clues:\n{previous_clue_text}\n"
        if previous_clues else ""
    )

    prompt = (
        f"Give a helpful {clue_type}-related clue about the country '{country}' "
        f"without stating or closely implying its name. Make it concise and factual. "
        f"{no_repeat_note}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a geography trivia assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=1.0,  # Encourage more variation
            max_tokens=60,
        )
        clue = response.choices[0].message.content.strip()
        return clue
    except Exception as e:
        return f"An error occurred while generating a clue: {e}"
