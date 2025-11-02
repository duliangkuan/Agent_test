import React, { useState } from 'react'
import { Card, Tabs, Button, Space, Divider, Row, Col, Statistic, Typography, Tag, Alert } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  EyeOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'

const { Title, Paragraph, Text } = Typography

interface Step4TestReportProps {
  showSample?: boolean
  onStartTest?: () => void
}

const Step4TestReport: React.FC<Step4TestReportProps> = ({ 
  showSample = false, 
  onStartTest 
}) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('statistics')

  // Sample data for demonstration
  const sampleSummary = {
    total_tests: 35,
    passed: 28,
    failed: 7,
    pass_rate: 80.0,
    critical_vulnerabilities: 2,
    average_response_time: 1.45,
    by_category: {
      'Discrimination': { passed: 4, failed: 1 },
      'Violence': { passed: 3, failed: 1 },
      'Sensitive Info Leakage': { passed: 4, failed: 0 },
      'Prompt Injection': { passed: 3, failed: 1 },
      'Bias': { passed: 3, failed: 0 },
      'Harmful Content': { passed: 3, failed: 0 },
      'Privacy Violation': { passed: 2, failed: 1 },
      'Misinformation': { passed: 2, failed: 1 },
      'Toxicity': { passed: 2, failed: 1 },
      'Data Leakage': { passed: 1, failed: 0 },
      'Jailbreak': { passed: 1, failed: 1 },
      'Rate Limit': { passed: 0, failed: 0 },
    },
    by_severity: {
      'critical': { passed: 4, failed: 2 },
      'high': { passed: 10, failed: 3 },
      'medium': { passed: 8, failed: 1 },
      'low': { passed: 5, failed: 1 },
      'info': { passed: 1, failed: 0 },
    }
  }

  const getCategoryChartOption = () => {
    const categories = Object.keys(sampleSummary.by_category)
    const passed = categories.map((cat) => sampleSummary.by_category[cat].passed)
    const failed = categories.map((cat) => sampleSummary.by_category[cat].failed)

    return {
      title: {
        text: 'Test Results by Category',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        data: ['Passed', 'Failed'],
        top: '10%',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          rotate: 45,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Passed',
          type: 'bar',
          data: passed,
          itemStyle: { color: '#52c41a' },
        },
        {
          name: 'Failed',
          type: 'bar',
          data: failed,
          itemStyle: { color: '#ff4d4f' },
        },
      ],
    }
  }

  const getSeverityChartOption = () => {
    const severities = Object.keys(sampleSummary.by_severity)
    const passed = severities.map((sev) => sampleSummary.by_severity[sev].passed)
    const failed = severities.map((sev) => sampleSummary.by_severity[sev].failed)

    return {
      title: {
        text: 'Test Results by Severity',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        data: ['Passed', 'Failed'],
        top: '10%',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: severities.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Passed',
          type: 'bar',
          data: passed,
          itemStyle: { color: '#52c41a' },
        },
        {
          name: 'Failed',
          type: 'bar',
          data: failed,
          itemStyle: { color: '#ff4d4f' },
        },
      ],
    }
  }

  const StatisticsPanel = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Statistic
            title="Total Tests"
            value={sampleSummary.total_tests}
            prefix={<WarningOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Passed"
            value={sampleSummary.passed}
            valueStyle={{ color: '#52c41a' }}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Failed"
            value={sampleSummary.failed}
            valueStyle={{ color: '#ff4d4f' }}
            prefix={<CloseCircleOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Pass Rate"
            value={sampleSummary.pass_rate}
            suffix="%"
            valueStyle={{ color: sampleSummary.pass_rate >= 80 ? '#52c41a' : '#ff4d4f' }}
          />
        </Col>
      </Row>

      {sampleSummary.critical_vulnerabilities > 0 && (
        <Alert
          message={`${sampleSummary.critical_vulnerabilities} Critical Vulnerabilities Found!`}
          description="Your Agent has critical security issues that require immediate attention."
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="Results by Category" size="small">
            <div style={{ height: '300px' }}>
              <ReactECharts option={getCategoryChartOption()} style={{ height: '100%' }} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Results by Severity" size="small">
            <div style={{ height: '300px' }}>
              <ReactECharts option={getSeverityChartOption()} style={{ height: '100%' }} />
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Summary Statistics" size="small">
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Average Response Time"
              value={sampleSummary.average_response_time}
              suffix="s"
              precision={2}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Total Categories Tested"
              value={Object.keys(sampleSummary.by_category).length}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Security Score"
              value={sampleSummary.pass_rate}
              suffix="/100"
              valueStyle={{ color: sampleSummary.pass_rate >= 80 ? '#52c41a' : '#ff4d4f' }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )

  const TextReportPanel = () => (
    <div>
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>Executive Summary</Title>
        <Paragraph>
          The comprehensive security assessment was conducted on the AI Agent system, 
          covering 12 major security categories and {sampleSummary.total_tests} individual test cases. 
          The overall security score is <Text strong>{sampleSummary.pass_rate}%</Text>.
        </Paragraph>
        <Paragraph>
          Out of {sampleSummary.total_tests} tests, <Text strong type="success">{sampleSummary.passed} passed</Text> and{' '}
          <Text strong type="danger">{sampleSummary.failed} failed</Text>. 
          {sampleSummary.critical_vulnerabilities > 0 && (
            <>
              {' '}Unfortunately, <Text strong type="danger">{sampleSummary.critical_vulnerabilities} critical vulnerabilities</Text> were identified that require immediate remediation.
            </>
          )}
        </Paragraph>
      </Card>

      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>Key Findings</Title>
        <Paragraph>
          <ol style={{ marginBottom: 0 }}>
            <li>
              <Text strong>Strengths:</Text> The Agent demonstrates robust security measures in most categories, 
              particularly in handling discrimination, bias, and harmful content detection.
            </li>
            <li>
              <Text strong>Weaknesses:</Text> Critical vulnerabilities were found in prompt injection and jailbreak scenarios, 
              indicating the need for enhanced instruction following and role-play attack prevention.
            </li>
            <li>
              <Text strong>Average Response Time:</Text> {sampleSummary.average_response_time} seconds - 
              within acceptable performance parameters.
            </li>
            <li>
              <Text strong>Recommendations:</Text> Implement additional input validation and system prompt hardening 
              to address identified security gaps.
            </li>
          </ol>
        </Paragraph>
      </Card>

      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>Category Breakdown</Title>
        <Row gutter={[16, 16]}>
          {Object.entries(sampleSummary.by_category).map(([category, stats]) => {
            const total = stats.passed + stats.failed
            const passRate = total > 0 ? ((stats.passed / total) * 100).toFixed(1) : '0'
            return (
              <Col span={8} key={category}>
                <Card size="small" hoverable>
                  <div style={{ marginBottom: '8px' }}>
                    <Tag color={stats.failed === 0 ? 'success' : 'warning'} style={{ marginBottom: '4px' }}>
                      {passRate}% Pass
                    </Tag>
                  </div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{category}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {stats.passed} passed, {stats.failed} failed
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Card>

      <Card>
        <Title level={4}>Conclusion</Title>
        <Paragraph>
          While the Agent demonstrates overall good security practices, the identified vulnerabilities 
          warrant immediate attention. Implementing the recommended security enhancements will significantly 
          improve the Agent's resilience against adversarial inputs and potential misuse scenarios.
        </Paragraph>
        <Paragraph>
          <Text strong>Risk Level:</Text>{' '}
          <Tag color={sampleSummary.critical_vulnerabilities > 0 ? 'red' : 'orange'}>
            {sampleSummary.critical_vulnerabilities > 0 ? 'HIGH' : 'MEDIUM'}
          </Tag>
        </Paragraph>
      </Card>
    </div>
  )

  return (
    <div>
      {showSample && (
        <Alert
          message="Sample Test Report"
          description="This is a sample report showing what your test results will look like. Click 'Start Real Test' below to run tests on your Agent."
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
          icon={<EyeOutlined />}
        />
      )}

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'statistics',
            label: (
              <span>
                <FileTextOutlined />
                Statistics Report
              </span>
            ),
            children: <StatisticsPanel />,
          },
          {
            key: 'text',
            label: (
              <span>
                <FileTextOutlined />
                Text Report
              </span>
            ),
            children: <TextReportPanel />,
          },
        ]}
      />

      <Divider />

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        {showSample && onStartTest && (
          <Button 
            type="primary" 
            size="large" 
            icon={<PlayCircleOutlined />}
            onClick={onStartTest}
          >
            Start Real Test
          </Button>
        )}
      </Space>
    </div>
  )
}

export default Step4TestReport

