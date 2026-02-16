import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";

// Import banner images from the example folder
import img2 from "/img/10002.jpg";
import img3 from "/img/10003.jpg";
import img4 from "/img/10004.jpg";
import img5 from "/img/10005.jpg";
import img6 from "/img/10006.jpg";
import img7 from "/img/10007.jpg";

const bannerImages = [img2, img3, img4, img5, img6, img7];

// Category data with images
const categories = [
  {
    id: "womens",
    name: "Womens",
    image: "/category/womens.jpg",
  },
  {
    id: "mens",
    name: "Mens",
    image: "/category/mens.jpg",
  },
  {
    id: "kids",
    name: "Kids",
    image: "/category/kids.jpg",
  },
  {
    id: "digital",
    name: "Digital",
    image: "/category/digital.jpg",
  },
  {
    id: "all",
    name: "ALL",
    image: "/category/all.jpg",
  },
];

const HeroCarouselEffect = () => {
  return (
    <div className="relative w-full">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={true}
        showThumbs={false}
        showStatus={false}
        interval={4000}
        transitionTime={500}
        swipeable={true}
        emulateTouch={true}
        className="hero-carousel"
      >
        {bannerImages.map((imgSrc, index) => (
          <div key={index} className="relative">
            <img
              src={imgSrc}
              alt={`Banner ${index + 1}`}
              className="w-full h-[300px] sm:h-[400px] md:h-[450px] object-cover"
            />
          </div>
        ))}
      </Carousel>

      {/* Category Cards Section - Positioned at bottom, overlapping carousel */}
      <div className="relative w-[95%] mx-auto -mt-[10%] z-10 grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 place-items-center">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.id === "all" ? "/products" : `/products?category=${category.id}`}
            className="block w-full h-[250px] bg-background shadow-md hover:shadow-lg transition-shadow no-underline"
          >
            <div className="h-full flex flex-col">
              <h2 className="text-center py-3 text-lg font-semibold text-foreground">
                {category.name}
              </h2>
              <div className="flex-1 flex items-center justify-center px-2.5 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full max-h-[65%] object-contain"
                />
              </div>
              <p className="text-center text-xs font-bold text-primary pb-3">
                Shop now
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HeroCarouselEffect;
