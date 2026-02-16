
import { Link } from "react-router-dom";
import "./about.css";

function About() {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            The Jocode Story <br />
            <span className="about-hero-highlight">
              From Confusion to Clarity
            </span>
          </h1>

          <div className="about-mission">
            <p className="about-hero-subtitle">
              “Simple” does not mean easy. It means structured curriculum,
              carefully chosen resources, and consistent practice — guided by
              senior mentors and fellow builders.
            </p>

            <p className="about-story">
              Jocode was born from frustration. The frustration of watching
              aspiring developers jump between endless tutorials, collect
              hundreds of bookmarks, and still feel lost. The frustration of
              seeing talented people quit because they lacked structure,
              accountability, and real projects.
            </p>

            <p className="about-story">
              We believe web development should be taught like building a house:
              start with the foundation, add the structure, then the details. No
              skipping steps, no random tutorials, no "magic" shortcuts.
            </p>
          </div>

          <blockquote className="about-hero-quote">
            "There are no shortcuts to any place worth going." — Beverly Sills
          </blockquote>

          <div className="about-hero-actions">
            <Link
              to="/register"
              style={{ textDecoration: "none" }}
              className="about-hero-btn primary"
            >
              Start Your Journey
            </Link>
            <Link
              to="/roadmap"
              style={{ textDecoration: "none" }}
              className="about-hero-btn secondary"
            >
              View Full Curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* What Makes Jocode Different */}
      <section className="about-different">
        <h2 className="about-section-title">
          <span className="about-section-highlight">A Better Way to Learn</span>
        </h2>

        <blockquote className="about-philosophy">
          "Mastery is not a sprint; it’s a series of intentional steps. We don't
          teach you to code fast—we teach you to build well."
        </blockquote>

        <div className="about-features">
          <div className="about-feature">
            <div className="feature-icon">🎯</div>
            <h3>Beginner Friendly</h3>
            <p>
              Each course assumes 0 knowledge. If you take our MERN Stack
              course, we start from absolute basics. We're building a complete
              curriculum starting from introduction to operating systems, the
              internet, and progressing through every technology needed for web
              development.
            </p>
          </div>

          <div className="about-feature">
            <div className="feature-icon">🎥</div>
            <h3>Video & Written Courses</h3>
            <p>
              Lessons are delivered in short, focused video format with written
              equivalents. No fluff, no filler - just clear explanations and
              practical examples. Each lesson is crafted to be consumed in under
              15 minutes while delivering maximum value.
            </p>
          </div>

          <div className="about-feature">
            <div className="feature-icon">🤝</div>
            <h3>Community & Mentorship</h3>
            <p>
              Get help when you're stuck directly from your mentor.Mentors are
              active daily, providing guidance and code reviews.
            </p>
          </div>

          <div className="about-feature">
            <div className="feature-icon">🏗️</div>
            <h3>Project-Based Learning</h3>
            <p>
              Learn by building real applications. Our MERN Stack mentorship
              guides you through two complete, deployable applications with
              MySQL, Express, React, Node.js, and free BaaS using Supabase.
            </p>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="about-approach">
        <h2 className="about-section-title">
          <span className="about-section-highlight">How We Teach</span>
        </h2>

        <div className="approach-steps">
          <div className="approach-step">
            <div className="step-number">1</div>
            <h3>Start with Why</h3>
            <p>
              Understand not just how to code, but why certain approaches work.
              We explain the underlying principles before diving into syntax.
            </p>
          </div>

          <div className="approach-step">
            <div className="step-number">2</div>
            <h3>Master Fundamentals</h3>
            <p>
              No skipping basics. We ensure you have rock-solid understanding of
              core concepts before moving to advanced topics.
            </p>
          </div>

          <div className="approach-step">
            <div className="step-number">3</div>
            <h3>Build Real Projects</h3>
            <p>
              Apply knowledge immediately through practical projects. From
              simple HTML pages to full-stack applications with authentication.
            </p>
          </div>

          <div className="approach-step">
            <div className="step-number">4</div>
            <h3>Review & Refine</h3>
            <p>
              Get code reviews, learn best practices, and understand common
              pitfalls. We help you develop professional-grade code habits.
            </p>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="about-vision">
        <h2 className="about-section-title">
          <span className="about-section-highlight">Our Roadmap</span>
        </h2>

        <div className="vision-content">
          <p>
            We're building a complete learning ecosystem. Currently, we offer:
          </p>
          <ul className="vision-list">
            <li>
              • <strong>MERN Stack Mentorship Full Guide</strong> - Complete
              full-stack development with real projects
            </li>
            <li>
              • <strong>HTML Full Course</strong> - Master web fundamentals
              (Completely Free)
            </li>
            <li>
              • <strong>Website Fundamentals Course</strong>(Internet, Operating
              Systems, IDE setup, HTML, CSS, JS) - Coming Soon
            </li>
          </ul>

          <p>Future courses in development:</p>
          <ul className="vision-list">
            <li>
              • Front-End framework(Tailwind css, React, Typescript, Nextjs){" "}
            </li>
            <li>• Backend-End Technology(Nodejs, Express) </li>
            <li>• Database(MYSQL, MONGODB) </li>
            <li>• BAAS(Backend as a service like Supabase and Firebase) </li>
          </ul>

          <p className="vision-note">
            Our ultimate goal: Take you from complete beginner to job-ready
            developer through a single, cohesive learning path.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="about-faq">
        <h2 className="about-section-title">
          <span className="about-section-highlight">
            Frequently Asked Questions
          </span>
        </h2>

        <div className="faq-container">
          <div className="faq-item">
            <h3>Is there a free demo I can try?</h3>
            <p>
              Absolutely! Each course allows you to preview several lessons. You
              can preview the first few modules to experience our teaching
              style.
            </p>
          </div>

          <div className="faq-item">
            <h3>What if I get stuck or need help?</h3>
            <p>
              You will have direct access to your mentor anytime. Anywhere you
              get stuck, you will get help and proceed to the next lesson—no
              staying stuck forever.
            </p>
          </div>

          <div className="faq-item">
            <h3>Are there any prerequisites?</h3>
            <p>
              Each course assumes 0 knowledge. If you're starting with web
              development, begin with our free HTML course. We're building
              courses that start from absolute basics - introduction to
              operating systems and the internet.
            </p>
          </div>

          <div className="faq-item">
            <h3>Are the courses up to date/updated?</h3>
            <p>
              Absolutely! Web development evolves rapidly. We continuously
              update our courses to reflect current best practices, new
              features, and industry standards.
            </p>
          </div>

          <div className="faq-item">
            <h3>How long does it take to complete a course?</h3>
            <p>
              It varies by course and your pace. The MERN Stack mentorship is
              designed to be completed in 3-5 months with consistent practice.
              Most importantly, we focus on mastery over speed.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="about-cta">
        <h2 className="cta-title">Ready to Join?</h2>
        <p className="cta-subtitle">
          Web development is a challenging but rewarding journey. With the right
          guidance, structure, and community, you can achieve what seems
          impossible.
        </p>

        <div className="cta-actions">
          <Link
            to="/register"
            style={{ textDecoration: "none" }}
            className="cta-btn primary"
          >
            Begin Your Journey
          </Link>
          <Link
            to="/courses"
            style={{ textDecoration: "none" }}
            className="cta-btn secondary"
          >
            Browse All Courses
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
