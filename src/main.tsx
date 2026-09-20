import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PlaygroundPage } from './playground/PlaygroundPage.tsx'

const params = new URLSearchParams(window.location.search)
const isPlayground = import.meta.env.DEV && params.get('playground') !== null

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPlayground ? <PlaygroundPage /> : <App />}
  </StrictMode>,
)
