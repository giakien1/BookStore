import { Outlet } from "react-router-dom"; // Để render các component con
import AdminSidebar from "../../components/admin/adminSidebar"; // Sidebar quản trị viên

const AdminLayout = () => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <div className="text-center">Unauthorized access</div>;
  }

  return (
    <div className="d-flex">
      <AdminSidebar /> {/* Sidebar sẽ luôn hiển thị */}
      <div className="container py-4">
        <Outlet /> {/* Render các nội dung trang cụ thể ở đây */}
      </div>
    </div>
  );
};

export default AdminLayout;
