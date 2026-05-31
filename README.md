# 🤖 Nexus AI — Interview Simulator

A full-featured AI-powered Interview Simulator built with React + FastAPI that helps users practice HR, behavioral, and technical interviews with a real-time AI interviewer using voice and text.

## 📖 About Project

Nexus AI is a web-based interview practice platform designed to help students and job seekers prepare for real interviews.

It provides an intelligent AI interviewer that asks questions, listens to your answers, scores your performance, and gives detailed feedback — all without needing a human on the other side.

It is built for:

- Students preparing for campus placements
- Job seekers practicing HR & behavioral rounds
- Developers prepping for technical viva / coding interviews
- Colleges running AI-assisted viva examinations

## Features

### 🤖 AI Interviewer
- Asks HR, behavioral & technical questions
- Understands and evaluates your answers
- Generates follow-up questions based on responses
- Provides final performance feedback

### 🎙️ Voice & Text Support
- Speak your answers using microphone
- Type answers as fallback
- AI speaks questions aloud via text-to-speech
- Real-time speech-to-text transcription

### 📊 Scoring & Feedback
- Live confidence, clarity & pace scoring
- Per-answer quality analysis
- Final session feedback report
- Performance history tracking

### 🔐 Authentication System
- Secure JWT login / logout
- Google OAuth support
- Role-based access control
- Password hashing & rate limiting

## Tech Stack

**Client:** React.js, Next.js, Tailwind CSS

**Server:** Python, FastAPI, PostgreSQL

**AI & Voice:** OpenAI GPT-4o, Whisper API, ElevenLabs TTS

## Installation

🔽 1. Clone the Repository

```bash
git clone https://github.com/harry7705/nexus-ai.git
cd nexus-ai
```

🐍 2. Create Virtual Environment

```bash
python -m venv venv
```

▶️ 3. Activate Virtual Environment

```bash
venv\Scripts\activate   # Windows
# OR
source venv/bin/activate   # Mac/Linux
```

📦 4. Install Dependencies

```bash
pip install -r requirements.txt
```

🔑 5. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your keys:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/nexus_ai
OPENAI_API_KEY=sk-your-openai-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key-here
SECRET_KEY=your-jwt-secret-key
```

🗄️ 6. Apply Migrations

```bash
alembic upgrade head
```

▶️ 7. Run Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

🌐 8. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## Screenshots

soon...

## Contributing

Contributions are always welcome!

`Fork the repository`

`Create new branch (git checkout -b feature-name)`

`Commit changes (git commit -m "Add feature")`

`Push branch (git push origin feature-name)`

`Open Pull Request`

## Authors

- [@harry7705](https://github.com/harry7705)
- [@priyanshu145](https://github.com/priyanshu145)

## Support

For support, email harry770504@gmail.com