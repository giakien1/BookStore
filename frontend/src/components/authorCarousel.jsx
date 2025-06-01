import { useState, useEffect } from "react";
import { api } from "../api"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const AuthorCarousel = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuthors = async () => {
        try {
            const response = await api.get("/author"); 
            setAuthors(response.data);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch authors");
        } finally {
            setLoading(false);
        }
        };
        fetchAuthors();
    }, []);

    if (loading) return <p className="text-center fw-bold">Loading...</p>;
    if (error) return <p className="text-center text-danger">Error: {error}</p>;

    return (
        <div className="container text-center my-5">
        <h3 className="text-primary fw-bold">AUTHORS</h3>
        <hr className="w-25 mx-auto mb-4" />
        <Swiper
            modules={[Navigation]}
            slidesPerView={3}
            spaceBetween={30}
            navigation
            breakpoints={{
            768: { slidesPerView: 3 },
            576: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
            }}
        >
            {authors.map((author, index) => (
            <SwiperSlide key={index}>
                <div className="d-flex flex-column align-items-center">
                <img
                    src={author.image}
                    alt={author.name}
                    className="rounded-circle shadow"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <p className="mt-2 fw-semibold">{author.name}</p>
                </div>
            </SwiperSlide>
            ))}
        </Swiper>
        </div>
    );
};

export default AuthorCarousel;
