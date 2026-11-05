
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Student Login */}
        <Route path="/" element={<Login />} />

        {/* Student Registration */}
        <Route path="/register" element={<Register />} />

        {/* Student Dashboard and Tasks */}
        <Route path="/dashboard" element={<Tasks />} />

        {/* Unknown pages */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
