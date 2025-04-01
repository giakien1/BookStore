import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api"; // API đã cấu hình
import "bootstrap/dist/css/bootstrap.min.css";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await api.get("/author");
        setAuthors(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải danh sách tác giả");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  if (loading) return <p className="text-center fw-bold">Loading...</p>;
  if (error) return <p className="text-center text-danger">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Danh sách tác giả</h2>
      <div className="row">
        {authors.map((author) => (
          <div key={author._id} className="col-md-4 mb-4">
            <div className="card shadow-lg">
              {author.image && (
                <img
                  src={author.image}
                  alt={author.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body text-center">
                <h5 className="card-title">{author.name}</h5>
                <p className="text-muted">{author.nationality}</p>
                <Link to={`/author/${author._id}`} className="btn btn-primary">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Authors;
