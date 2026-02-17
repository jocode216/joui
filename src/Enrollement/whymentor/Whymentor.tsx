import React from "react";
import "./whymentor.css";

export default function Whymentor() {
  return (
    <section className="why-mentorship">
      <header className="mentorship-header">
        <div className="mentorship-avatar">JT</div>
        <div>
          <h2>What Makes This Mentorship Different</h2>
          <p>
            A clear, practical approach — one mentor, real projects, lifetime
            resources.
          </p>
        </div>
      </header>

      <div className="mentorship-grid">
        {/* Combined Benefit 1: Personal Mentorship */}
        <article className="mentorship-card">
          <h3>1. One‑to‑One Mentorship — Not Just a Course</h3>
          <p>
            Unlike pre-recorded tutorials, this program is{" "}
            <strong>personal</strong>. Every learner gets direct one-on-one
            mentorship with me — real conversations, feedback, and answers to
            your exact questions.
          </p>
          <ul>
            <li>Personal code reviews</li>
            <li>Direct answers to your questions</li>
            <li>Career guidance & interview prep</li>
          </ul>
        </article>

        {/* Combined Benefit 2: Project-Based Learning */}
        <article className="mentorship-card">
          <h3>2. Real Projects, Real Skills</h3>
          <p>
            Each lesson maps to a real project (e.g.,{" "}
            <em>Hotel Management System</em>). You apply Node, Express, React,
            and MySQL together — not just syntax, but the flow of building
            production-like apps.
          </p>
          <ul>
            <li>Clean MVC architecture</li>
            <li>Professional project structure</li>
            <li>Scalable code organization</li>
          </ul>
        </article>

        {/* Combined Benefit 3: Complete Application Flow */}
        <article className="mentorship-card">
          <h3>3. End-to-End Application Development</h3>
          <p>
            Start from scratch and finish with fully deployed full‑stack apps —
            front to back, with real APIs, authentication, and database
            integration.
          </p>
          <ul>
            <li>API design & consumption</li>
            <li>Database relationships</li>
            <li>Frontend-backend connection</li>
          </ul>
        </article>

        {/* Combined Benefit 4: Security & Authentication */}
        <article className="mentorship-card">
          <h3>4. Production-Ready Security</h3>
          <p>
            Implement secure systems that actually work in production
            environments, not just in tutorials.
          </p>
          <ul>
            <li>JWT authentication</li>
            <li>Password hashing with bcrypt</li>
            <li>Role-based access control</li>
            <li>Secure API endpoints</li>
          </ul>
        </article>

        {/* Combined Benefit 5: Deployment Skills */}
        <article className="mentorship-card">
          <h3>5. Real Deployment Experience</h3>
          <p>
            Learn how to deploy your applications so they're actually accessible
            to users worldwide.
          </p>
          <ul>
            <li>Frontend deployment (Netlify/Vercel)</li>
            <li>Backend deployment (Railway/Render)</li>
            <li>Database configuration</li>
            <li>Environment variables & security</li>
          </ul>
        </article>

        {/* Combined Benefit 6: Portfolio & Career */}
        <article className="mentorship-card">
          
          <h3>6.Project Baseed & Lifetime Access</h3>
          <p>
            Graduate with production-ready applications and get lifetime access
            to resources and new project releases.
          </p>
          <ul>
            <li>Hotel Management System</li>
            <li>Apply PWA(so that people use it as Mobile App)</li>
            <li>Admin Dashboard(With all CRUD operations)</li>
            <li>Deploy and let world use it</li>
          </ul>
        </article>
      </div>

      <footer className="mentorship-footer">
        <h4>You Already Know the Basics — Join And Let Us See How They Connect Together</h4>
        <blockquote>
          "My mentorship isn't a course — it's a <strong>conversation</strong>{" "}
          that teaches you how to think and build like a full‑stack developer.
          If you understand React components, Node.js basics, and database
          concepts but struggle to build complete applications, this is exactly
          what you need."
        </blockquote>
      </footer>
    </section>
  );
}
