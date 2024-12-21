import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateRafflePage from "./pages/CreateRafflePage";
import BrowseRafflesPage from "./pages/BrowseRafflesPage";
import AdminPage from "./pages/AdminPage";

import "./App.css";
import BrowseEntriesPage from "./pages/BrowseEntriesPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
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
