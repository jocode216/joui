import React from "react";
import "./roadmap.css";
import { Link } from "react-router-dom";

const Roadmap: React.FC = () => {
  return (
    <div className="roadmap-container">
      {/* Hero Section */}
      <section className="roadmap-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Jocode's Clear Path to{" "}
            <span className="hero-highlight">Mastering Web Development</span>
          </h1>
          <p className="hero-subtitle">
            We follow a structured, step-by-step approach that mimics building a
            house—start with the foundation, add the structure, then the
            details. No skipping steps, no random tutorials, just clear
            progression.
          </p>
          <blockquote className="hero-quote">
            "Just like you wouldn't paint a house before building its structure,
            we don't teach React before mastering HTML, CSS, and JavaScript
            fundamentals."
          </blockquote>

          <blockquote className="about-philosophy">
            "Learning to code isn't a race; it’s about taking the right steps.
            We don't just teach you to code fast—we teach you to build things
            the right way."
          </blockquote>
        </div>
      </section>

      {/* Core Foundations Course */}
      <section className="course-section">
        <div className="course-header">
          <h2 className="course-title">Core Foundations Course</h2>
          <p className="course-subtitle">
            Before writing a single line of code, understand what you're working
            with.
          </p>
        </div>

        <div className="course-card">
          <div className="course-steps">
            {[
              {
                number: "01",
                title: "Operating Systems",
                description:
                  "Learn in a simple and easy way to interact with your computer. Understand files, processes, memory, and how software communicates with hardware.",
                projects: "Setup your development environment",
              },
              {
                number: "02",
                title: "The Internet & Web Basics",
                description:
                  "Understand HTTP, DNS, domains, servers, browsers, and deployment. Know what happens when you type a URL and press Enter.",
                projects: "Trace the journey of a web request",
              },
              {
                number: "03",
                title: "Development Environment",
                description:
                  "Setup your coding workspace: Code editor (VS Code), browser developer tools, essential extensions, and collaboration tools.",
                projects: "Configure VS Code with essential extensions",
              },
            ].map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-header">
                  <span className="step-number">{step.number}</span>
                  <h3 className="step-title">{step.title}</h3>
                </div>
                <p className="step-description">{step.description}</p>
                <div className="step-project">
                  <span className="project-label">Project:</span>
                  <span className="project-text">{step.projects}</span>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="course-actions">
            <button className="course-btn primary">Start This Course</button>
            <button className="course-btn secondary">
              Preview Free Lessons
            </button>
          </div> */}
        </div>
      </section>

      {/* Frontend Development Path */}
      <section className="course-section">
        <div className="course-header">
          <h2 className="course-title">Frontend Development Path</h2>
          <p className="course-subtitle">
            Start building the visible part of websites—the structure, style,
            and interactivity.
          </p>
        </div>

        <div className="course-card">
          <div className="course-steps">
            {[
              {
                number: "01",
                title: "HTML (HyperText Markup Language)",
                description:
                  "Build the structure of your web pages, just like building columns, beams, and roof for a house. Learn semantic HTML, forms, tables, and accessibility.",
                projects: "Build a personal portfolio structure",
              },
              {
                number: "02",
                title: "CSS (Cascading Style Sheets)",
                description:
                  "Paint and decorate your house. Learn layouts (Flexbox, Grid), responsive design, animations, and modern CSS techniques to make websites beautiful.",
                projects: "Style your portfolio with responsive design",
              },
              {
                number: "03",
                title: "Version Control (Git & GitHub) And Bash",
                description:
                  "Learn to track changes, collaborate with others, and deploy your projects. Essential for every developer's workflow. And how to interact with CLI tools like Git Bash.",
                projects: "Deploy your portfolio on GitHub Pages",
              },
              {
                number: "04",
                title: "JavaScript Fundamentals",
                description:
                  "Add interactivity to your websites. Learn variables, functions, DOM manipulation, events, and asynchronous programming.",
                projects: "Add interactive features to your portfolio",
              },
              {
                number: "05",
                title: "Advanced JavaScript",
                description:
                  "Master ES6+ features, APIs, local storage, and modern JavaScript patterns. Build complex interactive applications.",
                projects:
                  "Build a weather app with API integration and other API feature Apps",
              },
              {
                number: "06",
                title: "React.js",
                description:
                  "Build reusable UI components, manage state efficiently, and create single-page applications with modern React patterns.",
                projects:
                  "Build product  e-commerce website with React from dummyjson",
              },
              {
                number: "07",
                title: "Deployment & Optimization",
                description:
                  "Learn to deploy applications, optimize performance, implement SEO, and ensure accessibility compliance.",
                projects: "Deploy and optimize your React application",
              },
            ].map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-header">
                  <span className="step-number">{step.number}</span>
                  <h3 className="step-title">{step.title}</h3>
                </div>
                <p className="step-description">{step.description}</p>
                <div className="step-project">
                  <span className="project-label">Project:</span>
                  <span className="project-text">{step.projects}</span>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="course-actions">
            <button className="course-btn primary">Start Frontend Path</button>
            <button className="course-btn secondary">
              View Detailed Curriculum
            </button>
          </div> */}
        </div>
      </section>

      {/* Backend Development Path */}
      <section className="course-section">
        <div className="course-header">
          <h2 className="course-title">Backend Development Path</h2>
          <p className="course-subtitle">
            Build the engine behind websites—databases, servers, APIs, and
            authentication.
          </p>
        </div>

        <div className="course-card">
          <div className="course-steps">
            {[
              {
                number: "01",
                title: "Node.js & Server Basics",
                description:
                  "Learn JavaScript on the server side. Understand HTTP servers, routing, and handling requests/responses.",
                projects: "Build a simple REST API server",
              },
              {
                number: "02",
                title: "Express.js Framework",
                description:
                  "Build robust web applications and APIs with middleware, routing, and error handling.",
                projects: "Create a complete CRUD API",
              },
              {
                number: "03",
                title: "Databases (MySQL & MongoDB)",
                description:
                  "Learn both SQL and NoSQL databases. Understand database design, queries, and relationships.",
                projects: "Design and implement database schemas",
              },
              {
                number: "04",
                title: "Authentication & Authorization",
                description:
                  "Implement secure user authentication with JWT, sessions, and OAuth. Learn security best practices.",
                projects: "Add user authentication to your API",
              },
              {
                number: "05",
                title: "API Integration & Testing",
                description:
                  "Build RESTful APIs, integrate third-party services, and implement comprehensive testing.",
                projects: "Build and test a payment integration",
              },
              {
                number: "06",
                title: "Deployment & DevOps Basics",
                description:
                  "Deploy applications to cloud platforms, set up CI/CD pipelines, and monitor performance.",
                projects: "Deploy a full-stack application",
              },
            ].map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-header">
                  <span className="step-number">{step.number}</span>
                  <h3 className="step-title">{step.title}</h3>
                </div>
                <p className="step-description">{step.description}</p>
                <div className="step-project">
                  <span className="project-label">Project:</span>
                  <span className="project-text">{step.projects}</span>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="course-actions">
            <button className="course-btn primary">Start Backend Path</button>
            <button className="course-btn secondary">
              View Detailed Curriculum
            </button>
          </div> */}
        </div>
      </section>

      {/* Full-Stack Development */}
      <section className="course-section">
        <div className="course-header">
          <h2 className="course-title">Full-Stack Mastery</h2>
          <p className="course-subtitle">
            Combine frontend and backend skills to build complete,
            production-ready applications.
          </p>
        </div>

        <div className="course-card">
          <div className="course-steps">
            {[
              {
                number: "01",
                title: "E-commerce Platform",
                description:
                  "Build a complete e-commerce application with shopping cart, product catalog, user authentication, and payment integration. Learn full-stack architecture, database design, and security best practices for handling transactions.",
                projects: "Build a full-featured online store",
              },
              {
                number: "02",
                title: "Social Media Application",
                description:
                  "Create a mini social media platform with user registration, post creation, media uploads, and real-time notifications. Learn file upload handling with Multer, cloud storage integration, and implementing social features like following and feed algorithms.",
                projects: "Build a Twitter/Instagram-style platform",
              },
              {
                number: "03",
                title: "Netflix Clone",
                description:
                  "Develop a streaming platform interface with featured banners, movie sliders, and video previews. Implement user authentication, watchlist functionality, and a responsive UI that works across all devices.",
                projects: "Create a Netflix-style streaming interface",
              },
              {
                number: "04",
                title: "Personal Full-Stack Project",
                description:
                  "Create your own unique application to solve a real problem. This is where true learning happens - encountering bugs, finding solutions, and building something meaningful. Apply everything you've learned to create a project that showcases your skills.",
                projects: "Build your own problem-solving application",
              },
            ].map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-header">
                  <span className="step-number">{step.number}</span>
                  <h3 className="step-title">{step.title}</h3>
                </div>
                <p className="step-description">{step.description}</p>
                <div className="step-project">
                  <span className="project-label">Project:</span>
                  <span className="project-text">{step.projects}</span>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="course-actions">
            <button className="course-btn primary">
              Start Full-Stack Path
            </button>
            <button className="course-btn secondary">
              View Project Gallery
            </button>
          </div> */}
        </div>
      </section>

      {/* Call to Action */}
      <section className="roadmap-cta">
        <h2 className="cta-title">Ready to Follow the Path?</h2>
        <p className="cta-subtitle">
          Each step builds upon the previous one. No shortcuts, no
          confusion—just clear, structured learning that leads to real results.
        </p>
        <div className="cta-actions">
          <Link to="/register">
            <button className="cta-btn primary">Begin Your Journey</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Roadmap;