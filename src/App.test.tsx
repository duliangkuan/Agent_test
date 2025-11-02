// Temporary test file - for diagnostics
import React from 'react'
import { Button } from 'antd'

const App: React.FC = () => {
  return (
    <div style={{ padding: '50px' }}>
      <h1>Test Page - If you see this, basic rendering is working</h1>
      <Button type="primary">Test Button</Button>
      <p>If this page displays normally, Ant Design basic components are working</p>
    </div>
  )
}

export default App



