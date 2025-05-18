import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api"; // Import API đã cấu hình
import "bootstrap/dist/css/bootstrap.min.css";

const Author = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await api.get(`/author/${id}`);
        console.log("Books data:", response.data.books); // Debug dữ liệu sách
        setAuthor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu tác giả");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  if (loading) return <p className="text-center fw-bold">Loading...</p>;
  if (error) return <p className="text-center text-danger">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="text-center">{author.name}</h2>
          <p className="text-muted text-center">{author.nationality}</p>
          <p><strong>Bio:</strong> {author.bio || "Không có mô tả"}</p>
          <p><strong>Ngày sinh:</strong> {author.birthdate ? new Date(author.birthdate).toLocaleDateString() : "Không rõ"}</p>
          
          {author.image && (
            <div className="text-center">
              <img src={author.image} alt={author.name} className="img-fluid rounded" style={{ maxWidth: "200px" }} />
            </div>
          )}

            <h3 className="mt-4">📚 Sách của {author.name}</h3>
            <ul className="list-group">
            {Array.isArray(author.books) && author.books.length > 0 ? (
            <ul className="list-group">
              {author.books.map((book) => (
                <li key={book._id} className="list-group-item">
                  <strong>{book.title || "Không có tiêu đề"}</strong> -{" "}
                  {book.categories && book.categories.length > 0
                    ? book.categories.map((cat) => cat.name).join(", ")
                    : "Không có thể loại"} -{" "}
                  {book.price ? `${book.price.toLocaleString()} VND` : "Không rõ"}
                </li>
              ))}
            </ul>
            ) : (
              <p className="text-muted">Không có sách nào.</p>
            )}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Author;
