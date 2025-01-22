import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import ParentLayout from "./pages/layouts/ParentLayout";
import CreatorDashboardLayout from "./pages/layouts/CreatorDashboardLayout";
import EntrantDashboardLayout from "./pages/layouts/EntrantDashboardLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import CreateRafflePage from "./pages/CreateRafflePage";
import ManageRafflesPage from "./pages/ManageRafflesPage";
import BrowseRafflesPage from "./pages/BrowseRafflesPage";

import "./App.css";
import BrowseEntriesPage from "./pages/BrowseEntriesPage";

//const basename = import.meta.env.MODE === "production" ? "/rafflecast-mark1" : "";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <ParentLayout
          navLinks={[
            { path: "/creator", label: "Creator" },
            { path: "/entrant", label: "Entrant" },
          ]}
        />
      ),
      children: [
        { index: true, element: <LandingPage /> },
        {
          path: "entrant/*",
          element: <EntrantDashboardLayout />,
          handle: {
            navLinks: [
              { path: "/creator", label: "Creator" },
              { path: "/entrant/raffles/browse", label: "Browse Raffles" },
              { path: "/entrant/raffles/entered", label: "My Raffles" },
            ],
          },
          children: [
            { path: "raffles/browse", element: <BrowseRafflesPage /> },
            { path: "raffles/entered", element: <BrowseEntriesPage /> },
          ],
        },
        {
          path: "creator/*",
          element: <CreatorDashboardLayout />,
          handle: {
            navLinks: [
              { path: "/entrant", label: "Entrant" },
              { path: "/creator/raffles/new", label: "Create Raffle" },
              { path: "/creator/raffles/manage", label: "Manage Raffles" },
            ],
          },
          children: [
            { path: "raffles/new", element: <CreateRafflePage /> },
            { path: "raffles/manage", element: <ManageRafflesPage /> },
          ],
        },
      ],
    },
  ],
  { basename: "/rafflecast-mark1" }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
