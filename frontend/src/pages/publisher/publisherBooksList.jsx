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
    <div className="container mt-4">
      <h2>Publisher Book Management</h2>
      <button className="btn btn-primary mb-3" onClick={() => navigate("/publisher/books/create")}>
        Add Book
      </button>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.description}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => navigate(`/publisher/books/edit/${book._id}`)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(book._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PublisherBooksList;
