from pydantic import BaseModel
from datetime import datetime


class InterviewAnswer(BaseModel):

    user_id: int
    question: str
    answer: str
    timestamp: datetime