import React, { useState, useEffect } from 'react'
import { Steps, Card, Form, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Step1AgentConfig from '../components/wizard/Step1AgentConfig'
import Step2TestSelection from '../components/wizard/Step2TestSelection'
import Step3Confirm from '../components/wizard/Step3Confirm'
import Step4TestReport from '../components/wizard/Step4TestReport'
import Step4Testing from '../components/wizard/Step4Testing'
import type { TestCategory } from '../types'

const { Step } = Steps

const HomePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [testCategories, setTestCategories] = useState<TestCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [taskId, setTaskId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [startingTest, setStartingTest] = useState(false)
  const [testRunning, setTestRunning] = useState(false)

  const handleStartTest = async () => {
    try {
      const formData = await form.validateFields(['agent_url'])
      
      if (!formData.agent_url || !formData.agent_url.trim()) {
        message.error('Please configure Agent API URL first')
        return
      }

      const cleanedUrl = formData.agent_url.trim().replace(/&+$/, '')

      try {
        new URL(cleanedUrl)
      } catch {
        message.error('Please enter a valid URL address')
        return
      }

      if (!selectedCategories || selectedCategories.length === 0) {
        message.error('Please select at least one test category')
        return
      }

      setStartingTest(true)

      const response = await axios.post('/api/test/start', {
        agent_url: cleanedUrl,
        api_key: formData.api_key?.trim() || undefined,
        categories: selectedCategories,
      })

      setTaskId(response.data.task_id)
      setTestRunning(true)
      message.success('Test task started')
    } catch (error: any) {
      if (error?.errorFields) {
        message.error('Please check if the form is filled correctly')
        return
      }
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to start test'
      message.error(`Failed to start test: ${errorMessage}`)
      console.error('Failed to start test:', error)
    } finally {
      setStartingTest(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    axios.get('/api/test-categories')
      .then((res) => {
        if (res.data && res.data.categories) {
          setTestCategories(res.data.categories)
          setSelectedCategories(res.data.categories.map((cat: TestCategory) => cat.id))
        }
      })
      .catch((error) => {
        console.error('Failed to load test categories:', error)
        message.error('Unable to connect to the backend server. Please ensure the backend service is running (http://localhost:8000)')
        setTestCategories([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const canGoToStep = (targetStep: number): boolean => {
    // Always allow going to step 3 for viewing sample report
    if (targetStep === 3) {
      return true
    }

    if (targetStep <= currentStep) {
      return true
    }
    
    if (targetStep === 1) {
      const formData = form.getFieldsValue()
      return !!(formData?.agent_url && formData.agent_url.trim() !== '')
    }
    
    if (targetStep === 2) {
      return selectedCategories && selectedCategories.length > 0
    }
    
    return false
  }

  const steps = [
    {
      title: 'Configure Agent',
      content: (
        <Step1AgentConfig
          form={form}
          onNext={() => {
            form.validateFields(['agent_url'])
              .then(() => {
                setCurrentStep(1)
              })
              .catch((errorInfo) => {
                console.error('Form validation failed:', errorInfo)
              })
          }}
        />
      ),
    },
    {
      title: 'Select Tests',
      content: (
        <Step2TestSelection
          categories={testCategories}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          onNext={() => {
            if (selectedCategories && selectedCategories.length > 0) {
              setCurrentStep(2)
            } else {
              message.warning('Please select at least one test category')
            }
          }}
          onPrev={() => setCurrentStep(0)}
        />
      ),
    },
    {
      title: 'Confirm',
      content: (
        <Step3Confirm
          key={`step3-${currentStep}`}
          form={form}
          selectedCategories={selectedCategories}
          testCategories={testCategories}
          currentStep={currentStep}
          onNext={handleStartTest}
          onPrev={() => setCurrentStep(1)}
          loading={startingTest}
        />
      ),
    },
    {
      title: 'Test Report',
      content: testRunning && taskId ? (
        <Step4Testing
          taskId={taskId}
          onComplete={(taskId) => {
            navigate(`/result/${taskId}`)
          }}
        />
      ) : (
        <Step4TestReport
          showSample={true}
          onStartTest={handleStartTest}
        />
      ),
    },
  ]

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '100px 0' }}>
        <Card>
          <p>Loading test categories...</p>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {currentStep === 0 && (
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <h2 style={{ color: '#1890ff', marginBottom: '12px' }}>
              Welcome to Agent Security Testing Platform
            </h2>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              Complete Agent security testing quickly through a wizard-like process. Please follow the steps below to complete the configuration.
            </p>
          </div>
        </Card>
      )}
      
      <Card>
        <Steps 
          current={currentStep} 
          style={{ marginBottom: '32px' }}
          onChange={(step) => {
            if (canGoToStep(step)) {
              setCurrentStep(step)
            } else {
              message.warning('Please complete the current step first')
            }
          }}
        >
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div style={{ minHeight: '400px', padding: '24px 0' }}>
          {steps[currentStep].content}
        </div>
      </Card>
    </div>
  )
}

export default HomePage
