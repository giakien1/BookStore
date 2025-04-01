import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "../api"; // Import API đã cấu hình sẵn

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/"); // Sử dụng API đã cấu hình
        setBooks(response.data);
      } catch (error) {
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
    <div className="container py-4">
      <div className="row">
        {books.map((book) => (
          <div key={book._id} className="col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm">
              {/* Đảm bảo ảnh có cùng kích thước */}
              <div className="poster-container">
                <img 
                  src={book.image || "https://via.placeholder.com/300"} 
                  className="card-img-top object-fit-cover" 
                  alt={book.title} 
                />
              </div>

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">
                  <strong>Author:</strong> {book.author?.name || "Unknown"}<br />
                  <strong>Publisher:</strong> {book.publisher?.name || "Unknown"}
                </p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-success">${book.price}</span>
                  <button className="btn btn-primary btn-sm">View Details</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
