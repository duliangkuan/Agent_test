export interface TestCategory {
  id: string
  name: string
  description: string
  test_case_count: number
}

export interface TestCase {
  id: string
  name: string
  category: string
  category_name: string
  description: string
  severity: string
  severity_name: string
  tags: string[]
}

export interface TestResult {
  test_case_id: string
  test_case_name: string
  category: string
  severity: string
  passed: boolean
  vulnerability_detected: boolean
  vulnerability_details: string[]
  response: string
  response_time: number
  timestamp: string
  error?: string
}

export interface TestSummary {
  total_tests: number
  passed: number
  failed: number
  pass_rate: number
  by_category: Record<string, { total: number; passed: number; failed: number }>
  by_severity: Record<string, { total: number; passed: number; failed: number }>
  critical_vulnerabilities: number
  average_response_time: number
}
