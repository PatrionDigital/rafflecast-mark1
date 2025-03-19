import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./styles/pages.css";
import "./App.css";
import "./styles/heading-fixes.css";
import "./styles/profile-spacing-fixes.css";
import "./styles/header-direct-fix.css";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
