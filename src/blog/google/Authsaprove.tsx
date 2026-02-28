import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import "./Blog.css";
import Docs from "../../mern/Docs";

interface Course {
  id: number;
  title: string;
  description: string;
  video_url: string;
  price: number;
  is_premium: boolean;
  isFreeTrial?: boolean;
}

const Authsaprove: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isEnrolled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"videos" | "docs">("videos");
  const videoRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Static Videos
  const freeTrials = [
    {
      id: 1,
      title: "MUST KNOW ES6 JavaScript Basics - Hotel Management System Series",
      url: "https://youtu.be/VmwgGLvEKzs",
      description:
        "Learn essential ES6 JavaScript features that we'll use throughout our hotel management system project - arrow functions, destructuring, template literals, async/await and more!",
      is_premium: false,
      isFreeTrial: true,
    },
    {
      id: 2,
      title:
        "Project Setup: MVC Architecture & Express.js - Hotel Management System #2",
      url: "https://youtu.be/5yek6gHnd90",
      description:
        "Set up professional MVC architecture with Express.js, customize package.json, install dependencies and organize your project structure for scalability.",
      is_premium: false,
      isFreeTrial: true,
    },
    {
      id: 3,
      title:
        "Finalizing Setup: Express Routes, Database & Vite Frontend - Hotel Management #3",
      url: "https://youtu.be/raS8Dfvk4Ys",
      description:
        "Complete setup with Express routes, MYSQL connection, Vite frontend app configuration and API testing with Postman.",
      is_premium: false,
      isFreeTrial: true,
    },
  ];

  const premiumVideos = [
    {
      id: 10,
      title: "Premium Hotel Management Lesson 1",
      url: "https://youtu.be/XXXXX",
      description: "Advanced hotel management techniques and strategies",
      price: 300,
      is_premium: true,
    },
    {
      id: 11,
      title: "Premium Hotel Management Lesson 2",
      url: "https://youtu.be/YYYYY",
      description: "Master class on hotel system optimization",
      price: 300,
      is_premium: true,
    },
  ];

  // DevTools Protection
  useEffect(() => {
    const interval = setInterval(() => {
      const devtoolsOpen =
        window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 160;

      if (devtoolsOpen) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/courses", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();

      const allCourses = [
        ...freeTrials.map((trial) => ({
          id: trial.id,
          title: trial.title,
          description: trial.description,
          video_url: trial.url,
          price: 0,
          is_premium: trial.is_premium,
          isFreeTrial: true,
        })),
        ...premiumVideos.map((premium) => ({
          id: premium.id,
          title: premium.title,
          description: premium.description,
          video_url: premium.url,
          price: premium.price,
          is_premium: premium.is_premium,
        })),
        ...(data.courses || []),
      ];

      setCourses(allCourses);

      if (freeTrials.length > 0) {
        setCurrentVideo(freeTrials[0].url);
      }
    } catch (err) {
      console.error(err);
      const freeTrialCourses = freeTrials.map((trial) => ({
        id: trial.id,
        title: trial.title,
        description: trial.description,
        video_url: trial.url,
        price: 0,
        is_premium: trial.is_premium,
        isFreeTrial: true,
      }));
      setCourses(freeTrialCourses);

      if (freeTrials.length > 0) {
        setCurrentVideo(freeTrials[0].url);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const getYoutubeEmbedUrl = (videoUrl: string): string => {
    try {
      const videoIdMatch = videoUrl.match(
        /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      if (!videoId) return "";
      const params = new URLSearchParams({
        autoplay: "0",
        modestbranding: "1",
        rel: "0",
        showinfo: "0",
        fs: "1",
        controls: "1",
        disablekb: "0",
        iv_load_policy: "3",
        playsinline: "1",
      });
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    } catch {
      return "";
    }
  };

  const handleVideoPlay = (videoUrl: string, isPremium: boolean) => {
    if (isPremium && !isEnrolled) return;
    setCurrentVideo(videoUrl);
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleEnroll = () => navigate("/register");

  if (loading)
    return (
      <div className="loader-container">
        <ScaleLoader
          color="#36d7b7"
          height={40}
          width={6}
          radius={2}
          margin={4}
        />
      </div>
    );

  return (
    <section
      id="blog"
      className="blog-section"
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key === "I") ||
          (e.ctrlKey && e.shiftKey && e.key === "J") ||
          (e.ctrlKey && e.key === "U")
        ) {
          e.preventDefault();
          localStorage.removeItem("token");
          navigate("/login");
        }
      }}
    >
      <div className="container">
        {/* Protected Video Player */}
        <div className="video-player-container" ref={videoRef}>
          {currentVideo ? (
            <div className="video-wrapper">
              <iframe
                key={currentVideo}
                src={getYoutubeEmbedUrl(currentVideo)}
                title="Course Video"
                frameBorder={0}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              ></iframe>

              {/* YouTube UI Blockers */}
              <div className="yt-block yt-logo"></div>
              <div className="yt-block yt-watch-later"></div>
              <div className="yt-block yt-share"></div>
              <div className="yt-block yt-settings"></div>
            </div>
          ) : (
            <div className="video-placeholder">
              <p>Select a course to start learning 🎓</p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="resource-tabs">
          <button
            className={`tab-button ${activeTab === "videos" ? "active" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          <button
            className={`tab-button ${activeTab === "docs" ? "active" : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            Documentation
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "videos" && (
          <div className="skills-grid">
            {courses.map((course) => {
              const videoIdMatch = course.video_url.match(
                /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
              );
              const videoId = videoIdMatch ? videoIdMatch[1] : null;
              const thumbnail = videoId
                ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                : "/placeholder.jpg";
              const locked = course.is_premium && !isEnrolled;

              return (
                <div
                  key={course.id}
                  className={`skill-item ${locked ? "locked" : ""} ${
                    course.isFreeTrial ? "free-trial" : ""
                  }`}
                  onClick={() =>
                    !locked &&
                    handleVideoPlay(course.video_url, course.is_premium)
                  }
                >
                  <div className="skill-thumbnail">
                    <img
                      src={thumbnail}
                      alt={course.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/placeholder.jpg";
                      }}
                    />
                    {locked && (
                      <div className="lock-overlay">
                        <div className="lock-icon">🔒</div>
                      </div>
                    )}
                    {course.isFreeTrial && (
                      <div className="free-badge">Free</div>
                    )}
                  </div>

                  <div className="skill-content">
                    <h3 className="skill-title">
                      {course.title}
                      {locked && <span className="premium-badge">Premium</span>}
                    </h3>
                    <p className="skill-description">{course.description}</p>
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
        )}

        {activeTab === "docs" && (
          <div className="docs-section">
            <Docs />
          </div>
        )}
      </div>
    </section>
  );
};

export default Authsaprove;
