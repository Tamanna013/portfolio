import React from "react";
import Slider from "react-slick";

const About = () => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <section className="flex items-center justify-center h-screen bg-black text-white">
      <div className="flex w-3/4 h-[600px]">
        <div className="w-1/2 flex items-center justify-center">
          <Slider {...carouselSettings} className="w-full">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="w-full">
                <img
                  src={`/pic${index + 1}.jpg`}
                  alt={`carousel-image-${index + 1}`}
                  className="w-full h-[500px] object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="w-1/2 flex flex-col items-center justify-center p-8">
          <div className="p-6 rounded-lg shadow-[0_0_25px_rgba(255,255,255,0.7)]">
            <h1 className="text-5xl font-extrabold mb-6">ABOUT ME</h1>
            <p className="text-lg max-w-md">
              Hello! I'm Tamanna Shaw, a web developer from India. I love working with JavaScript
              and building creative projects that solve real world problems. I enjoy learning
              new technologies and exploring new domains. Currently I'm exploring Game Development.
              My Tech Stack: React, Next.js, Vite, JS, TypeScript, Three.js
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
