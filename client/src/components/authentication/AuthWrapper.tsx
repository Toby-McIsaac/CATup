import { ReactNode, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Render children only if the user is authenticated
  return user ? <>{children}</> : null;
};

export default AuthWrapper;
