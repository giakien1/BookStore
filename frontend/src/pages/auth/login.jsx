import { useState } from "react";
import { api } from "../../api"; // Cấu hình API
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/auth/login", formData);
      console.log("API Response:", response.data); // In ra toàn bộ response để kiểm tra

      const { token, role } = response.data;  // Đảm bảo response có token và role
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);  // Lưu role vào localStorage
      console.log("Saved role to localStorage:", role);  // Kiểm tra giá trị role

        if (role === "admin") {
            navigate("/admin/home");
        } else {
            navigate("/");
        }
      } catch (err) {
          setError(err.response?.data?.message || "Lỗi đăng nhập");
      }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card className="p-4 shadow-lg rounded" style={{ width: "400px", background: "#111", color: "#fff" }}>
        <h3 className="text-center text-danger fw-bold">ĐĂNG NHẬP</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-envelope"></i> Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Nhập email" onChange={handleChange} required className="bg-dark text-white border border-danger" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-lock"></i> Mật khẩu</Form.Label>
            <Form.Control type="password" name="password" placeholder="Nhập mật khẩu" onChange={handleChange} required className="bg-dark text-white border border-danger" />
          </Form.Group>

          <Button variant="danger" type="submit" className="w-100 fw-bold">
            <i className="fas fa-sign-in-alt"></i> Đăng nhập
          </Button>
        </Form>
        <p className="mt-3 text-center">
          <a href="/register" className="text-danger">Đăng ký ngay</a>
        </p>
      </Card>
    </Container>
  );
};

export default Login;
