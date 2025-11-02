# Agent Security Testing Platform

A web platform for testing AI Agent security, featuring a wizard-like process and multi-dimensional security testing.

## Features

### 🔒 Test Dimensions

The platform provides 12 security test dimensions with 60+ test cases:

1. **Discrimination Testing** - Detects discriminatory responses regarding gender, race, age, region, disability, etc.
2. **Violence Testing** - Tests if the Agent can be induced to produce violent, threatening, or harmful content
3. **Sensitive Info Leakage** - Detects leakage of system prompts, API keys, training data, etc.
4. **Prompt Injection** - Tests the Agent's ability to resist prompt injection attacks
5. **Bias Testing** - Detects bias in occupation, culture, religion, etc.
6. **Harmful Content** - Detects generation of harmful content related to drugs, cybercrime, fraud, etc.
7. **Privacy Violation** - Detects user data tracking, location information leakage, etc.
8. **Misinformation** - Detects false information propagation in medical, historical, and other fields
9. **Toxicity** - Detects abusive language, hate speech, etc.
10. **Data Leakage** - Detects model parameters, training samples leakage, etc.
11. **Jailbreak** - Detects DAN attacks, developer mode bypass, etc.
12. **Rate Limit** - Tests rate limiting mechanisms

### 🎯 Core Features

- ✅ **Wizard-like Test Process** - Complete test configuration and execution in 4 steps
- ✅ **Multi-dimensional Test Selection** - Select specific test categories or all tests
- ✅ **Real-time Test Progress** - Display test execution progress and current test items
- ✅ **Detailed Test Reports** - Include test results, vulnerability details, response content, etc.
- ✅ **Visual Analysis** - Display test results distribution through charts
- ✅ **Category Viewing** - View all tests or only failed tests
- ✅ **Sample Report** - Preview report format before running tests

## Tech Stack

### Frontend
- React 18 + TypeScript
- Ant Design 5.x
- Vite
- React Router
- ECharts (Data Visualization)
- Axios

### Backend
- FastAPI
- Python 3.9+
- httpx (Async HTTP Client)
- Celery (Optional, for task queue)

## Quick Start

### Requirements

- Node.js 18+
- Python 3.9+
- Redis (Optional, for task queue)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/duliangkuan/Agent_test.git
cd Agent_test
```

2. **Install backend dependencies**

```bash
pip install -r requirements.txt
```

3. **Install frontend dependencies**

```bash
npm install
```

### Running the Project

#### Development Mode

**Start backend service** (in project root):

```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Start frontend service** (in project root):

```bash
npm run dev
```

Visit http://localhost:3000 to use the platform.

#### Production Mode

**Build frontend**:

```bash
npm run build
```

**Start backend** (recommend using production WSGI server):

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Usage Guide

### Test Workflow

1. **Configure Agent Information**
   - Enter the Agent API endpoint URL
   - Optional: Enter API key (if authentication is required)

2. **Select Test Categories**
   - Choose tests from 12 test dimensions
   - Support selecting all or specific categories
   - Each category displays the test case count

3. **Confirm Configuration**
   - Review Agent configuration and selected test categories
   - Click "Start Testing" when ready

4. **View Report** (Step 4)
   - Preview sample report anytime to see report format
   - Click "Start Real Test" to begin testing
   - Monitor real-time test progress
   - Automatically navigate to results page upon completion

### Viewing Test Results

The test results page provides:

- **Test Summary**: Total tests, pass rate, failures, etc.
- **Visual Charts**: Distribution of test results by category and severity
- **Detailed Result Table**: Expand to view detailed information for each test case
  - Agent response content
  - Detected vulnerability details
  - Response time, etc.

## Deployment

### Deploy Frontend to Vercel

Your frontend is already deployed at: **https://agent-test-platform.vercel.app**

For updates, simply push to GitHub - Vercel will auto-deploy.

### Deploy Backend

The backend needs separate hosting. Recommended options:

- **Railway**: https://railway.app (easiest)
- **Render**: https://render.com
- **Your own server**

See `DEPLOYMENT.md` for detailed instructions.

## API Documentation

After starting the backend service, visit http://localhost:8000/docs to view auto-generated API documentation.

### Main API Endpoints

- `GET /api/test-categories` - Get all test categories
- `GET /api/test-cases` - Get test case list
- `POST /api/test/start` - Start test task
- `GET /api/test/status/{task_id}` - Get test task status
- `GET /api/test/result/{task_id}` - Get test results

## Project Structure

```
Agent_test/
├── backend/                 # Backend code
│   ├── main.py             # FastAPI main file
│   ├── test_engine.py      # Test engine
│   ├── test_standards.py   # Test standards definition
│   ├── run.py              # Run script
│   └── __init__.py
├── src/                    # Frontend code
│   ├── components/         # React components
│   │   ├── wizard/        # Wizard step components
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── ErrorBoundary.tsx
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx   # Home page (wizard flow)
│   │   └── TestResultPage.tsx  # Results page
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx
│   └── main.tsx
├── package.json           # Frontend dependencies
├── requirements.txt       # Backend dependencies
├── vite.config.ts        # Vite configuration
├── vercel.json           # Vercel configuration
└── README.md
```

## License

MIT License

## Contributing

Welcome to submit Issues and Pull Requests!

