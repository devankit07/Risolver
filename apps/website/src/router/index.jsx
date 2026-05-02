import { Navigate, Route, Routes } from 'react-router-dom'
import DocsLayout from '../layouts/DocsLayout.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import About from '../pages/About.jsx'
import { Contact } from '../pages/Contact.jsx'
import Docs from '../pages/Docs.jsx'
import Home from '../pages/Home.jsx'
import Pricing from '../pages/Pricing.jsx'
import { LoginPage } from '../pages/Auth/Login.jsx'
import { RegisterPage } from '../pages/Auth/Register.jsx'
import { OrganiztionPage } from '../pages/Auth/Organiztion.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        
        {/* Auth Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="organiztion" element={<OrganiztionPage />} />

        {/* Docs Routes */}
        <Route path="docs" element={<DocsLayout />}>
          <Route index element={<Docs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
