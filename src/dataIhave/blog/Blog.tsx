import { useEffect, useRef, useState } from "react";
import "./Blog.css";
import { roadmapSkills } from "./List";
import { useNavigate } from "react-router-dom";
import PublicHeader from "@/components/layout/PublicHeader";

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isEnrolled] = useState<boolean>(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    { id: "all", name: "All Skills" },
    { id: "basics", name: "Basics" },
    { id: "tools", name: "Tools" },
    { id: "roadmap", name: "Roadmap" },
    { id: "fullstack", name: "FullStack" },
  ];

  const premiumCategories = ["backend", "database"];

  const filteredSkills =
    activeCategory === "all"
      ? roadmapSkills
      : roadmapSkills.filter((skill) => skill.category === activeCategory);

  // ✅ autoplay = false (OFF)
  const getYoutubeEmbedUrl = (videoId: string): string => {
    const params = new URLSearchParams({
      autoplay: "0", // turned OFF
      modestbranding: "1",
      rel: "0",
      showinfo: "0",
      fs: "1",
      controls: "1",
      disablekb: "0",
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const handleVideoPlay = (videoId: string, category: string) => {
    if (premiumCategories.includes(category) && !isEnrolled) return;

    setCurrentVideo(videoId);

    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleEnroll = () => navigate("/register");

  const isSkillLocked = (category: string) =>
    premiumCategories.includes(category) && !isEnrolled;

  // ✅ Default video (paused, no autoplay)
  useEffect(() => {
    if (roadmapSkills.length > 0) {
      setCurrentVideo(roadmapSkills[0].videoId);
    }
  }, []);

  return (
    <>
    <PublicHeader />
      <section id="blog" className="blog-section">
        <div className="container">
          {/* 🎥 Video Player */}
          <div className="video-player-container" ref={videoRef}>
            {currentVideo ? (
              <iframe
                key={currentVideo}
                width="100%"
                height="450"
                src={getYoutubeEmbedUrl(currentVideo)} // ✅ no autoplay
                title="Skill Video"
                frameBorder={0}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="video-placeholder">
                <p>Select a skill to start learning 🎓</p>
              </div>
            )}
          </div>

          <h2 style={{ textAlign: "center", color: "gray", padding: "12px 0" }}>
            Filter As you Want
          </h2>

          {/* 🧭 Category Filter */}
          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  activeCategory === category.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
                {premiumCategories.includes(category.id) && !isEnrolled && (
                  <span className="premium-badge">Premium</span>
                )}
              </button>
            ))}
          </div>

          {/* 🧩 Skills Grid */}
          <div className="skills-grid">
            {filteredSkills.map((skill) => {
              const locked = isSkillLocked(skill.category);
              const thumbnail = `https://img.youtube.com/vi/${skill.videoId}/mqdefault.jpg`;

              return (
                <div
                  key={skill.id}
                  className={`skill-item ${locked ? "locked" : ""}`}
                  onClick={() =>
                    !locked && handleVideoPlay(skill.videoId, skill.category)
                  }
                >
                  <div className="skill-thumbnail">
                    <img src={thumbnail} alt={skill.name} />
                    {locked && (
                      <div className="lock-overlay">
                        <div className="lock-icon">🔒</div>
                      </div>
                    )}
                  </div>

                  <div className="skill-content">
                    <h3 className="skill-title">
                      {skill.name}
                      {locked && <span className="premium-badge">Premium</span>}
                    </h3>
                    <p className="skill-description">{skill.description}</p>
                    {locked && (
                      <button
                        className="enroll-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnroll();
                        }}
                      >
                        Enroll to Unlock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
