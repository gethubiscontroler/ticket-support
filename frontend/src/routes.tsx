import { createBrowserRouter } from "react-router-dom";
import Error from "./pages/error";
import Tickets from "./pages/ticket";
import Teams from "./pages/team";
import Notifications from "./pages/notification";
import Login from "./pages/login";
import AuthPage from "./pages/login";
import AuthCallback from "./pages/authCallback/AuthCallback";
import AuthError from "./pages/authError/AuthError";
import Dashboard from "./pages/dashboard";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthPage />,
    errorElement: <Error />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <Error />,
  },
  {
    path: "/tickets",
    element: <Tickets />,
    errorElement: <Error />,
  },
  {
    path: "/teams",
    element: <Teams />,
    errorElement: <Error />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
    errorElement: <Error />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
    errorElement: <Error />,
  },
  {
    path: "/auth/error",
    element: <AuthError />,
    errorElement: <Error />,
  },
]);