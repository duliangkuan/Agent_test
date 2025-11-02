import React from 'react'
import { Layout, Typography } from 'antd'
import { SafetyOutlined } from '@ant-design/icons'

const { Header: AntHeader } = Layout
const { Title } = Typography

const Header: React.FC = () => {
  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <SafetyOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
      <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
        Agent Security Testing Platform
      </Title>
    </AntHeader>
  )
}

export default Header
