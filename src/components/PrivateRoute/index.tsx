import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  Element: JSX.Element;
}

function PrivateRoute({ Element }: PrivateRouteProps) {

  const isAuthenticated = sessionStorage.getItem("clin-cash-user-uid");

  return isAuthenticated ? <>{Element}</> : <Navigate to="/login" />;
}

export default PrivateRoute;
