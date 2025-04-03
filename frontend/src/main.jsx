import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "./components/admin/adminLayout";

import Author from "./pages/author/author";
import AuthorDetail from "./pages/author/authorDetail";
import Home from "./pages/home"; 
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Navbar from "./components/navbar";

import AdminHome from "./pages/admin/adminHome";
import AdminBook from "./pages/admin/adminBook/adminBook";
import AdminBookEdit from "./pages/admin/adminBook/adminBookEdit";
import AdminAuthor from "./pages/admin/adminAuthor/adminAuthor";
import AdminAuthorEdit from "./pages/admin/adminAuthor/adminAuthorEdit";
import AdminAuthorCreate from "./pages/admin/adminAuthor/adminAuthorCreate";

import BookList from "./pages/book/bookList";
import BookDetail from "./pages/book/bookDetail";
import Me from "./pages/me";


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

          <Route path="/book_list" element={<BookList />} />
          <Route path="/book/:id" element={<BookDetail />} />

          <Route path="/me" element={<Me />} />

          <Route element={<AdminLayout />}>
            <Route path="/admin/home" element={<AdminHome />} />

            <Route path="/admin/book" element={<AdminBook />} />
            <Route path="/admin/book/:bookId" element={<AdminBookEdit />} />

            <Route path="/admin/author" element={<AdminAuthor />} />
            <Route path="/admin/author/:authorId" element={<AdminAuthorEdit />} />
            <Route path="/admin/author/create" element={<AdminAuthorCreate />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
