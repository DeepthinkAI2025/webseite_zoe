import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './styles/index.css'
import './i18n'
import { setReduceMotion, setContrast, getUIPreferences } from './utils'

function applyUIPreferences() {
  const root = document.documentElement
  try {
    const reduceMotionLS = localStorage.getItem('ui:reduce-motion')
    const contrastLS = localStorage.getItem('ui:contrast')
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const reduce = reduceMotionLS === 'true' || prefersReduced
    if (reduce) {
      root.setAttribute('data-reduce-motion', 'true')
    } else {
      root.removeAttribute('data-reduce-motion')
    }

    if (contrastLS === 'plus') {
      root.setAttribute('data-contrast', 'plus')
    } else {
      root.removeAttribute('data-contrast')
    }
  } catch {}
}

applyUIPreferences()

// Optionally re-apply on storage changes across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'ui:reduce-motion' || e.key === 'ui:contrast') applyUIPreferences()
})

// Attach helpers for quick toggling from DevTools/console
if (typeof window !== 'undefined') {
  window.ui = {
    setReduceMotion: (v) => { setReduceMotion(v); applyUIPreferences(); },
    setContrast: (m) => { setContrast(m); applyUIPreferences(); },
    getUIPreferences,
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
