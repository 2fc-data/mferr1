/**
 * @copyright 2025 Marcell Ferreira - Advocacia
 * @license Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { BaseLayout } from "./layout/BaseLayout"
import { DashboardScreen } from "./screens/Dashboard"
import { Home } from "./pages/home"
import { ThemeProvider } from "@/components/themeProvider"
import { Login } from "./components/login"
import { Signup } from "./components/signup"
import { NewPassword } from "./components/newPassword"
import { BaseLayoutDashboard } from "./layout/BaseLayoutDashboard/BaseLayoutDashboard.component"

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="new-password" element={<NewPassword />} />
            <Route path="/Dashboard" element={<BaseLayoutDashboard />}>
              <Route index element={<DashboardScreen />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
