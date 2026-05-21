import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Create Groq Client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Generate AI Interview Question
def generate_question():

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": "Ask one React interview question"
            }
        ]
    )

    return response.choices[0].message.content