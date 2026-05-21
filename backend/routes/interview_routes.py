from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import generate_question

router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)

# =========================
# Static Questions
# =========================

questions = [
    "Tell me about yourself",
    "What are your strengths?",
    "Why do you want this job?",
    "What is React?",
    "Explain API"
]

current_question_index = 0


# =========================
# Models
# =========================

class AnswerInput(BaseModel):
    answer: str


# =========================
# Start Interview
# =========================

@router.post("/start-interview")
def start_interview():

    global current_question_index

    current_question_index = 0

    return {
        "message": "Interview started",
        "first_question": questions[0]
    }


# =========================
# Static Question
# =========================

@router.get("/static-question")
def static_question():

    global current_question_index

    current_question_index += 1

    if current_question_index < len(questions):

        return {
            "question_number": current_question_index + 1,
            "question": questions[current_question_index]
        }

    return {
        "message": "No more questions"
    }


# =========================
# AI Question
# =========================

@router.get("/ai-question")
def ai_question():

    question = generate_question()

    return {
        "question": question
    }


# =========================
# Submit Answer
# =========================

@router.post("/submit-answer")
def submit_answer(data: AnswerInput):

    return {
        "message": "Answer submitted successfully",
        "your_answer": data.answer
    }


# =========================
# End Interview
# =========================

@router.post("/end-interview")
def end_interview():

    return {
        "message": "Interview ended"
    }


# =========================
# Result
# =========================

@router.get("/result")
def result():

    return {
        "score": "85/100",
        "feedback": "Good communication skills"
    }