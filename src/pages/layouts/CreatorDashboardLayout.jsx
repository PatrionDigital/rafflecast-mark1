import { Link } from "react-router-dom";
import PropTypes from "prop-types";
const CreatorDashboardLayout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Creator Dashboard</h1>
        <nav>
          <ul>
            <li>
              <Link to="/creator/raffles/new">Create Raffle</Link>
            </li>
            <li>
              <Link to="/creator/raffles/manage">Manage Raffles</Link>
            </li>
            <li>
              <Link to="/creator/raffles/entries">Check Entries</Link>
            </li>
            <li>
              <Link to="/creator/raffles/status">Raffle Status</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

CreatorDashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CreatorDashboardLayout;
