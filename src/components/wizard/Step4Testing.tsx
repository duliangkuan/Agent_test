import React, { useState, useEffect } from 'react'
import { Card, Progress, Spin, Alert, Typography, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { TestSummary } from '../../types'

const { Title, Paragraph } = Typography

interface Step4TestingProps {
  taskId: string | null
  onComplete: (taskId: string) => void
}

const Step4Testing: React.FC<Step4TestingProps> = ({ taskId, onComplete }) => {
  const [status, setStatus] = useState<'running' | 'completed' | 'failed'>('running')
  const [progress, setProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState<string>('')
  const [summary, setSummary] = useState<TestSummary | null>(null)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!taskId) return

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/test/status/${taskId}`)
        const data = response.data

        setProgress(data.progress)
        setCurrentTest(data.current_test || '')
        setStatus(data.status)

        if (data.status === 'completed') {
          setSummary(data.summary)
          clearInterval(interval)
          setTimeout(() => {
            onComplete(taskId)
          }, 2000)
        } else if (data.status === 'failed') {
          setError(data.error || 'Test failed')
          clearInterval(interval)
        }
      } catch (err: any) {
        setError(err.message || 'Failed to get test status')
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [taskId, onComplete])

  if (status === 'failed') {
    return (
      <Card>
        <Alert
          message="Test Failed"
          description={error || 'An error occurred during testing'}
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate('/')}>
              Return to Re-test
            </Button>
          }
        />
      </Card>
    )
  }

  if (status === 'completed' && summary) {
    return (
      <Card>
        <Alert
          message="Test Completed!"
          description={`Executed ${summary.total_tests} tests, pass rate ${summary.pass_rate}%`}
          type="success"
          showIcon
        />
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Spin tip="Redirecting to results page..." />
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
        <Title level={4} style={{ marginTop: '24px' }}>
          Running Tests...
        </Title>
        <Progress
          percent={Math.round(progress)}
          status="active"
          style={{ maxWidth: '600px', margin: '24px auto' }}
        />
        {currentTest && (
          <Paragraph type="secondary">
            Current test: {currentTest}
          </Paragraph>
        )}
        <Paragraph type="secondary" style={{ marginTop: '16px' }}>
          Please wait, testing may take a few minutes
        </Paragraph>
      </div>
    </Card>
  )
}

export default Step4Testing
