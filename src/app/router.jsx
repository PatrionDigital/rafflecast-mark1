// src/app/router.jsx - Updated router configuration
import { createBrowserRouter } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import ParentLayout from "@/layouts/ParentLayout";
import CreatorDashboardLayout from "@/layouts/CreatorDashboardLayout";
import EntrantDashboardLayout from "@/layouts/EntrantDashboardLayout";
import LandingPage from "@/pages/LandingPage";
import SignupSuccessPage from "@/pages/SignupSuccessPage";
import CreateRafflePage from "@/pages/CreateRafflePage";
import RaffleSuccessPage from "@/pages/RaffleSuccessPage";
import ManageRafflesPage from "@/pages/ManageRafflesPage";
import BrowseRafflesPage from "@/pages/BrowseRafflesPage";
import FrameRafflePage from "@/pages/FrameRafflePage";
import EntriesManagementPage from "@/pages/EntriesManagementPage";

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
            // Manage all raffles
            path: "manage",
            element: <ManageRafflesPage />,
          },
          {
            // View specific raffle details
            path: "manage/:raffleId",
            element: <ManageRafflesPage />,
          },
        ],
      },
      // Entrant dashboard routes
      {
        path: "entrant",
        element: <EntrantDashboardLayout />,
        children: [
          {
            // Show all raffles created by user (default route)
            index: true,
            element: <BrowseRafflesPage />,
          },
          {
            // View all this user's raffle entries
            path: "manage",
            element: <EntriesManagementPage />,
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
