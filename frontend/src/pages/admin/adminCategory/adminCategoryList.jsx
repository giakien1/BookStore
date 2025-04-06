import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "../../../api"; // API đã cấu hình sẵn
import { useNavigate } from "react-router-dom";

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(()=> {
        const fetchCategories = async () => {
            try {

                const response = await api.get("/category", {
                headers: { Authorization: `Bearer ${token}` },
                }); // Gọi API lấy danh sách books
                setCategories(response.data.categories);
            } catch(error) {
                console.error("Error fetching categories:", error); 
                setError(error.response?.data?.message || "Failed to fetch categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [token]); // Chạy lại khi bookId hoặc token thay đổi
    

    const handleDelete = async (categoryId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this category?");
      if (!confirmDelete) return;

      try {
        
          await api.delete(`/category/${categoryId}`, {
              headers: { Authorization: `Bearer ${token}` },
          });

          alert("Category deleted successfully!");
          setCategories(category.filter(category => category._id !== categoryId));

          // Chuyển hướng về trang danh sách sách sau khi xóa thành công
          navigate(`/admin/category`); // Quay về trang danh sách sách
      } catch (error) {
          console.error("Delete failed:", error.response?.data || error.message);
          setError(error.response?.data?.message || "Failed to delete category.");
        }
    };


    if (loading) return <p className="text-center fw-bold">Loading...</p>;
    if (error) return <p className="text-center text-danger">Error: {error}</p>;

    return (
        <div className="d-flex">
            <div className="container py-4">
              <h2 className="mb-4 text-center">Category Management</h2>
              <div className="mb-3 text-center">
                    <button className="btn btn-primary" onClick={() => navigate("/admin/category/create")}>
                        Add New Category
                    </button>
              </div>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category, index) => (
                        <tr key={category._id}>
                            <td>{index + 1}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(category._id)}>Delete</button>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
      );
}

export default AdminCategory;