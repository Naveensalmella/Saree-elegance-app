import { useEffect, useState } from "react";
import "./HeroSlider.css";
import bannerData from "../../data/bannerData";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HeroSlider = () => {

    const [current, setCurrent] = useState(0);
    const [pause, setPause] = useState(false);

    useEffect(() => {

        if (pause) return;

        const interval = setInterval(() => {

            setCurrent((prev) =>
                prev === bannerData.length - 1 ? 0 : prev + 1
            );

        }, 4000);

        return () => clearInterval(interval);

    }, [pause]);

    const nextSlide = () => {
        setCurrent((prev) =>
            prev === bannerData.length - 1 ? 0 : prev + 1
        );
    };

    const previousSlide = () => {
        setCurrent((prev) =>
            prev === 0 ? bannerData.length - 1 : prev - 1
        );
    };

    return (

        <section
            className="hero-slider"
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
        >

            <img
                src={bannerData[current].image}
                alt={bannerData[current].title}
                className="hero-image"
            />

            <div className="overlay">

                <h1>{bannerData[current].title}</h1>

                <p>{bannerData[current].subtitle}</p>

                

            </div>

            <button
                className="left-arrow"
                onClick={previousSlide}
            >
                <FaChevronLeft />
            </button>

            <button
                className="right-arrow"
                onClick={nextSlide}
            >
                <FaChevronRight />
            </button>

            <div className="dots">

                {bannerData.map((_, index) => (

                    <span
                        key={index}
                        className={
                            current === index
                                ? "dot active-dot"
                                : "dot"
                        }
                        onClick={() => setCurrent(index)}
                    ></span>

                ))}

            </div>

        </section>

    );
};

export default HeroSlider;