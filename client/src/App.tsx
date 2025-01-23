import "./App.css";
import { AuthProvider } from "./components/authentication/AuthContext";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DeleteLater from "./pages/DeleteLater";
import AuthWrapper from "./components/authentication/AuthWrapper";
import ImBringing from "./pages/ImBringing/ImBringing";
import CreateParty from './pages/NewParty/newParty';
import Home from './pages/home';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/newParty">New Party</Link>
            <Link to="/im-bringing">I'm Bringing</Link>
            <Link to="/delete-later">Delete Later</Link>
          </nav>
          </header>
          <main>
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
              path="/newParty" 
              element={
                <AuthWrapper>
                  <CreateParty />
                </AuthWrapper>
               } 
             />
            <Route path="/" element={<Home />} />
          </Routes>
          </main>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
