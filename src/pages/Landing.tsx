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

      {/* Features */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Why Jocode?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Structured Learning", desc: "No random tutorials. Follow a clear path from basics to mastery." },
              { title: "Real Projects", desc: "Build production-ready applications with guidance from experienced mentors." },
              { title: "Community Support", desc: "Learn alongside fellow builders. Ask questions, share progress, grow together." },
            ].map((f) => (
              <div key={f.title} className="dash-card text-center p-8">
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        © 2024 Jocode. All rights reserved.
      </footer>
    </div>
  );
}
