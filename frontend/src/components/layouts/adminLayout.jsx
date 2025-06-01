import { Outlet } from "react-router-dom"; 
import AdminSidebar from "../admin/adminSidebar"; 

const AdminLayout = () => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <div className="text-center">Unauthorized access</div>;
  }

  return (
    <div className="d-flex">
      <AdminSidebar /> {/* Sidebar sẽ luôn hiển thị */}
      <div className="container-fluid py-4" style={{ marginLeft: "250px" }}>
        <Outlet /> {/* Render các nội dung trang cụ thể ở đây */}
      </div>
    </div>
  );
};

export default AdminLayout;
