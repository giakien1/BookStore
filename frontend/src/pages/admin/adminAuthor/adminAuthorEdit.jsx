import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api"; // API đã cấu hình sẵn

const AdminAuthorEdit = () => {
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        birthdate: "",
        nationality: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { authorId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    useEffect(() => {
        if (!authorId) {
            setError("Invalid author ID.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // Lấy thông tin sách
                const authorResponse = await api.get(`/author/${authorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const author = authorResponse.data;

                console.log("Author data:", author); // Kiểm tra dữ liệu trả về

                setFormData({
                    name: author.name || "",
                    bio: author.bio || "",  
                    birthdate: author.birthdate ? author.birthdate.substring(0, 10) : "", // Chỉ lấy phần ngày tháng năm
                    nationality: author.nationality ?? "Unknown",
                });

            } catch (error) {
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authorId, token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/author/${authorId}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                navigate(`/admin/author`); // Điều hướng về trang quản lý tác giả
            }
        } catch (error) {
            console.error("Update failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to update author.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center">Edit Author</h2>
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
                    <label htmlFor="description" className="form-label">Bio</label>
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
                    <label htmlFor="date" className="form-label">Birthdate</label>
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
                <button type="submit" className="btn btn-primary">Update Author</button>
            </form>
        </div>
    );
}

export default AdminAuthorEdit;