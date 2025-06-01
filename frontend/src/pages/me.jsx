import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "../api";

const Me = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) {
          setError("Bạn cần đăng nhập!");
          return;
        }

        const response = await api.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setUser(response.data); // Lưu thông tin người dùng
      } catch (error) {
        console.error("Error fetching users:", {
          message: error.message,
          status: error.response?.status,
          url: error.config?.url, // Log URL API bị lỗi
          data: error.response?.data,
        });
        const errorMessage = error.response?.data?.message || "Lỗi khi tải thông tin người dùng";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Đang tải thông tin...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      {user ? (
        <div className="card mt-4">
          <div className="card-header">
            <h3>Thông tin người dùng</h3>
          </div>

          <div className="card-body">
            <div className="row align-items-center">
              {/* Ảnh bên trái */}
              <div className="col-md-4 text-center">
                <img
                  src={user.image || "https://via.placeholder.com/200"}
                  className="rounded-circle img-fluid"
                  alt={user.username}
                  width={200}
                  height={200}
                />
              </div>

              {/* Thông tin bên phải */}
              <div className="col-md-8">
                <p><strong>Họ tên:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Ngày tham gia:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Không tìm thấy thông tin người dùng</p>
      )}
    </div>

  );
};

export default Me;
