import { useState, useEffect } from "react";
import { api } from "../../../api";
import { useNavigate } from "react-router-dom";

const AdminUserCreate = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log("Form data:", formData); // Log form data for debugging

        try {
            const response = await api.post("/user/create", formData, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` },
            });
                navigate("/admin/home"); // Điều hướng về trang danh sách user
        } catch (error) {
            console.error("Create failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to create user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center">Create New User</h2>

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
                    <label htmlFor="nationality" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
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

                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Creating..." : "Create User"}
                </button>
            </form>
        </div>
    );

}

export default AdminUserCreate;
