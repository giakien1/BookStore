import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "../api"; 
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

import AuthorCarousel from "../components/authorCarousel";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/"); 
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
      {/* Slide banner */}
      <div id="bannerCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
        <div className="carousel-inner rounded shadow-sm">
          <div className="carousel-item active">
            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img5.jpg?v=2074" className="d-block w-100" alt="Banner 1" />
          </div>
          <div className="carousel-item">
            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img3.jpg?v=2074" className="d-block w-100" alt="Banner 2" />
          </div>
          <div className="carousel-item">
            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=2074" className="d-block w-100" alt="Banner 3" />
          </div>
          <div className="carousel-item">
            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img4.jpg?v=2074" className="d-block w-100" alt="Banner 3" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Danh sách sách */}
      <div className="container text-center my-5">
        <h3 className="text-primary fw-bold">NEW BOOKS</h3>
      </div>
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
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/book/${book._id}`)}>View Details</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <section className="author-section">
        <AuthorCarousel />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
