import React, { useEffect, useState } from "react";
import "./Blog.css";

const roadmapSkills = [
  {
    id: "html-intro",
    name: "Introduction to HTML",
    category: "basics",
    color: "skill-basics",
    videoUrl: "https://youtu.be/HXu73kJeKlo?si=UIpnpO31WfAYaZmI",
    videoId: "HXu73kJeKlo",
    description:
      "Learn the foundational building blocks of the web — structure your pages with HTML elements and tags.",
  },
  {
    id: "HTML Full Course",
    name: "Learn Html From scratch",
    category: "basics",
    color: "skill-primary",
    videoUrl: "https://www.youtube.com/watch?v=MmQG7TMZ1rU",
    videoId: "MmQG7TMZ1rU",
    description: "Welcome to Jocode HTML full course",
  },
];

const SingleHtml: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState(roadmapSkills[0]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentVideo(selectedSkill.videoId);
  }, [selectedSkill]);

  const getYoutubeEmbedUrl = (videoId: string): string => {
    const params = new URLSearchParams({
      autoplay: "0",
      modestbranding: "1",
      rel: "0",
      showinfo: "0",
      fs: "1",
      controls: "1",
      disablekb: "0",
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const handleVideoPlay = (skill: (typeof roadmapSkills)[0]) => {
    setSelectedSkill(skill);
    setCurrentVideo(skill.videoId);

    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="blog" className="blog-section">
      <div className="container">
        {/* Video Player */}
        <div className="video-player-container" ref={videoRef}>
          {currentVideo ? (
            <iframe
              key={currentVideo}
              width="100%"
              height="450"
              src={getYoutubeEmbedUrl(currentVideo)}
              title="Skill Video"
              frameBorder={0}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="video-placeholder">
              <p>Loading video...</p>
            </div>
          )}
        </div>

        <h2 style={{ textAlign: "center", color: "gray", padding: "12px 0" }}>
          HTML Tutorials Collection
        </h2>

        {/* HTML Tutorials Grid - Clean version */}
        <div className="skills-grid">
          {roadmapSkills.map((skill) => {
            const thumbnail = `https://img.youtube.com/vi/${skill.videoId}/mqdefault.jpg`;
            const isActive = selectedSkill.id === skill.id;

            return (
              <div
                key={skill.id}
                className={`skill-item ${isActive ? "active" : ""}`}
                onClick={() => handleVideoPlay(skill)}
              >
                <div className="skill-thumbnail">
                  <img src={thumbnail} alt={skill.name} />
                </div>

                <div className="skill-content">
                  <h3 className="skill-title">{skill.name}</h3>
                  <p className="skill-description">{skill.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SingleHtml;
