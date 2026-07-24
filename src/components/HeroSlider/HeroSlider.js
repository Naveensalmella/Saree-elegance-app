import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HeroSlider.css";
import FallbackImage from "../common/FallbackImage";

const slides = [
    {
        subtitle: "New Collection",
        title: "Elegance in Every Thread",
        description:
            "Handcrafted sarees and lehengas that celebrate tradition with a modern touch.",
        cta: "Shop Now",
        link: "/products",
        image:
            "https://images.unsplash.com/photo-1614886137926-0e6a4f2dfc22?w=1400&q=80",
        align: "left",
    },
    {
        subtitle: "Festive Edit",
        title: "Lehengas That Steal the Show",
        description:
            "From sangeet nights to wedding days — find your perfect silhouette.",
        cta: "Explore",
        link: "/products",
        image:
            "https://images.unsplash.com/photo-1604502071830-b5e8dce44f83?w=1400&q=80",
        align: "right",
    },
    {
        subtitle: "Everyday Ethnic",
        title: "Kurtis You'll Live In",
        description:
            "Effortless style for work, weekends, and everything in between.",
        cta: "View All",
        link: "/products",
        image:
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1400&q=80",
        align: "left",
    },
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const resetTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(
            () => setCurrent((p) => (p + 1) % slides.length),
            5000
        );
    };

    useEffect(() => {
        resetTimer();
        return () => clearInterval(timerRef.current);
        // eslint-disable-next-line
    }, []);

    const goTo = (i) => {
        setCurrent(i);
        resetTimer();
    };

    const slide = slides[current];

    return (
        <section className="hero-slider">
            <FallbackImage
                key={current}
                src={slide.image}
                alt={slide.title}
                className="hero-slider-img"
            />
            <div className="hero-slider-overlay" />
            <div className={`hero-slider-content hero-slider-${slide.align}`} key={current}>
                <span className="hero-slider-subtitle">{slide.subtitle}</span>
                <h1 className="hero-slider-title">{slide.title}</h1>
                <p className="hero-slider-desc">{slide.description}</p>
                <Link to={slide.link} className="hero-slider-cta">
                    {slide.cta} →
                </Link>
            </div>
            <div className="hero-slider-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`hero-dot ${i === current ? "active" : ""}`}
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSlider;