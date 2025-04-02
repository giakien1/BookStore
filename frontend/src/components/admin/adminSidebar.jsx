import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminSidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-dark text-white vh-100" style={{ width: "250px" }}>
      <h4>Admin Panel</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/admin/home" className="nav-link text-white">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/book" className="nav-link text-white">
            Book Management
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/author" className="nav-link text-white">
            Author Management
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
