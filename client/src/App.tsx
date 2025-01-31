import "./App.css";
import { AuthProvider } from "./components/authentication/AuthContext";
import LoginPage from "./pages/Login";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DeleteLater from "./pages/DeleteLater";
import AuthWrapper from "./components/authentication/AuthWrapper";
import ImBringing from "./pages/ImBringing/ImBringing";
import Home from './pages/home';
import SignUp from './pages/SignUp.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <nav>
            <Link to="/">Home</Link> |{" "}
            <Link to="/newParty">New Party</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
            <Link to="/im-bringing">I'm Bringing</Link> |{" "}
            <Link to="/delete-later">Delete Later</Link> |{" "}
            <Link to="/sign-up">Sign Up</Link>
          </nav>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/delete-later"
              element={
                <AuthWrapper>
                  <DeleteLater />
                </AuthWrapper>
              }
            />
            <Route
              path="/im-bringing"
              element={
                <AuthWrapper>
                  <ImBringing />
                </AuthWrapper>
              }
            />
             <Route 
              path="/sign-up" 
              element={
                <AuthWrapper>
                  <SignUp />
                </AuthWrapper>
               } 
             />
            <Route path="/" element={<Home />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
