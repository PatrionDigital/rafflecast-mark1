import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import FrameMeta from "./components/FrameMeta";
import "./App.css";

function App() {
  return (
    <>
      <FrameMeta />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
