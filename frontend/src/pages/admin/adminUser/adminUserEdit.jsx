import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../api";

const AdminUserEdit = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    image: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user data từ server
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
          image: res.data.image || "",
        });
      } catch (err) {
        console.error("Failed to load user", err);
        setError("Không thể tải thông tin người dùng");
      }
    };
    fetchUser();
  }, [id, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.put(`/user/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/admin/home");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Cập nhật người dùng</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Select Role --</option>
            <option value="admin">Admin</option>
            <option value="publisher">Publisher</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {formData.image && (
          <div className="mb-3 text-center">
            <img src={formData.image} alt="Preview" style={{ maxHeight: "200px", objectFit: "cover" }} />
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>
    </div>
  );
};

export default AdminUserEdit;
