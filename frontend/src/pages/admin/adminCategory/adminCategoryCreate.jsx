import { useState, useEffect, use } from "react";
import { api } from "../../../api";
import { useNavigate } from "react-router-dom";


const AddCategory = () => {
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/category", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(response.data.categories);
            } catch (err) {
                console.error("Error loading categories", err);
            }
        };

        fetchData();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/category/create", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Category created successfully!");
            navigate("/admin/category"); // Quay về trang danh sách category
        } catch (err) {
            console.error("Error creating category", err);
            setError(err.response?.data?.message || "Failed to create category.");
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Add Category</h1>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Category Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Create Category</button>
            </form>
        </div>
    );
}

export default AddCategory;