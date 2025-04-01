import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token
    navigate("/login"); // Chuyển về trang đăng nhập
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      <i className="fas fa-sign-out-alt"></i> Logout
    </button>
  );
};

export default LogoutButton;
