// src/router.jsx
import { createBrowserRouter } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import ParentLayout from "@/pages/layouts/ParentLayout";
import LandingPage from "@/pages/LandingPage";
import SignupSuccessPage from "@/pages/SignupSuccessPage";

export const router = createBrowserRouter([
  {
    // Temp Routing to signup page while we work on the site
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorBoundary />,
    /*
    path: "/",
    element: <ParentLayout />,
    errorElement: <ErrorBoundary />,
    handle: {
      navLinks: [],
    },
    children: [],
    */
  },
  // Direct Routes: Used for sharing and other links we want to track
  // Signup
  {
    path: "/signup",
    element: <LandingPage />,
    errorElement: <ErrorBoundary />,
  },
  // Signup Success
  {
    path: "/signup/success",
    element: <SignupSuccessPage />,
    errorElement: <ErrorBoundary />,
  },
]);

export default router;
