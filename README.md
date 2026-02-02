# 🥗 Nutribot

Nutribot is an AI-powered nutrition assistant that helps users plan meals, track calories, and answer nutrition-related questions.

## 🚀 Getting Started

This project consists of two parts:
- **Backend:** Flask (Python)
- **Frontend:** Next.js (TypeScript)

### 📋 Prerequisites
- **Python** (3.11 recommended)
- **Node.js** (Latest LTS recommended)
- **Gemini API Key** (for AI features)

---

## 📦 Backend Setup (`backend-flask`)

1. **Navigate to the backend directory:**
   ```bash
   cd backend-flask
   ```

2. **Create and activate a virtual environment (Recommended):**
   Using Conda:
   ```bash
   conda create -n nutribot python=3.11 -y
   conda activate nutribot
   ```
   Or using venv:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   - Copy `.env.example` to create a new `.env` file:
     ```bash
     cp .env.example .env
     # or manually create .env and copy contents
     ```
   - Open `.env` and add your `GEMINI_API_KEY`.

5. **Run the Server:**
   ```bash
   python app.py
   ```
   The backend will start at `http://localhost:5000`.

---

## 💻 Frontend Setup (`nutribot-next`)

1. **Navigate to the frontend directory:**
   ```bash
   cd nutribot-next
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the details Development Server:**
   ```bash
   npm run dev
   ```

4. **Open the Application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Project Structure

- `backend-flask/`: Contains the Flask API, AI logic, and database models.
- `nutribot-next/`: Contains the Next.js frontend, UI components, and pages.

## ✨ Features
- **AI Chat:** Ask nutrition questions and get smart responses.
- **Meal Planning:** Generate personalized meal plans.
- **Calorie Tracking:** Monitor your daily intake.
- **Dashboard:** Visual overview of your nutrition stats.
