import { useState } from "react";
import { api } from "../../api"; // Cấu hình API
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // Mặc định role là "user"
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post("/auth/register", formData);
      navigate("/login"); // Chuyển hướng về trang login sau khi đăng ký thành công
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card className="p-4 shadow-lg rounded" style={{ width: "400px", background: "#111", color: "#fff" }}>
        <h3 className="text-center text-danger fw-bold">ĐĂNG KÝ</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-user"></i> Họ và Tên</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Nhập họ và tên"
              onChange={handleChange}
              required
              className="bg-dark text-white border border-danger"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-envelope"></i> Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Nhập email"
              onChange={handleChange}
              required
              className="bg-dark text-white border border-danger"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-lock"></i> Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              onChange={handleChange}
              required
              className="bg-dark text-white border border-danger"
            />
          </Form.Group>

          <Button variant="danger" type="submit" className="w-100 fw-bold">
            <i className="fas fa-user-plus"></i> Đăng ký
          </Button>
        </Form>

        <p className="mt-3 text-center">
          Đã có tài khoản? <a href="/login" className="text-danger">Đăng nhập ngay</a>
        </p>
      </Card>
    </Container>
  );
};

export default Register;
