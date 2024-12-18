import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RaffleProvider } from "./context/RaffleContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RaffleProvider>
      <App />
    </RaffleProvider>
  </StrictMode>
);
