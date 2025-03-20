// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import ParentLayout from "./pages/layouts/ParentLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import EntrantDashboardLayout from "./pages/layouts/EntrantDashboardLayout";
import CreatorDashboardLayout from "./pages/layouts/CreatorDashboardLayout";
import ProfileDashboardLayout from "./pages/layouts/ProfileDashboardLayout";
import BrowseRafflesPage from "./pages/BrowseRafflesPage";
import BrowseEntriesPage from "./pages/BrowseEntriesPage";
import CreateRafflePage from "./pages/CreateRafflePage";
import CreateDistributionPage from "./pages/CreateDistributionPage";
import ManageRafflesPage from "./pages/ManageRafflesPage";
import EntriesManagementPage from "./pages/EntriesManagementPage";
import FrameRafflePage from "./pages/FrameRafflePage";
import FrameDebugPage from "./pages/FrameDebugPage";
import FrameValidatorPage from "./pages/FrameValidatorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ParentLayout />,
    errorElement: <ErrorBoundary />,
    handle: {
      navLinks: [
        { path: "/creator/raffles/new", label: "Create New Raffle" },
        { path: "/entrant/raffles/browse", label: "Browse Raffles" },
        { path: "/profile", label: "Profile" },
      ],
    },
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "entrant/*",
        element: <EntrantDashboardLayout />,
        children: [
          { path: "raffles/browse", element: <BrowseRafflesPage /> },
          { path: "raffles/entered", element: <BrowseEntriesPage /> },
        ],
      },
      {
        path: "creator/*",
        element: <CreatorDashboardLayout />,
        children: [
          { path: "raffles/new", element: <CreateRafflePage /> },
          {
            path: "raffles/new/distribution",
            element: <CreateDistributionPage />,
          },
          { path: "raffles/manage", element: <ManageRafflesPage /> },
          {
            path: "distribute-rewards/:raffleId",
            element: <CreateDistributionPage />,
          },
        ],
      },
      {
        path: "profile/*",
        element: <ProfileDashboardLayout />,
        children: [
          { path: "raffles", element: <ManageRafflesPage /> },
          { path: "entries", element: <EntriesManagementPage /> },
          { index: true, element: <ManageRafflesPage /> },
        ],
      },
    ],
  },
  // Frame routes - these don't use the regular layout
  {
    path: "/frame/raffle/:raffleId",
    element: <FrameRafflePage />,
  },
  {
    path: "/debug/frames",
    element: <FrameDebugPage />,
  },
  {
    path: "/validate/frame/:raffleId",
    element: <FrameValidatorPage />,
  },
]);

export default router;
