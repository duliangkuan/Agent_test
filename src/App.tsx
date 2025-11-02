import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import enUS from 'antd/locale/en_US'
import HomePage from './pages/HomePage'
import TestResultPage from './pages/TestResultPage'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider
        locale={enUS}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/result/:taskId" element={<TestResultPage />} />
          </Routes>
        </Layout>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App
