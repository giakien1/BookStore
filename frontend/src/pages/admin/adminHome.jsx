import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "../../api"; 
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        }); // Gọi API lấy danh sách users

        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error); 
        setError(error.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async(userId) =>{
    const confirmDelete = window.confirm("Are you sure you want to delete this user ?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    alert("User deleted successfully!");
    setUsers(users.filter(user => user._id !== userId));

    } catch {
      console.error("Delete failed:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to delete user.");
    }
  }

  if (loading) return <p className="text-center fw-bold">Loading...</p>;
  if (error) return <p className="text-center text-danger">Error: {error}</p>;

  return (
    <div className="d-flex">
        <div className="container py-4">
          <h2 className="mb-4 text-center">User Management</h2>
          <div className="mb-3 text-center">
                    <button className="btn btn-primary" onClick={() => navigate("/admin/user/createUser")}>
                        Add New User
                    </button>
            </div>  
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === "admin" ? "bg-danger" : "bg-primary"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/admin/user/editUser/${user._id}`)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
    </div>
  );
};

export default AdminHome;
