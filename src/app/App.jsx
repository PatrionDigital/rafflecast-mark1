import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import FrameMeta from "@/components/FrameMeta";
import { Windmill } from "@windmill/react-ui";

function App() {
  return (
    <>
      <FrameMeta />
      <Windmill>
        <RouterProvider router={router} />
      </Windmill>
    </>
  );
}

export default App;
