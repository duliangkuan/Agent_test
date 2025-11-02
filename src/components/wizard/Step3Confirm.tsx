import React, { useState, useEffect, useMemo } from 'react'
import { Card, Descriptions, Button, Space, Tag, Typography, Divider, Alert } from 'antd'
import { FormInstance } from 'antd/es/form'
import type { TestCategory } from '../../types'

const { Title } = Typography

interface Step3ConfirmProps {
  form: FormInstance
  selectedCategories: string[]
  testCategories: TestCategory[]
  currentStep?: number
  onNext: () => void
  onPrev: () => void
  loading?: boolean
}

const Step3Confirm: React.FC<Step3ConfirmProps> = ({
  form,
  selectedCategories,
  testCategories,
  currentStep,
  onNext,
  onPrev,
  loading = false,
}) => {
  // Use state to store form data
  const [formData, setFormData] = useState(() => form.getFieldsValue())
  
  // Update state immediately when component mounts, displays, or step changes
  useEffect(() => {
    // Immediately get latest form values
    const updateFormData = () => {
      const currentValues = form.getFieldsValue()
      setFormData(currentValues)
    }
    
    // Update once immediately
    updateFormData()
    
    // Use a short delay to update again, ensuring all async updates are captured
    // This helps with handling async form value updates
    const timeoutId = setTimeout(updateFormData, 50)
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [form, currentStep]) // Re-fetch form values when form or currentStep changes
  
  const selectedCategoryNames = testCategories
    .filter((cat) => selectedCategories.includes(cat.id))
    .map((cat) => cat.name)

  // Get latest form data (fetch latest values from form on each render for sync)
  // Directly getting values from form is the most reliable way, as form is the single source of truth
  const latestFormData = useMemo(() => {
    const currentFormValues = form.getFieldsValue()
    // Directly use form values, use empty string if not exists
    return {
      agent_url: currentFormValues.agent_url || '',
      api_key: currentFormValues.api_key || '',
    }
  }, [form, formData]) // formData as dependency to ensure recalculation when state updates

  // Check if configuration is complete (real-time validation)
  const isConfigValid = useMemo(() => {
    const url = latestFormData?.agent_url
    const hasValidUrl = url && typeof url === 'string' && url.trim() !== ''
    const hasCategories = selectedCategories && Array.isArray(selectedCategories) && selectedCategories.length > 0
    return !!(hasValidUrl && hasCategories)
  }, [latestFormData, selectedCategories])

  return (
    <div>
      <Title level={4}>Confirm Test Configuration</Title>

      {!isConfigValid && (
        <Alert
          message="Configuration Incomplete"
          description={
            <div>
              <div style={{ marginBottom: '8px' }}>Please ensure the following configurations are complete:</div>
              <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                {(!latestFormData?.agent_url || latestFormData.agent_url.trim() === '') && (
                  <li>❌ <strong>Agent API URL</strong> - Not filled or empty</li>
                )}
                {(!selectedCategories || selectedCategories.length === 0) && (
                  <li>❌ <strong>Test Categories</strong> - No test categories selected</li>
                )}
              </ul>
              <div style={{ marginTop: '8px' }}>
Please go back to complete the configuration before continuing.
              </div>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}
      
      {isConfigValid && (
        <Alert
          message="Configuration Complete"
          description="All required configuration items have been filled. You can start testing."
          type="success"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Card style={{ marginBottom: '24px' }}>
        <Descriptions title="Agent Configuration" bordered column={1}>
          <Descriptions.Item 
            label="API URL"
            labelStyle={{ fontWeight: 'bold', width: '150px' }}
          >
            <span style={{ 
              color: latestFormData.agent_url && latestFormData.agent_url.trim() !== '' ? '#52c41a' : '#ff4d4f',
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}>
              {latestFormData.agent_url && latestFormData.agent_url.trim() !== '' ? latestFormData.agent_url : '-'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item 
            label="API Key"
            labelStyle={{ fontWeight: 'bold', width: '150px' }}
          >
            <span style={{ 
              color: latestFormData.api_key ? '#52c41a' : '#999'
            }}>
              {latestFormData.api_key ? '***Configured***' : 'Not configured (optional)'}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Descriptions title="Test Configuration" bordered column={1}>
          <Descriptions.Item label="Test Categories">
            <Space wrap>
              {selectedCategoryNames.map((name) => (
                <Tag key={name} color="blue">
                  {name}
                </Tag>
              ))}
            </Space>
            <div style={{ marginTop: '8px', color: '#666' }}>
              {selectedCategories.length} test categor{selectedCategories.length > 1 ? 'ies' : 'y'} selected
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={onPrev} disabled={loading}>
          Previous
        </Button>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => {
            // Validate configuration again to ensure latest data
            const latestFormData = form.getFieldsValue()
            const latestUrl = latestFormData?.agent_url
            const hasValidUrl = latestUrl && typeof latestUrl === 'string' && latestUrl.trim() !== ''
            const hasCategories = selectedCategories && Array.isArray(selectedCategories) && selectedCategories.length > 0
            
            if (!hasValidUrl) {
              return // Don't execute, button should be disabled
            }
            if (!hasCategories) {
              return // Don't execute, button should be disabled
            }
            
            // Configuration complete, proceed to next step
            onNext()
          }}
          loading={loading}
          disabled={!isConfigValid || loading}
        >
          Start Testing
        </Button>
      </Space>
    </div>
  )
}

export default Step3Confirm
