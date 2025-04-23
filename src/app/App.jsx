import { RouterProvider } from "react-router-dom";
import { router } from "./router";
{
  /*import FrameMeta from "@/components/FrameMeta";*/
}
import { Windmill } from "@windmill/react-ui";
import siteTheme from "@/theme/siteTheme";

function App() {
  return (
    <>
      {/*<FrameMeta />*/}
      <Windmill theme={siteTheme} dark={false}>
        <div className="app-wrapper min-h-screen bg-black">
          <RouterProvider router={router} />
        </div>
      </Windmill>
    </>
  );
}

export default App;
