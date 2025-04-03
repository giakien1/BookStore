import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api"; // API đã cấu hình sẵn

const AdminBookEdit = () => {
    const [authors, setAuthors] = useState([]); // Danh sách tác giả
    const [publishers, setPublishers] = useState([]); // Danh sách nhà xuất bản
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        author: "",
        publisher: "",
        price: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { bookId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    useEffect(() => {
        if (!bookId) {
            setError("Invalid book ID.");
            return;
        }

        const fetchData = async () => {
            try {
                // Lấy thông tin sách
                const bookResponse = await api.get(`/book/${bookId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const book = bookResponse.data;

                // Lấy danh sách tác giả & nhà xuất bản
                const [authorsRes, publishersRes] = await Promise.all([
                    api.get("/author", { headers: { Authorization: `Bearer ${token}` } }),
                    api.get("/publisher", { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setAuthors(authorsRes.data);
                setPublishers(publishersRes.data);

                setFormData({
                    title: book.title || "",
                    description: book.description || "",
                    author: book.author?._id || "",  // Dùng ObjectId
                    publisher: book.publisher?._id || "",  // Dùng ObjectId
                    price: book.price,
                });

            } catch (error) {
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookId, token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/book/${bookId}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                navigate(`/admin/book`); // Điều hướng về trang quản lý sách
            }
        } catch (error) {
            console.error("Update failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to update book.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center">Edit Book</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="author" className="form-label">Author</label>
                    <select
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Author</option>
                        {authors.map(author => (
                            <option key={author._id} value={author._id}>
                                {author.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="publisher" className="form-label">Publisher</label>
                    <select
                        id="publisher"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Publisher</option>
                        {publishers.map(publisher => (
                            <option key={publisher._id} value={publisher._id}>
                                {publisher.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Book</button>
            </form>
        </div>
    );
};

export default AdminBookEdit;
