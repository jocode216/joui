import { useEffect, useRef, useState } from "react";
import "./Blog.css";
import { roadmapSkills } from "./List";
import { useNavigate } from "react-router-dom";

const Sample: React.FC = () => {
  const [videos] = useState(roadmapSkills.slice(0, 4)); // 🎯 only first 3
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // 🎬 No autoplay
  const getYoutubeEmbedUrl = (videoId: string): string => {
    const params = new URLSearchParams({
      autoplay: "0",
      modestbranding: "1",
      rel: "0",
      showinfo: "0",
      fs: "1",
      controls: "1",
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // 🧠 Default video = first one
  useEffect(() => {
    if (videos.length > 0) setCurrentVideo(videos[0].videoId);
  }, [videos]);

  // 🖱️ When a thumbnail is clicked
  const handleVideoPlay = (videoId: string) => {
    setCurrentVideo(videoId);
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section id="blog" className="blog-section">
      <div className="container">
        {/* 🎥 Main video player */}
        <div className="video-player-container" ref={videoRef}>
          {currentVideo ? (
            <iframe
              key={currentVideo}
              width="100%"
              height="450"
              src={getYoutubeEmbedUrl(currentVideo)}
              title="Tutorial Video"
              frameBorder={0}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="video-placeholder">
              <p>Select a video to start watching 🎬</p>
            </div>
          )}
        </div>

        <h2 style={{ textAlign: "center", color: "gray", padding: "12px 0" }}>
          Jocode Tutorials
        </h2>

        {/* 🧩 Thumbnails */}
        <div className="skills-grid">
          {videos.map((video) => {
            const thumbnail = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
            return (
              <div
                key={video.id}
                className="skill-item"
                onClick={() => handleVideoPlay(video.videoId)}
              >
                <div className="skill-thumbnail">
                  <img src={thumbnail} alt={video.name} />
                </div>
                <div className="skill-content">
                  <h3 className="skill-title">{video.name}</h3>
                  <p className="skill-description">{video.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button onClick={() => navigate("/tutorial")} className="explore-btn">
            Show More Free Tutorials 
          </button>
        </div>
      </div>
    </section>
  );
};

export default Sample;
