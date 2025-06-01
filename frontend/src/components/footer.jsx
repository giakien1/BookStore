const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container text-center">
        <p>© 2025 Bookstore. All rights reserved.</p>
        <p>
          Follow us on{" "}
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white">
            Facebook
          </a>{" "}
          |{" "}
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white">
            Twitter
          </a>{" "}
          |{" "}
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white">
            Instagram
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
