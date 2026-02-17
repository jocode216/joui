import React, { useState } from "react";
import "./jocode.css";
import PublicHeader from "@/components/layout/PublicHeader";

interface Achievement {
  id: number;
  title: string;
  member: string;
  date: string;
  description: string;
  stats: Record<string, string>;
  npmUrl?: string;
  githubUrl?: string;
  command?: string;
}

function Jocode() {
  const achievements: Achievement[] = [
    {
      id: 1,
      title: "Jocode-Create-Folder CLI Tool",
      member: "Joseph Teka",
      date: "Published a day ago",
      description:
        "A simple CLI tool that creates a complete full-stack project folder structure instantly. Stop wasting time creating folders and files every time you start a new project!",
      stats: {
        downloads: "510+ weekly downloads",
        version: "1.0.4",
        license: "MIT",
        size: "22.1 kB",
      },
      npmUrl: "https://www.npmjs.com/package/jocode-create-folder",
      githubUrl: "https://github.com/Josy216/create-folder",
      command: "npx jocode-create-folder",
    },
    {
      id: 2,
      title: "What Will You Build?",
      member: "You",
      date: "Coming soon",
      description:
        "Your project could be featured here! Build something useful, share it with the community, and get recognized for your contribution.",
      stats: {
        status: "Your opportunity",
        impact: "Help fellow developers",
        recognition: "Featured here",
      },
    },
  ];
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);


  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command).then(() => {
      setCopiedCommand(command);

      setTimeout(() => {
        setCopiedCommand(null);
      }, 1500);
    });
  };


  const handleOpenLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <PublicHeader />

      <div className="jocode-news">
        {/* Hero Section */}
        <section className="news-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Jocode <span className="hero-highlight">News & Updates</span>
            </h1>
            <p className="hero-subtitle">
              Celebrating achievements, sharing updates, and showcasing tools
              built by Jocode members that help developers save time and build
              better.
            </p>
            <blockquote className="hero-quote">
              "The best way to learn is to build. The best way to grow is to
              share what you've built."
            </blockquote>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="achievements-section">
          <div className="section-header">
            <h2 className="section-title">
              Recent <span className="section-highlight">Achievements</span>
            </h2>
            <p className="section-subtitle">
              Tools, packages, and projects created by Jocode members that
              benefit the developer community.
            </p>
          </div>

          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <div className="card-header">
                  <div className="member-badge">
                    <span className="member-name">{achievement.member}</span>
                  </div>
                  <span className="date-badge">{achievement.date}</span>
                </div>

                <div className="card-content">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-description">
                    {achievement.description}
                  </p>

                  {achievement.command && (
                    <div className="command-section">
                      <div className="command-box">
                        <code>{achievement.command}</code>
                        <button
                          className="copy-btn"
                          onClick={() =>
                            handleCopyCommand(achievement.command!)
                          }
                          title="Copy to clipboard"
                        >
                          {copiedCommand === achievement.command
                            ? "Copied"
                            : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="stats-grid">
                    {Object.entries(achievement.stats).map(([key, value]) => (
                      <div key={key} className="stat-item">
                        <span className="stat-label">{key}</span>
                        <span className="stat-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-footer">
                  {achievement.npmUrl && (
                    <button
                      className="action-btn primary"
                      onClick={() => handleOpenLink(achievement.npmUrl!)}
                    >
                      View on npm
                    </button>
                  )}
                  {achievement.githubUrl && (
                    <button
                      className="action-btn primary"
                      onClick={() => handleOpenLink(achievement.githubUrl!)}
                    >
                      View on GitHub
                    </button>
                  )}
                  {!achievement.npmUrl && !achievement.githubUrl && (
                    <button className="action-btn secondary" disabled>
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Achievement Section */}
        <section className="submit-section">
          <div className="submit-card">
            <h2 className="submit-title">Have Something to Share?</h2>
            <p className="submit-subtitle">
              Built a tool, package, or project that helps developers? Share it
              with the Jocode community and get featured here!
            </p>

            <div className="submit-requirements">
              <h3>Requirements for submission:</h3>
              <ul>
                <li>Must be useful for other developers</li>
                <li>Must be open source or have a free tier</li>
                <li>Must be well-documented</li>
                <li>Should solve a real problem developers face</li>
              </ul>
            </div>

            <div className="submit-actions">
              <button
                className="submit-btn primary"
                onClick={() =>
                  handleOpenLink(
                    "mailto:contact@josephteka.com?subject=Jocode Achievement Submission",
                  )
                }
              >
                Email Submission
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Jocode;
