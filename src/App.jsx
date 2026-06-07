import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Otp from "./pages/Otp";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ProtectedRoute from "./middleware/ProtectedRoute";
import PublicRoute from "./middleware/PublicRoute";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
          <PublicRoute>
          <Login />
          </PublicRoute>
          }
        />
        <Route
          path="/otp"
          element={
          <PublicRoute>
          <Otp />
          </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
          }
        />
        <Route 
          path="/chat"
          element={
          <ProtectedRoute>
          <Chat />
          </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;