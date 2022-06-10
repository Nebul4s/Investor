import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useState } from "react";
//Pages and components
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Signup from "./pages/Signup";
import NavBar from "./components/NavBar";

function App() {
  const { authIsReady, user } = useAuthContext();
  const [loggedOut, setLoggedOut] = useState(false);

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <NavBar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/portfolio"
              element={user ? <Portfolio /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route path="/logout" element={user && <Logout />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
