import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTachometerAlt, FaBook, FaUser, FaTags } from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/home", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/book", label: "Book Management", icon: <FaBook /> },
    { path: "/admin/author", label: "Author Management", icon: <FaUser /> },
    { path: "/admin/category", label: "Category Management", icon: <FaTags /> },
  ];

  return (
    <div
      className="d-flex flex-column bg-dark text-white vh-100 shadow"
      style={{
        width: "250px",
        position: "fixed",
        top: 50,
        left: 0,
        padding: "1.5rem",
        zIndex: 1000,
      }}
    >
      <h4 className="mb-4 text-center fw-bold">Admin Panel</h4>
      <ul className="nav nav-pills flex-column gap-2">
        {menuItems.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center gap-2 ${
                location.pathname === item.path ? "active bg-light text-dark" : "text-white"
              }`}
              style={{
                borderRadius: "8px",
                padding: "10px 15px",
                transition: "background-color 0.2s ease",
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
