// src/app/router.jsx
import { createBrowserRouter } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import ParentLayout from "@/layouts/ParentLayout";
import CreatorDashboardLayout from "@/layouts/CreatorDashboardLayout"; // Make sure this is imported
import LandingPage from "@/pages/LandingPage";
import SignupSuccessPage from "@/pages/SignupSuccessPage";
import CreateRafflePage from "@/pages/CreateRafflePage";
import RaffleSuccessPage from "@/pages/RaffleSuccessPage"; // Add this import
import ManageRafflesPage from "@/pages/ManageRafflesPage"; // Make sure this is imported
import FrameRafflePage from "@/pages/FrameRafflePage";

export const router = createBrowserRouter([
  {
    // Main application routes with parent layout
    path: "/",
    element: <ParentLayout />,
    errorElement: <ErrorBoundary />,
    handle: {
      navLinks: [],
    },
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      // Signup related routes
      {
        path: "signup",
        element: <LandingPage />,
      },
      {
        path: "signup/success",
        element: <SignupSuccessPage />,
      },
      // Creator dashboard routes
      {
        path: "creator",
        element: <CreatorDashboardLayout />,
        children: [
          {
            // Show all raffles created by user (default route)
            index: true,
            element: <ManageRafflesPage />,
          },
          {
            // Create new raffle
            path: "new",
            element: <CreateRafflePage />,
          },
          {
            // Success page after raffle creation
            path: "success/:raffleId",
            element: <RaffleSuccessPage />,
          },
          {
            // Management page (might be duplicate with the index route)
            path: "manage",
            element: <ManageRafflesPage />,
          },
        ],
      },
    ],
  },
  // Frame routes (don't use parent layout)
  {
    path: "/frame/raffle/:raffleId",
    element: <FrameRafflePage />,
    errorElement: <ErrorBoundary />,
    handle: {
      skipLayout: true,
    },
  },
]);

export default router;
