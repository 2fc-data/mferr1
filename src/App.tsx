/**
 * @copyright 2025 Marcell Ferreira - Advocacia
 * @license Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BaseLayout } from "./layout/BaseLayout";
import { DashboardScreen } from "./screens/Dashboard";
import { Home } from "./pages/home";
import { ThemeProvider } from "@/components/themeProvider";
import { Address } from "./components/address";
import { Login } from "./components/login";
import { Signup } from "./components/signup";
import { NewPassword } from "./components/newPassword";
import { BaseLayoutDashboard } from "./layout/BaseLayoutDashboard";
import { Users } from "./components/users";
import { Rules } from "./components/rule";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="new-password" element={<NewPassword />} />
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <BaseLayoutDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardScreen />} />
              <Route path="address" element={<Address />} />
              <Route path="signup" element={<Signup />} />
              <Route path="users" element={<Users />} />
              <Route path="rules" element={<Rules />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};
