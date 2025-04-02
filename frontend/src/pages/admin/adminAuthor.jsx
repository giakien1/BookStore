import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "../../api"; // API đã cấu hình sẵn

const AdminAuthor = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        const fetchAuthors = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/author", {
                headers: { Authorization: `Bearer ${token}` },
                }); // Gọi API lấy danh sách authors

                setAuthors(response.data);
            } catch {
                console.error("Error fetching authors:", error); 
                setError(error.response?.data?.message || "Failed to fetch authors");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    if (loading) return <p className="text-center fw-bold">Loading...</p>;
    if (error) return <p className="text-center text-danger">Error: {error}</p>;

    return (
        <div className="d-flex">
            <div className="container py-4">
              <h2 className="mb-4 text-center">User Management</h2>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Bio</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {authors.map((author, index) => (
                        <tr key={author._id}>
                            <td>{index + 1}</td>
                            <td>{author.name}</td>
                            <td>{author.bio}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2">Edit</button>
                                <button className="btn btn-danger btn-sm">Delete</button>
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