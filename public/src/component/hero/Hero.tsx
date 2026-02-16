import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Learn Web Development <br />
          <span className="hero-highlight">The Simple Way</span>
        </h1>

        <p className="hero-subtitle">
          “Simple” does not mean easy. It means structured curriculum, carefully
          chosen resources, and consistent practice — guided by senior mentors
          and fellow builders. Here you will start your journey, You will not
          skip fundamentals. You will not jump between random tutorials. You
          will master each concept with clear explanations, real-world examples,
          and practical projects — saving your most valuable asset: time.
        </p>

        <blockquote className="hero-quote">
          "The longest way around is the shortest way home." — C.S. Lewis
        </blockquote>

        <div className="hero-actions">
          <Link
            to="/register"
            style={{ textDecoration: "none" }}
            className="hero-btn secondary"
          >
            Start Today
          </Link>
          <Link
            to="/roadmap"
            style={{ textDecoration: "none" }}
            className="hero-btn secondary"
          >
            View Jocode Roadmap
          </Link>

          <blockquote className="about-philosophy">
            "Doing it right the first time via a solid foundation is faster than
            fixing mistakes from a shortcut later"
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default Hero;
