import { Navigate, Route, Routes } from 'react-router-dom'
import DocsLayout from '../layouts/DocsLayout.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import About from '../pages/About.jsx'
import Contact from '../pages/Contact.jsx'
import Docs from '../pages/Docs.jsx'
import Home from '../pages/Home.jsx'
import Pricing from '../pages/Pricing.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        <Route path="docs" element={<DocsLayout />}>
          <Route index element={<Docs />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
