import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_question():

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """
                You are a professional AI interviewer.

                Ask ONLY ONE short interview question.

                Rules:
                - Keep it under 20 words
                - No explanations
                - No formatting
                - No answers
                - No bullet points

                Example:
                What is useEffect in React?
                """
            }
        ]
    )

    return response.choices[0].message.content