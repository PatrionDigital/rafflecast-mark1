import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import CreatorDashboardLayout from "./pages/layouts/CreatorDashboardLayout";
import EntrantDashboardLayout from "./pages/layouts/EntrantDashboardLayout";

// Pages
import CreateRafflePage from "./pages/CreateRafflePage";
import BrowseRafflesPage from "./pages/BrowseRafflesPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

import "./App.css";
import BrowseEntriesPage from "./pages/BrowseEntriesPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/** Creator Workflow */}
          <Route
            path="/creator/*"
            element={
              <CreatorDashboardLayout>
                <Routes>
                  <Route path="raffles/new" element={<CreateRafflePage />} />
                  <Route path="raffles/manage" element={<AdminPage />} />
                  <Route
                    path="raffles/entries/:raffleId"
                    element={<BrowseEntriesPage />}
                  />
                  <Route
                    path="raffles/status"
                    element={<BrowseRafflesPage />}
                  />
                </Routes>
              </CreatorDashboardLayout>
            }
          />
          {/** Entrant Workflow */}
          <Route
            path="entrant/*"
            element={
              <EntrantDashboardLayout>
                <Routes>
                  <Route path="raffles" />
                  <Route path="raffles/entered" />
                </Routes>
              </EntrantDashboardLayout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<BrowseRafflesPage />} />
          <Route path="/create" element={<CreateRafflePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/admin/entries/:raffleId"
            element={<BrowseEntriesPage />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
