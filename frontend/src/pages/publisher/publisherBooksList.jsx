import { useEffect, useState } from "react";
import { api } from "../../api"; 
import { useNavigate } from "react-router-dom";

const PublisherBooksList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/publisher/books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(response.data.books || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch books");
      }
    };

    fetchBooks();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await api.delete(`/publisher/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Publisher Book Management</h2>
        <button className="btn btn-success" onClick={() => navigate("/publisher/books/create")}>
          <i className="bi bi-plus-lg me-1"></i> Add Book
        </button>
      </div>
  
      {error && <div className="alert alert-danger">{error}</div>}
  
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">
                  Không có sách nào được tìm thấy.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.description}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => navigate(`/publisher/books/edit/${book._id}`)}
                    >
                      <i className="bi bi-pencil-square me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(book._id)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );  
};

export default PublisherBooksList;
