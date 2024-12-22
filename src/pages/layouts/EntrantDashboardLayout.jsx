import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const EntrantDashboardLayout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Entrant Dashboard</h1>
        <nav>
          <ul>
            <li>
              <Link to="/entrant/raffles">Browse Raffles</Link>
            </li>
            <li>
              <Link to="/entrant/raffles/entered">My Raffles</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

EntrantDashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default EntrantDashboardLayout;
