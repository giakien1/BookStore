import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "../../../api"; // API đã cấu hình sẵn
import { useNavigate } from "react-router-dom";

const AdminAuthor = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(()=> {
        const fetchAuthors = async () => {
            try {

                const response = await api.get("/author", {
                headers: { Authorization: `Bearer ${token}` },
                }); // Gọi API lấy danh sách authors

                console.log("Authors from API:", response.data);

                setAuthors(response.data);
            } catch {
                console.error("Error fetching authors:", error); 
                setError(error.response?.data?.message || "Failed to fetch authors");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, [token]);

    const handleDelete = async (authorId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this book?");
      if (!confirmDelete) return;

      try {
        
          await api.delete(`/author/${authorId}`, {
              headers: { Authorization: `Bearer ${token}` },
          });

          alert("Author deleted successfully!");
          setAuthors(author.filter(author => author._id !== authorId));

          // Chuyển hướng về trang danh sách sách sau khi xóa thành công
          navigate(`/admin/author`); // Quay về trang danh sách sách
      } catch (error) {
          console.error("Delete failed:", error.response?.data || error.message);
          setError(error.response?.data?.message || "Failed to delete author.");
        }
    };

    if (loading) return <p className="text-center fw-bold">Loading...</p>;
    if (error) return <p className="text-center text-danger">Error: {error}</p>;

    return (
        <div className="d-flex">
            <div className="container py-4">
              <h2 className="mb-4 text-center">Author Management</h2>
              <div className="mb-3 text-center">
                    <button className="btn btn-primary" onClick={() => navigate("/admin/author/create")}>
                        Add New Author
                    </button>
              </div>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Bio</th>
                        <th>Nationality</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {authors.map((author, index) => (
                        <tr key={author._id}>
                            <td>{index + 1}</td>
                            <td>{author.name}</td>
                            <td>{author.bio}</td>
                            <td>{author.nationality}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/admin/author/${author._id}`)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(author._id)}>Delete</button>
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

export default AdminAuthor;