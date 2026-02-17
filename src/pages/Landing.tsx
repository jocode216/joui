import { Link } from "react-router-dom";
import PublicHeader from "@/components/layout/PublicHeader";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero */}
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Learn Web Development <br />
            <span className="text-primary font-extrabold">The Simple Way</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
            "Simple" does not mean easy. It means structured curriculum, carefully
            chosen resources, and consistent practice — guided by senior mentors
            and fellow builders.
          </p>

          <blockquote className="text-base md:text-lg italic text-foreground border-l-[3px] border-primary bg-primary/5 rounded-lg p-5 max-w-xl mx-auto mb-8">
            "The longest way around is the shortest way home." — C.S. Lewis
          </blockquote>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-8 py-3 no-underline">
              Start Today
            </Link>
            <Link to="/courses" className="btn-outline-primary text-base px-8 py-3 no-underline">
              Browse Courses
            </Link>
          </div>

          <p className="text-sm italic text-muted-foreground mt-8 max-w-lg mx-auto">
            "Doing it right the first time via a solid foundation is faster than
            fixing mistakes from a shortcut later"
          </p>
        </div>
      </section>

    </div>
  );
}
