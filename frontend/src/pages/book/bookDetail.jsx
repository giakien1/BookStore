import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import "bootstrap/dist/css/bootstrap.min.css";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/book/${id}`);
        console.log("Book data:", response.data);
        setBook(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu sách");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <p className="text-center fw-bold">Loading...</p>;
  if (error) return <p className="text-center text-danger">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="text-center mb-4">{book.title}</h2>

          <div className="row">
            {/* Cột ảnh sách */}
            <div className="col-md-4 text-center mb-3 mb-md-0">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="img-fluid rounded"
                  style={{ maxHeight: "350px", objectFit: "contain" }}
                />
              ) : (
                <div className="text-muted">Không có ảnh</div>
              )}
            </div>

            {/* Cột thông tin sách */}
            <div className="col-md-8">
              <p><strong>📚 Tác giả:</strong> {book.author?.name || "Không rõ"}</p>
              <p><strong>🏢 Nhà xuất bản:</strong> {book.publisher?.name || "Không rõ"}</p>
              <p><strong>💰 Giá:</strong> {book.price ? `${book.price.toLocaleString()} VND` : "Không rõ"}</p>
              <p><strong>📖 Mô tả:</strong> {book.description || "Không có mô tả"}</p>
              <p><strong>📖 Tình trạng:</strong> {book.status || "Không rõ"}</p>

              <h5 className="mt-4">📂 Thể loại</h5>
              {book.categories && book.categories.length > 0 ? (
                <ul className="list-group">
                  {book.categories.map(category => (
                    <li key={category._id} className="list-group-item">
                      {category.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Không có thể loại.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookDetail;
