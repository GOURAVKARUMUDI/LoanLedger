import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


// ── Theme Bootstrap (prevents flash) ──
// Apply saved theme BEFORE React mounts to avoid flicker
const savedTheme = localStorage.getItem('loan-ledger-storage');
if (savedTheme) {
  try {
    const parsed = JSON.parse(savedTheme);
    const theme = parsed?.state?.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
} else {
  document.documentElement.setAttribute('data-theme', 'dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
