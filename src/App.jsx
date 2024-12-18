import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateRafflePage from "./pages/CreateRafflePage";
import BrowseRafflesPage from "./pages/BrowseRafflesPage";
import AdminPage from "./pages/AdminPage";

import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<BrowseRafflesPage />} />
          <Route path="/create" element={<CreateRafflePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
