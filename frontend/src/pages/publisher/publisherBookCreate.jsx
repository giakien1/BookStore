import { useState, useEffect } from "react";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";

const AddBookForPublisher = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        author: "",
        status: "",
        categories: [],
        price: "",
        image: ""
    });

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const statusOptions = [
        { _id: "available", name: "Available" },
        { _id: "out of stock", name: "Out of Stock" }
      ];

    useEffect(() => {
        const fetchData = async () => {
            try {
              const [authorsRes, categoriesRes] = await Promise.all([
                api.get("/author", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/category", { headers: { Authorization: `Bearer ${token}` } }),
              ]);
              setAuthors(authorsRes.data);
              setCategories(categoriesRes.data.categories);

            } catch (err) {
              console.error("Error loading authors/categories", err);
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
        console.log(form);
        
        const formData = {
            ...form,
        };

        await api.post("/book/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Book added successfully!");
      navigate("/publisher/books"); // hoặc route nào bạn dùng cho publisher
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add book.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Create Book (Publisher)</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Author</label>
          <select className="form-select" name="author" value={form.author} onChange={handleChange} required>
            <option value="">-- Select Author --</option>
            {authors.map((author) => (
              <option key={author._id} value={author._id}>{author.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={form.status} onChange={handleChange} required>
            <option value="">-- Select Status --</option>
            {statusOptions.map((status) => (
              <option key={status._id} value={status._id}>{status.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            name="categories"
            multiple
            value={form.categories}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
              setForm((prev) => ({ ...prev, categories: selectedOptions }));
            }}
            required
          >
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input type="text" className="form-control" name="image" value={form.image} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Create Book</button>
      </form>
    </div>
  );
};

export default AddBookForPublisher;
