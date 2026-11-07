import { Route, Routes } from 'react-router'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
