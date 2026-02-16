import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroBanner = () => {
  const categories = [
    {
      name: "Men's",
      image:
        "https://img.ltwebstatic.com/images3_spmp/2025/01/03/49/1735886069d478ffa627fc29c8ae3c0ef7961f3c6e_square_thumbnail_240x.webp",
      link: "/products?category=mens-shirts",
      rotate: "-rotate-2",
    },
    {
      name: "Women's",
      image:
        "https://img.ltwebstatic.com/v4/j/pi/2025/05/13/51/1747134523977810079c6b3dc07ce3af687a2ed766_thumbnail_240x.webp",
      link: "/products?category=womens-dresses",
      rotate: "rotate-2",
    },
    {
      name: "Electronics",
      image:
        "https://img.ltwebstatic.com/images3_spmp/2024/12/18/cb/1734525922cbe3d72467f2624b51158224d624b164_thumbnail_240x.webp",
      link: "/products?category=electronics",
      rotate: "-rotate-2",
    },
    {
      name: "Kids",
      image:
        "https://img.ltwebstatic.com/images3_pi/2024/12/02/95/17331087278f3a62f6ea1bee6b1db9b9fae4107547_thumbnail_240x.webp",
      link: "/products?category=kids",
      rotate: "rotate-2",
    },
    {
      name: "Beauty",
      image:
        "https://img.ltwebstatic.com/v4/p/spmp/2025/04/12/69/1744436731d5ea465e76ce025f9a64e1c1dd16cb38_thumbnail_288x.webp",
      link: "/products?category=beauty",
      rotate: "-rotate-2",
    },
  ];

  return (
    <div className="relative w-full overflow-hidden pb-12">
      {/* Main Banner */}
      <div className="relative h-[300px] md:h-[450px] w-full">
        <img
          src="/shop.jpg"
          alt="Banner"
          className="h-full w-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
          <div className="max-w-lg">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded mb-3">
              New Arrivals
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Buy directly from real sellers
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-6 max-w-md">
              Discover authentic products from trusted local sellers. Quality
              guaranteed.
            </p>
            <Link to="/products">
              <Button className="bg-white text-black hover:bg-white/90 px-6 py-3 text-sm font-medium">
                Shop Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Cards Row */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} to={cat.link} className="group block relative">
              <div className="overflow-hidden rounded-lg border-2 border-background shadow-lg bg-white">
                <div
                  className={`transition-transform duration-300 ease-in-out group-hover:${cat.rotate}`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-32 md:h-40 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-2 text-center bg-white">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground">
                    {cat.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
