import React from "react";
import { Carousel } from "react-responsive-carousel";
import { img } from "./img/data";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function MovieCarousel() {
  return (
    <>
    <div>
     <h1 className="text-5xl md:text-7xl  text-gray-900  pt-4 pr-4 text-center font-bold">
      Welcome to this Movie Review Platform
    </h1>
        
        <p className="mt-6 text-xl text-center">A web application for exploring movies, submitting reviews, and evaluating user ratings</p>

    </div>
    
    <div className="max-w-7xl mx-auto mt-6">
      <Carousel
        autoPlay
        infiniteLoop
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
        interval={2000}
      >
        
        {img.map((imageItemLink, index) => (
          <div key={index} className="relative">
            {/* Image */}
            <img
              src={imageItemLink}
              className="w-full h-125 object-cover rounded"
              alt="movie"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 pt-40">
                   Log in to explore movies, read reviews, and share your opinions with the community.
                </h1>
                <h1 className="text-2xl mt-24">
                  Built with React, Node.js, Express & PostgreSQL
                </h1>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
    </>
  );
}

export default MovieCarousel;
