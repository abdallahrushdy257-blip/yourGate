
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './CarouselCom.css';

const CustomPrevArrow = (props) => {
  return (
    <div className="custom-arrow prev-arrow" onClick={props.onClick}>
      {"<"}
    </div>
  );
};

const CustomNextArrow = (props) => {
  return (
    <div className="custom-arrow next-arrow" onClick={props.onClick}>
      {">"}
    </div>
  );
};

const CarouselComponent = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    dots: true,
    arrows: true, 
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // 2 slides visible on medium screens
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // 1 slide visible on small screens
        },
      },
    ],
  };

  return (
    <div className="carousel-container">
      <h2>Content-Based Carousel</h2>
      <Slider {...settings}>
        <div className="carousel-item">
          <div className="slide-content">
            <h3>Slide 1 Title</h3>
            <p>This is the content for the first slide. You can put any HTML content here, such as text, images, or buttons.</p>
            <button>Learn More</button>
          </div>
        </div>
        <div className="carousel-item">
          <div className="slide-content">
            <h3>Slide 2 Title</h3>
            <p>This is the content for the second slide. You can include whatever content you need.</p>
            <button>Explore</button>
          </div>
        </div>
        <div className="carousel-item">
          <div className="slide-content">
            <h3>Slide 3 Title</h3>
            <p>This is the content for the third slide. Customize it with your own content.</p>
            <button>Get Started</button>
          </div>
        </div>
        <div className="carousel-item">
          <div className="slide-content">
            <h3>Slide 4 Title</h3>
            <p>This is the content for the fourth slide. Add images, videos, or any other HTML elements.</p>
            <button>Contact Us</button>
          </div>
        </div>
        <div className="carousel-item">
          <div className="slide-content">
            <h3>Slide 5 Title</h3>
            <p>This is the content for the fifth slide. Modify it according to your needs.</p>
            <button>Get More Info</button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default CarouselComponent;
