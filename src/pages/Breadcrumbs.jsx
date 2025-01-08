import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path);

  return (
    <nav className="breadcrumbs">
      <ul>
        {paths.map((path, index) => {
          const fullPath = `/${paths.slice(0, index + 1).join("/")}`;
          return (
            <li key={index}>
              <Link to={fullPath}>{path}</Link>
              {index < paths.length - 1 && " / "}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
