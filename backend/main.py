"""
FastAPI backend main file
Provides Agent security testing API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import asyncio
from datetime import datetime
import uuid

from test_engine import AgentSecurityTester
from test_standards import TestCategory, TestStandards

app = FastAPI(title="Agent Security Testing Platform", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://agent-test-platform.vercel.app",
        "https://agent-test-platform-duliangkuans-projects.vercel.app",
    ],
    allow_origin_regex=r"https://agent-test-platform.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store test task status
test_tasks: Dict[str, Dict[str, Any]] = {}

# Test standards instance
test_standards = TestStandards()


class TestRequest(BaseModel):
    """Test request model"""
    agent_url: str = Field(..., description="Agent API endpoint URL")
    api_key: Optional[str] = Field(None, description="API key (if needed)")
    categories: Optional[List[str]] = Field(None, description="List of categories to test, empty means all")
    test_case_ids: Optional[List[str]] = Field(None, description="List of test case IDs to execute")


class TestResponse(BaseModel):
    """Test response model"""
    task_id: str
    status: str
    message: str


class TaskStatusResponse(BaseModel):
    """Task status response"""
    task_id: str
    status: str  # pending, running, completed, failed
    progress: float
    current_test: Optional[str]
    results: Optional[List[Dict[str, Any]]]
    summary: Optional[Dict[str, Any]]
    error: Optional[str]


@app.get("/")
async def root():
    """Root path"""
    return {
        "name": "Agent Security Testing Platform",
        "version": "1.0.0",
        "description": "Provides Agent security testing services"
    }


@app.get("/api/test-categories")
async def get_test_categories():
    """Get all test categories"""
    categories = []
    for category in TestCategory:
        cases = test_standards.get_cases_by_category(category)
        categories.append({
            "id": category.value,
            "name": _get_category_name(category),
            "description": _get_category_description(category),
            "test_case_count": len(cases)
        })
    return {"categories": categories}


@app.get("/api/test-cases")
async def get_test_cases(category: Optional[str] = None):
    """Get test case list"""
    if category:
        try:
            test_category = TestCategory(category)
            cases = test_standards.get_cases_by_category(test_category)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid category: {category}")
    else:
        cases = test_standards.test_cases
    
    return {
        "test_cases": [
            {
                "id": case.id,
                "name": case.name,
                "category": case.category.value,
                "category_name": _get_category_name(case.category),
                "description": case.description,
                "severity": case.severity.value,
                "severity_name": _get_severity_name(case.severity),
                "tags": case.tags or []
            }
            for case in cases
        ]
    }


@app.get("/api/test-statistics")
async def get_test_statistics():
    """Get test standard statistics"""
    stats = test_standards.get_statistics()
    return stats


@app.post("/api/test/start", response_model=TestResponse)
async def start_test(request: TestRequest):
    """Start test task"""
    task_id = str(uuid.uuid4())
    
    # Initialize task status
    test_tasks[task_id] = {
        "status": "pending",
        "progress": 0.0,
        "current_test": None,
        "results": None,
        "summary": None,
        "error": None,
        "created_at": datetime.now().isoformat()
    }
    
    # Execute test asynchronously
    asyncio.create_task(_run_test(task_id, request))
    
    return TestResponse(
        task_id=task_id,
        status="pending",
        message="Test task created"
    )


@app.get("/api/test/status/{task_id}", response_model=TaskStatusResponse)
async def get_test_status(task_id: str):
    """Get test task status"""
    if task_id not in test_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = test_tasks[task_id]
    return TaskStatusResponse(**task)


@app.get("/api/test/result/{task_id}")
async def get_test_result(task_id: str):
    """Get test result details"""
    if task_id not in test_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = test_tasks[task_id]
    
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="Test not completed yet")
    
    return {
        "task_id": task_id,
        "results": task["results"],
        "summary": task["summary"],
        "created_at": task["created_at"]
    }


async def _run_test(task_id: str, request: TestRequest):
    """Execute test task (async)"""
    try:
        # Update status to running
        test_tasks[task_id]["status"] = "running"
        
        # Parse test categories
        categories = None
        if request.categories:
            try:
                categories = [TestCategory(cat) for cat in request.categories]
            except ValueError as e:
                test_tasks[task_id]["status"] = "failed"
                test_tasks[task_id]["error"] = f"Invalid test category: {str(e)}"
                return
        
        # Get test cases
        test_cases = None
        if request.test_case_ids:
            test_cases = [
                test_standards.get_case_by_id(cid) for cid in request.test_case_ids
            ]
        
        # Create tester
        tester = AgentSecurityTester(request.agent_url, request.api_key)
        
        # Execute test
        results = await tester.test_agent(test_cases=test_cases, categories=categories)
        
        # Update progress callback (simplified version, can be more detailed)
        total = len(results)
        for i, result in enumerate(results):
            test_tasks[task_id]["progress"] = (i + 1) / total * 100
            test_tasks[task_id]["current_test"] = result.test_case.name
        
        # Get summary
        summary = tester.get_summary()
        
        # Save results
        test_tasks[task_id]["status"] = "completed"
        test_tasks[task_id]["progress"] = 100.0
        test_tasks[task_id]["current_test"] = None
        test_tasks[task_id]["results"] = [r.to_dict() for r in results]
        test_tasks[task_id]["summary"] = summary
        
    except Exception as e:
        test_tasks[task_id]["status"] = "failed"
        test_tasks[task_id]["error"] = str(e)


def _get_category_name(category: TestCategory) -> str:
    """Get category English name"""
    names = {
        TestCategory.DISCRIMINATION: "Discrimination",
        TestCategory.VIOLENCE: "Violence",
        TestCategory.SENSITIVE_INFO: "Sensitive Info Leakage",
        TestCategory.PROMPT_INJECTION: "Prompt Injection",
        TestCategory.BIAS: "Bias",
        TestCategory.HARMFUL_CONTENT: "Harmful Content",
        TestCategory.PRIVACY_VIOLATION: "Privacy Violation",
        TestCategory.MISINFORMATION: "Misinformation",
        TestCategory.TOXICITY: "Toxicity",
        TestCategory.DATA_LEAKAGE: "Data Leakage",
        TestCategory.JAILEXEC: "Jailbreak",
        TestCategory.RATE_LIMIT: "Rate Limit"
    }
    return names.get(category, category.value)


def _get_category_description(category: TestCategory) -> str:
    """Get category description"""
    descriptions = {
        TestCategory.DISCRIMINATION: "Tests if Agent has discriminatory responses regarding gender, race, age, etc.",
        TestCategory.VIOLENCE: "Tests if Agent can be induced to produce violent, threatening harmful content",
        TestCategory.SENSITIVE_INFO: "Tests if Agent leaks sensitive information like system prompts, API keys, etc.",
        TestCategory.PROMPT_INJECTION: "Tests Agent's ability to resist prompt injection attacks",
        TestCategory.BIAS: "Tests if Agent has biases in occupation, culture, religion, etc.",
        TestCategory.HARMFUL_CONTENT: "Tests if Agent provides harmful content related to drugs, crime, etc.",
        TestCategory.PRIVACY_VIOLATION: "Tests if Agent leaks user privacy information",
        TestCategory.MISINFORMATION: "Tests if Agent generates or spreads false information",
        TestCategory.TOXICITY: "Tests if Agent tolerates or generates abusive, hate speech",
        TestCategory.DATA_LEAKAGE: "Tests if Agent leaks training data or model information",
        TestCategory.JAILEXEC: "Tests Agent's ability to resist jailbreak attacks (e.g., DAN attacks)",
        TestCategory.RATE_LIMIT: "Tests Agent's rate limiting mechanism"
    }
    return descriptions.get(category, "")


def _get_severity_name(severity) -> str:
    """Get severity English name"""
    names = {
        "critical": "Critical",
        "high": "High",
        "medium": "Medium",
        "low": "Low",
        "info": "Info"
    }
    return names.get(severity.value if hasattr(severity, 'value') else severity, severity)
