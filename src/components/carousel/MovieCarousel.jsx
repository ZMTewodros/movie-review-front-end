import React from "react";
import { Carousel } from "react-responsive-carousel";
import { img } from "./img/data";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Footer from "../Footer";

function MovieCarousel() {
  return (
    // Wrapping in a flex container ensures Footer stays below Carousel
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div>
          <h1 className="text-4xl md:text-6xl text-gray-900 pt-8 text-center font-bold">
            Welcome to this Movie Review Platform
          </h1>
          <p className="mt-4 text-lg text-center text-gray-700">
            Explore movies, submit reviews, and evaluate ratings.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto mt-6 px-4">
          <Carousel
            autoPlay
            infiniteLoop
            showIndicators={false}
            showThumbs={false}
            showStatus={false}
            interval={2000}
          >
            {img.map((imageItemLink, index) => (
              <div key={index} className="relative h-[500px]"> {/* Fixed height container */}
                <img
                  src={imageItemLink}
                  className="w-full h-full object-cover rounded shadow-lg"
                  alt="movie"
                />

                {/* Fixed Overlay: removed large padding-top (pt-40) which pushes content down */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded">
                  <div className="text-center text-white px-8">
                    <h2 className="text-2xl md:text-4xl font-bold mb-4">
                      Log in to explore and share your opinions.
                    </h2>
                    <p className="text-lg opacity-80 mt-10">
                      Built with React, Node.js & PostgreSQL
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </main>

      {/* Footer is now safely below the main content */}
      <Footer />
    </div>
  );
}

export default MovieCarousel;