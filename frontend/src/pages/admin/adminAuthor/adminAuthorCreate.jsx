import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api"; // API đã cấu hình sẵn

const AdminAuthorCreate = () => {
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        birthdate: "",
        nationality: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    console.log("Token đang gửi:", token);

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

        try {
            const response = await api.post("/author/create", formData, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` },
            });

            if (response.status === 201) {
                navigate("/admin/author"); // Điều hướng về trang danh sách tác giả
            }
        } catch (error) {
            console.error("Create failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to create author.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center">Create New Author</h2>

            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="nationality" className="form-label">Nationality</label>
                    <input
                        type="text"
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="birthdate" className="form-label">Birthdate</label>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Creating..." : "Create Author"}
                </button>
            </form>
        </div>
    );
};

export default AdminAuthorCreate;
