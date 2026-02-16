
import Resource from "../Resource";
import "./Resourcedoc.css";

function Resourcedoc() {

  return (
    <div className="resourcedoc-container">
      {/* Simplified Hero Section */}
      <div className="resource-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Learn Web Development{" "}
            <span className="hero-highlight">The Simple Way</span>
          </h1>
          <p className="hero-quote">
            "You don't need hundreds of resources. A few well-chosen resources,
            consistent practice, and mastering the fundamentals are all you need
            to become a great developer."
          </p>
          <p className="hero-subtitle">
            We provide straightforward, essential resources that focus on what
            actually matters—clear explanations, practical examples, and the
            core skills that web developers use every day.
          </p>
        </div>
      </div>
      <Resource />

    </div>
  );
}

export default Resourcedoc;
