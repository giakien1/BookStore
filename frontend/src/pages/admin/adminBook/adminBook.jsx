import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "../../../api"; // API đã cấu hình sẵn
import { useNavigate } from "react-router-dom";

const AdminBook = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(()=> {
        const fetchBooks = async () => {
            try {

                const response = await api.get("/book", {
                headers: { Authorization: `Bearer ${token}` },
                }); // Gọi API lấy danh sách books

                setBooks(response.data);
            } catch(error) {
                console.error("Error fetching books:", error); 
                setError(error.response?.data?.message || "Failed to fetch books");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [token]); // Chạy lại khi bookId hoặc token thay đổi
    

    const handleDelete = async (bookId) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this book?");
      if (!confirmDelete) return;

      try {
        
          await api.delete(`/book/${bookId}`, {
              headers: { Authorization: `Bearer ${token}` },
          });

          alert("Book deleted successfully!");
          setBooks(books.filter(book => book._id !== bookId));

          // Chuyển hướng về trang danh sách sách sau khi xóa thành công
          navigate(`/admin/book`); // Quay về trang danh sách sách
      } catch (error) {
          console.error("Delete failed:", error.response?.data || error.message);
          setError(error.response?.data?.message || "Failed to delete book.");
        }
    };


    if (loading) return <p className="text-center fw-bold">Loading...</p>;
    if (error) return <p className="text-center text-danger">Error: {error}</p>;

    return (
        <div className="d-flex">
            <div className="container py-4">
              <h2 className="mb-4 text-center">Book Management</h2>
              <div className="mb-3 text-center">
                    <button className="btn btn-primary" onClick={() => navigate("/admin/book/create")}>
                        Add New Book
                    </button>
              </div>
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
                            <td><img
                              src={book.image}
                              alt={book.title}
                              style={{ width: "80px", height: "auto", objectFit: "cover" }}
                            />
                            </td>
                            <td>{book.title}</td>
                            <td>{book.description}</td>
                            <td>{book.author?.name}</td>
                            <td>{book.publisher?.name}</td>
                            <td>{book.price}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/admin/book/${book._id}`)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>Delete</button>
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