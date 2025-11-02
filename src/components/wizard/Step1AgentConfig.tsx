import React from 'react'
import { Form, Input, Button, Space, Alert, Typography, Card, Collapse } from 'antd'
import { FormInstance } from 'antd/es/form'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Text, Paragraph } = Typography
const { Panel } = Collapse

interface Step1AgentConfigProps {
  form: FormInstance
  onNext: () => void
}

const Step1AgentConfig: React.FC<Step1AgentConfigProps> = ({ form, onNext }) => {
  return (
    <div>
      <Alert
        message="Configure Agent Information"
        description="Please enter the Agent API endpoint URL you want to test. This is typically the HTTP API interface address provided by your AI Agent service."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card size="small" style={{ marginBottom: '24px', backgroundColor: '#f5f5f5' }}>
        <Collapse ghost>
          <Panel 
            header={
              <Space>
                <InfoCircleOutlined />
                <Text strong>How to get Agent API URL?</Text>
              </Space>
            } 
            key="help"
          >
            <div style={{ paddingLeft: '24px' }}>
              <Paragraph>
                <Text strong>Agent API URL is the HTTP interface address provided by your AI Agent service.</Text>
              </Paragraph>
              
              <Paragraph>
                <Text strong>Common examples:</Text>
              </Paragraph>
              <ul style={{ marginLeft: '20px' }}>
                <li>
                  <Text code>https://api.openai.com/v1/chat/completions</Text>
                  <Text type="secondary"> (OpenAI Official API)</Text>
                </li>
                <li>
                  <Text code>https://api.coze.cn/open_api/v2/chat</Text>
                  <Text type="secondary"> (Coze API)</Text>
                </li>
                <li>
                  <Text code>https://api.example.com/v1/chat</Text>
                  <Text type="secondary"> (Custom Agent Service)</Text>
                </li>
                <li>
                  <Text code>http://localhost:8080/api/chat</Text>
                  <Text type="secondary"> (Locally Deployed Agent)</Text>
                </li>
              </ul>

              <Paragraph>
                <Text strong>🎯 Coze Agent API Setup Steps:</Text>
              </Paragraph>
              <ol style={{ marginLeft: '20px' }}>
                <li>
                  <Text strong>Login to Coze Platform:</Text> Visit <Text code>https://www.coze.cn/</Text> and login
                </li>
                <li>
                  <Text strong>Create and Publish Agent:</Text>
                  <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
                    <li>Create your Agent on the Coze platform</li>
                    <li>Click "Publish" after completing the configuration</li>
                    <li>Record the Agent ID after successful publishing</li>
                  </ul>
                </li>
                <li>
                  <Text strong>Get API Credentials:</Text>
                  <ul style={{ marginLeft: '20px', marginTop: '4px' }}>
                    <li>Go to "Coze API" or "Developer Settings"</li>
                    <li>Create OAuth app or get API key</li>
                    <li>Get <Text code>Client ID</Text> and <Text code>Client Secret</Text> (or Access Token)</li>
                  </ul>
                </li>
                <li>
                  <Text strong>API URL Format:</Text>
                  <br />
                  <Text code style={{ display: 'block', marginTop: '4px' }}>
                    https://api.coze.cn/open_api/v2/chat
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    Note: Coze API requires authentication info in the request header, please fill in the Access Token in the "API Key" field below
                  </Text>
                </li>
              </ol>

              <Paragraph>
                <Text strong>Other Common Platforms:</Text>
              </Paragraph>
              <ul style={{ marginLeft: '20px' }}>
                <li>Check your Agent service provider's official documentation</li>
                <li>Check the endpoint defined in the Agent service configuration file</li>
                <li>If you deployed it yourself, check the API address displayed when the service starts</li>
                <li>Usually in the format: <Text code>protocol://domain:port/path</Text></li>
              </ul>

              <Paragraph>
                <Text strong>Note:</Text>
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                  <li>URL must start with <Text code>http://</Text> or <Text code>https://</Text></li>
                  <li>Ensure the API endpoint accepts POST requests</li>
                  <li>API should support JSON format request body</li>
                  <li>If the API requires authentication, please fill in the API key below</li>
                </ul>
              </Paragraph>
            </div>
          </Panel>
        </Collapse>
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          agent_url: '',
          api_key: '',
        }}
      >
        <Form.Item
          label="Agent API URL"
          name="agent_url"
          rules={[
            { required: true, message: 'Please enter Agent API URL' },
            {
              validator: (_, value) => {
                if (!value || value.trim() === '') {
                  return Promise.resolve()
                }
                const cleanedUrl = value.trim().replace(/&+$/, '')
                try {
                  new URL(cleanedUrl)
                  if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
                    return Promise.reject(new Error('URL must start with http:// or https://'))
                  }
                  return Promise.resolve()
                } catch {
                  return Promise.reject(new Error('Please enter a valid URL address'))
                }
              },
            },
          ]}
          extra="Please enter the complete API endpoint address, e.g.: https://api.openai.com/v1/chat/completions"
        >
          <Input
            placeholder="https://api.openai.com/v1/chat/completions"
            size="large"
            onBlur={(e) => {
              const value = e.target.value
              if (value) {
                const cleaned = value.trim().replace(/&+$/, '')
                if (cleaned !== value) {
                  form.setFieldValue('agent_url', cleaned)
                }
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="API Key (Optional)"
          name="api_key"
          extra={
            <div>
              <div>If the Agent requires an API key for authentication, please enter it here</div>
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                💡 <Text strong>Coze Users:</Text> Please fill in Access Token or Bearer Token here
              </div>
            </div>
          }
        >
          <Input.Password
            placeholder="Enter API key"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" size="large" onClick={onNext}>
              Next
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Step1AgentConfig
