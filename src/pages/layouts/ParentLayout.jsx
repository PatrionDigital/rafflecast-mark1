import { Outlet, useMatches } from "react-router-dom";
import Header from "../Header";

const currentYear = new Date().getFullYear();

const ParentLayout = () => {
  const matches = useMatches();
  //console.log(matches); // Debug log to see the matches
  const currentMatch = matches
    .reverse()
    .find((match) => match.handle?.navLinks);
  const navLinks = currentMatch?.handle?.navLinks || [];

  return (
    <div>
      <Header title="Rafflecast" navLinks={navLinks} />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        © <span>{currentYear}</span> Rafflecast
      </footer>
    </div>
  );
};

export default ParentLayout;
