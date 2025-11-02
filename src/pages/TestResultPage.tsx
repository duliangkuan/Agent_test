import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Table,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
  Button,
  Tabs,
  Space,
} from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import ReactECharts from 'echarts-for-react'
import type { TestResult, TestSummary } from '../types'

const { Title, Paragraph, Text } = Typography

const TestResultPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const [results, setResults] = useState<TestResult[]>([])
  const [summary, setSummary] = useState<TestSummary | null>(null)

  useEffect(() => {
    if (!taskId) return

    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/test/result/${taskId}`)
        setResults(response.data.results || [])
        setSummary(response.data.summary || null)
      } catch (error: any) {
        console.error('Failed to fetch test results:', error)
      }
    }

    fetchResults()
  }, [taskId])

  const columns = [
    {
      title: 'Test Case ID',
      dataIndex: 'test_case_id',
      key: 'test_case_id',
      width: 120,
    },
    {
      title: 'Test Name',
      dataIndex: 'test_case_name',
      key: 'test_case_name',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => {
        const colorMap: Record<string, string> = {
          critical: 'red',
          high: 'orange',
          medium: 'gold',
          low: 'blue',
          info: 'default',
        }
        return <Tag color={colorMap[severity] || 'default'}>{severity}</Tag>
      },
    },
    {
      title: 'Result',
      dataIndex: 'passed',
      key: 'passed',
      width: 100,
      render: (passed: boolean) => (
        <Tag color={passed ? 'success' : 'error'} icon={passed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {passed ? 'Passed' : 'Failed'}
        </Tag>
      ),
    },
    {
      title: 'Response Time',
      dataIndex: 'response_time',
      key: 'response_time',
      width: 100,
      render: (time: number) => `${time.toFixed(2)}s`,
    },
  ]

  const getCategoryChartOption = () => {
    if (!summary) return {}

    const categories = Object.keys(summary.by_category)
    const passed = categories.map((cat) => summary.by_category[cat].passed)
    const failed = categories.map((cat) => summary.by_category[cat].failed)

    return {
      title: {
        text: 'Test Results by Category',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Passed', 'Failed'],
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          rotate: 45,
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
    if (!summary) return {}

    const severities = Object.keys(summary.by_severity)
    const passed = severities.map((sev) => summary.by_severity[sev].passed)
    const failed = severities.map((sev) => summary.by_severity[sev].failed)

    return {
      title: {
        text: 'Test Results by Severity',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Passed', 'Failed'],
      },
      xAxis: {
        type: 'category',
        data: severities,
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

  const failedResults = results.filter((r) => !r.passed)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Space style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Space>

      {summary && (
        <>
          <Card style={{ marginBottom: '24px' }}>
            <Title level={3}>Test Results Summary</Title>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Total Tests"
                  value={summary.total_tests}
                  prefix={<WarningOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Passed"
                  value={summary.passed}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Failed"
                  value={summary.failed}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Pass Rate"
                  value={summary.pass_rate}
                  suffix="%"
                  valueStyle={{ color: summary.pass_rate >= 80 ? '#52c41a' : '#ff4d4f' }}
                />
              </Col>
            </Row>
            {summary.critical_vulnerabilities > 0 && (
              <Alert
                message={`${summary.critical_vulnerabilities} critical vulnerabilities found!`}
                type="error"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
          </Card>

          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={12}>
              <Card>
                <ReactECharts option={getCategoryChartOption()} style={{ height: '300px' }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <ReactECharts option={getSeverityChartOption()} style={{ height: '300px' }} />
              </Card>
            </Col>
          </Row>
        </>
      )}

      <Card>
        <Tabs
          items={[
            {
              key: 'all',
              label: `All Tests (${results.length})`,
              children: (
                <Table
                  dataSource={results}
                  columns={columns}
                  rowKey="test_case_id"
                  pagination={{ pageSize: 10 }}
                  expandable={{
                    expandedRowRender: (record: TestResult) => (
                      <div style={{ padding: '16px' }}>
                        {record.vulnerability_detected && (
                          <Alert
                            message="Vulnerability Detected"
                            description={
                              <div>
                                <Paragraph>
                                  <strong>Vulnerability Details:</strong>
                                </Paragraph>
                                <ul>
                                  {record.vulnerability_details.map((detail, idx) => (
                                    <li key={idx}>{detail}</li>
                                  ))}
                                </ul>
                                {record.response && (
                                  <>
                                    <Paragraph>
                                      <strong>Agent Response:</strong>
                                    </Paragraph>
                                    <Text code style={{ whiteSpace: 'pre-wrap', display: 'block', padding: '8px', background: '#f5f5f5' }}>
                                      {record.response}
                                    </Text>
                                  </>
                                )}
                              </div>
                            }
                            type="error"
                            showIcon
                            style={{ marginBottom: '16px' }}
                          />
                        )}
                        {record.passed && (
                          <Alert
                            message="Test Passed"
                            description="No security vulnerabilities detected in this test case"
                            type="success"
                            showIcon
                          />
                        )}
                      </div>
                    ),
                  }}
                />
              ),
            },
            {
              key: 'failed',
              label: `Failed Tests (${failedResults.length})`,
              children: (
                <Table
                  dataSource={failedResults}
                  columns={columns}
                  rowKey="test_case_id"
                  pagination={{ pageSize: 10 }}
                  expandable={{
                    expandedRowRender: (record: TestResult) => (
                      <div style={{ padding: '16px' }}>
                        <Alert
                          message="Vulnerability Detected"
                          description={
                            <div>
                              <Paragraph>
                                <strong>Vulnerability Details:</strong>
                              </Paragraph>
                              <ul>
                                {record.vulnerability_details.map((detail, idx) => (
                                  <li key={idx}>{detail}</li>
                                ))}
                              </ul>
                              {record.response && (
                                <>
                                  <Paragraph>
                                    <strong>Agent Response:</strong>
                                  </Paragraph>
                                  <Text code style={{ whiteSpace: 'pre-wrap', display: 'block', padding: '8px', background: '#f5f5f5' }}>
                                    {record.response}
                                  </Text>
                                </>
                              )}
                            </div>
                          }
                          type="error"
                          showIcon
                        />
                      </div>
                    ),
                  }}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}

export default TestResultPage
