import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "../../api"; // API đã cấu hình sẵn

const AdminBook = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/book", {
                headers: { Authorization: `Bearer ${token}` },
                }); // Gọi API lấy danh sách books

                setBooks(response.data);
            } catch {
                console.error("Error fetching books:", error); 
                setError(error.response?.data?.message || "Failed to fetch books");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
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
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>Price</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book, index) => (
                        <tr key={book._id}>
                            <td>{index + 1}</td>
                            <td></td>
                            <td>{book.title}</td>
                            <td>{book.description}</td>
                            <td>{book.author?.name}</td>
                            <td>{book.publisher?.name}</td>
                            <td>{book.price}</td>
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

export default AdminBook;