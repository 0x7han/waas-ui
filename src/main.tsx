import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CompoundApiPage } from './prototype/compound-api/CompoundApiPage.tsx'

const params = new URLSearchParams(window.location.search)
const isPrototype = params.get('prototype') === 'compound-api'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPrototype ? <CompoundApiPage /> : <App />}
  </StrictMode>,
)
