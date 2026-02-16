import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Import banner images
import img2 from "/img/10002.jpg";
import img3 from "/img/10003.jpg";
import img4 from "/img/10004.jpg";
import img5 from "/img/10005.jpg";
import img6 from "/img/10006.jpg";
import img7 from "/img/10007.jpg";

interface HeroSlide {
  image: string;
  title: string;
}

const slides: HeroSlide[] = [
  {
    image: img2,
    title: 'Featured Category',
  },
  {
    image: img3,
    title: 'New Arrivals',
  },
  {
    image: img4,
    title: 'Top Rated',
  },
  {
    image: img5,
    title: 'Flash Sale',
  },
  {
    image: img6,
    title: 'Best Sellers',
  },
  {
    image: img7,
    title: 'Trending',
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Dark overlay that fades from bottom */}
      <div className="absolute inset-0 fade-overlay" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white mb-8 max-w-4xl text-balance animate-fade-in">
          Buy directly from real sellers
        </h1>
        <Link to="/products">
          <Button size="lg" className="btn-brand text-base px-8 py-6">
            Browse Products
          </Button>
        </Link>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
