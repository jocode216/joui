import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Play, ChevronLeft, Share2 } from "lucide-react";

interface Guide {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  steps: {
    title: string;
    description: string;
  }[];
}

const guides: Guide[] = [
  {
    id: 1,
    title: "How Kanaho Works",
    description: "Kano is a simple e-commerce platform that connects real buyers with real sellers — without requiring credit cards or online payments. You order online, you pay when you receive the product.",
    videoUrl: "https://youtu.be/J8zFIAefwAc",
    steps: [
      { title: "No Credit Card Needed", description: "In Ethiopia, products exist but connections are broken by payment barriers. We fixed that." },
      { title: "Real Buyers, Real Sellers", description: "Connect directly with local sellers and people bringing products from abroad." },
      { title: "Pay on Delivery", description: "Order online, but pay only when you receive your product." },
      { title: "Simple & Trustworthy", description: "No complicated setups. Just real products and trust." },
    ],
  },
  {
    id: 2,
    title: "How to Place an Order",
    description: "Using Kano as a buyer is simple. No email required, no Western-style sign-up. Just your name, phone, and address.",
    videoUrl: "https://youtu.be/QpgTvR6-XME",
    steps: [
      { title: "Create Account", description: "Sign up with just your name, phone number, and address. No email needed." },
      { title: "Browse & Order", description: "Find what you want from local sellers or international bringers." },
      { title: "Order Dashboard", description: "Track your order status and history in your dashboard." },
      { title: "Seller Contact", description: "If confirmed, the seller contacts you directly for delivery." },
      { title: "Pay upon Receipt", description: "Pay the seller directly when you get the item." },
    ],
  },
  {
    id: 3,
    title: "How to Create a Store & Start Selling",
    description: "Kano verifies sellers to reduce fake stores. Once approved, you deal only with serious buyers.",
    videoUrl: "https://youtu.be/FjCh7ihtwkQ",
    steps: [
      { title: "Apply for Store", description: "Start as a normal user, then apply to become a verified seller." },
      { title: "Verification", description: "We verify you to keep the platform safe and trusted." },
      { title: "Manage Products", description: "Add products, photos, prices, and stock status easily." },
      { title: "Serious Buyers Only", description: "Kano filters orders so you don't waste time on fake requests." },
      { title: "Direct Deal", description: "Get buyer details and deliver directly. Collect payment on delivery." },
    ],
  },
];

const Howitworks = () => {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const getYoutubeEmbedUrl = (videoUrl: string): string => {
    try {
      const videoIdMatch = videoUrl.match(
        /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      if (!videoId) return "";
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    } catch {
      return "";
    }
  };

  const getVideoThumbnail = (videoUrl: string): string => {
    const videoIdMatch = videoUrl.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
      : "/placeholder.jpg";
  };

  // Detail View
  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <button
            onClick={() => setSelectedGuide(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to all guides</span>
          </button>

          {/* Title Section */}
          <h1 className="text-3xl font-bold text-foreground mb-4">{selectedGuide.title}</h1>
          <p className="text-muted-foreground mb-6">{selectedGuide.description}</p>

          {/* Video Player */}
          <div className="relative rounded-xl overflow-hidden shadow-lg bg-black aspect-video mb-8">
            <iframe
              src={getYoutubeEmbedUrl(selectedGuide.videoUrl)}
              title={selectedGuide.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Step by Step Guide */}
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Step-by-Step Guide</h2>
              <button className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            <div className="space-y-4">
              {selectedGuide.steps.map((step, index) => (
                <div 
                  key={index} 
                  className="flex gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{step.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Kanaho Works
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn everything you need to know about using Kanaho marketplace. 
            From shopping to selling, we've got you covered!
          </p>
        </div>

        {/* Guide Cards */}
        <div className="space-y-6">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer border border-border"
              onClick={() => setSelectedGuide(guide)}
            >
              <div className="flex flex-col md:flex-row">
                {/* Thumbnail */}
                <div className="relative md:w-80 flex-shrink-0">
                  <img
                    src={getVideoThumbnail(guide.videoUrl)}
                    alt={guide.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <h2 className="text-xl font-bold text-foreground mb-3">
                    {guide.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {guide.description}
                  </p>

                  {/* CTA Button */}
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-8 rounded-lg transition-colors">
                    View Guide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Howitworks;