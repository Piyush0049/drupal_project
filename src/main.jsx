import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster toastOptions={{
          // Default options for all toasts
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '16px',
            padding: '10px',
            borderRadius: '8px',
          },
          // Options for success toasts
          success: {
            style: {
              background: '#4caf50',
              color: '#fff',
            },
          },
          // Options for error toasts
          error: {
            style: {
              background: '#f44336',
              color: '#fff',
            },
          },
        }}/>
      <App />
  </StrictMode>,
)
