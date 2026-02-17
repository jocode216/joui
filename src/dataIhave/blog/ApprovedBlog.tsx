import React, { useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import "./Blog.css";
import Docs from "../mern/Docs";

interface Course {
  id: number;
  title: string;
  description: string;
  video_url: string;
  price: number;
  is_premium: boolean;
  isFreeTrial?: boolean;
}

const ApprovedBlog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"videos" | "docs">("videos");
  const videoRef = useRef<HTMLDivElement | null>(null);

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

  // Only keep the File Uploads video
  const optionalVideos = [
    {
      id: 1,
      title:
        "File Uploads in Node.js Using Multer — Clean Backend Setup (Express)",
      url: "https://www.youtube.com/watch?v=amu313PyL-I",
      description:
        "Learn how to handle file uploads in Node.js using Multer — set up storage, routes, and serve uploaded files with Express.",
      isLocked: false,
    },
  ];

  // Add locked videos that will show as locked/busy
  const lockedVideos = [
    {
      id: 2,
      title: "BaaS Introduction",
      description:
        "Comprehensive overview of Backend-as-a-Service solutions. Compare different BaaS providers, understand serverless architecture benefits, and learn when to choose BaaS over traditional backend development.",
      isLocked: true,
    },
    {
      id: 3,
      title: "Superbase Auth",
      description:
        "Complete guide to Superbase Authentication implementation. Cover email/password auth, OAuth providers, magic links, JWT management, user metadata, and building secure auth workflows.",
      isLocked: true,
    },
    {
      id: 4,
      title: "Superbase Storage",
      description:
        "Master Superbase Storage with practical examples. Learn bucket management, signed URLs, file versioning, image transformations, access controls (RLS), and optimizing storage performance.",
      isLocked: true,
    },
  ];

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
        ...(data.courses || []),
        ...optionalVideos.map((video, index) => ({
          id: data.courses.length + index + 1001,
          title: video.title,
          description: video.description,
          video_url: video.url,
          price: 0,
          is_premium: false,
        })),
      ];

      setCourses(allCourses);

      if (freeTrials.length > 0) {
        setCurrentVideo(freeTrials[0].url);
      }
    } catch (err) {
      console.error(err);
      const allFallbackCourses = [
        ...freeTrials.map((trial) => ({
          id: trial.id,
          title: trial.title,
          description: trial.description,
          video_url: trial.url,
          price: 0,
          is_premium: trial.is_premium,
          isFreeTrial: true,
        })),
        ...optionalVideos.map((video, index) => ({
          id: index + 1001,
          title: video.title,
          description: video.description,
          video_url: video.url,
          price: 0,
          is_premium: false,
        })),
      ];
      setCourses(allFallbackCourses);

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
      });
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    } catch {
      return "";
    }
  };

  const handleVideoPlay = (videoUrl: string) => {
    setCurrentVideo(videoUrl);

    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const [cominSoon, setComingSoon] = useState('');

  const handleLockedVideoClick = () => {
    setComingSoon('This video is currently unavailable. comin soon!');

  };

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
    <section id="blog" className="blog-section">
      <div className="container">
        {/* 🎥 Video Player */}
        <div className="video-player-container" ref={videoRef}>
          {currentVideo ? (
            <iframe
              key={currentVideo}
              width="100%"
              height="450"
              src={getYoutubeEmbedUrl(currentVideo)}
              title="Course Video"
              frameBorder={0}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            ></iframe>
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
          <>
            {/* Free Trials Section */}
            {freeTrials.length > 0 && (
              <div className="section-container">
                <h2 className="section-title">Free Trial Videos</h2>
                <div className="skills-grid">
                  {freeTrials.map((trial) => {
                    const videoIdMatch = trial.url.match(
                      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                    );
                    const videoId = videoIdMatch ? videoIdMatch[1] : null;
                    const thumbnail = videoId
                      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                      : "/placeholder.jpg";

                    return (
                      <div
                        key={trial.id}
                        className="skill-item free-trial"
                        onClick={() => handleVideoPlay(trial.url)}
                      >
                        <div className="skill-thumbnail">
                          <img
                            src={thumbnail}
                            alt={trial.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/placeholder.jpg";
                            }}
                          />
                        </div>

                        <div className="skill-content">
                          <h3 className="skill-title">{trial.title}</h3>
                          <p className="skill-description">
                            {trial.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Courses from API Section */}
            {courses.filter((course) => !course.isFreeTrial && course.id < 1000)
              .length > 0 && (
              <div className="section-container">
                <h2 className="section-title">Course Videos</h2>
                <div className="skills-grid">
                  {courses
                    .filter((course) => !course.isFreeTrial && course.id < 1000)
                    .map((course) => {
                      const videoIdMatch = course.video_url.match(
                        /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                      );
                      const videoId = videoIdMatch ? videoIdMatch[1] : null;
                      const thumbnail = videoId
                        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                        : "/placeholder.jpg";

                      return (
                        <div
                          key={course.id}
                          className="skill-item"
                          onClick={() => handleVideoPlay(course.video_url)}
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
                          </div>

                          <div className="skill-content">
                            <h3 className="skill-title">{course.title}</h3>
                            <p className="skill-description">
                              {course.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Optional Videos Section */}
            <div className="section-container optional-section">
              <section className="section-title">
                <h2>Optional Videos</h2>
                <p style={{ fontSize: "16px", fontWeight: "400" }}>
                  These optional bonus videos are designed to help you complete
                  your project and gain a clear understanding of real-world
                  full-stack workflows, including file uploads, authentication
                  using BaaS providers, and live storage with Supabase buckets.
                </p>
              </section>

              
                <p style={{textAlign:'center', color:'red'}}>{cominSoon}</p>
              

              <div className="skills-grid">
                {/* Available File Uploads Video */}
                {optionalVideos.map((video) => {
                  const videoIdMatch = video.url.match(
                    /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                  );
                  const videoId = videoIdMatch ? videoIdMatch[1] : null;
                  const thumbnail = videoId
                    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                    : "/placeholder.jpg";

                  return (
                    <div
                      key={video.id}
                      className="skill-item optional-video"
                      onClick={() => handleVideoPlay(video.url)}
                    >
                      <div className="skill-thumbnail">
                        <img
                          src={thumbnail}
                          alt={video.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/placeholder.jpg";
                          }}
                        />
                        <div className="optional-badge">Optional</div>
                      </div>

                      <div className="skill-content">
                        <h3 className="skill-title">{video.title}</h3>
                        <p className="skill-description">{video.description}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Locked/Busy Videos */}
                {lockedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="skill-item locked-video"
                    onClick={handleLockedVideoClick}
                  >
                    <div className="skill-thumbnail locked-thumbnail">
                      <div className="thumbnail-overlay">
                        <span className="busy-text">BUSY</span>
                      </div>
                      <div className="optional-badge locked-badge">Locked</div>
                    </div>

                    <div className="skill-content locked-content">
                      <h3 className="skill-title">
                        {video.title}
                        <span className="busy-indicator"> [Busy]</span>
                      </h3>
                      <p className="skill-description">{video.description}</p>
                      <div className="busy-message">
                        This video is currently unavailable. Please check back
                        later!
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
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

export default ApprovedBlog;