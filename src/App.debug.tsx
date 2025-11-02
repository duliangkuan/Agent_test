// Temporary debug file - for troubleshooting white screen issues
import React from 'react'

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontSize: '18px' }}>
      <h1>Debug Test - If you see this, React is working</h1>
      <p>Current time: {new Date().toLocaleString()}</p>
      <p>If you see this page, React is rendering correctly</p>
    </div>
  )
}

export default App
