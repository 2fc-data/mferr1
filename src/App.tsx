
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { BaseLayout } from "./layout/BaseLayout"
import { DashboardScreen } from "./screens/Dashboard"
import { Home } from "./pages/Home"

const App = () => {
  return (
    <div
      className="px-4 py-2 rounded-md border border-gray-400
                 text-black dark:text-white
                 bg-white dark:bg-gray-800
                 transition-colors"
    >
      <Router>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/Dashboard" element={<DashboardScreen />} />            
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App