import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import Author from "./pages/author/author";
import AuthorDetail from "./pages/author/authorDetail";
import Home from "./pages/home"; // Import trang Home
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Navbar from "./components/navbar";
import AdminHome from "./pages/admin/adminHome";
import Book from "./pages/book/book";
import BookDetail from "./pages/book/bookDetail";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Thêm route cho Home */}
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/author" element={<Author />} />
          <Route path="/author/:id" element={<AuthorDetail />} />

          <Route path="/book" element={<Book />} />
          <Route path="/book/:id" element={<BookDetail />} />

          <Route path="/admin/home" element={<AdminHome />} />
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
