import { useState, useEffect } from "react";
import "./details.css";
import { Link } from "react-router-dom";
import Whymentor from "../whymentor/Whymentor";
import { ScaleLoader } from "react-spinners";

interface Course {
  id: number;
  title: string;
  description: string;
  video_url: string;
  price: number;
  is_premium: boolean;
  isFreeTrial?: boolean;
}

const Details: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isEnrolled] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // === Free Trial Videos ===
  const freeTrials = [
    {
      id: 1,
      title: "What will You learn?",
      url: "https://www.youtube.com/watch?v=gpnYR_G6zco",
      description: "Introduction to the full course and what you'll learn",
      is_premium: false,
      isFreeTrial: true,
    },
    {
      id: 2,
      title: "MUST KNOW ES6 JavaScript Basics - Hotel Management System Series",
      url: "https://youtu.be/VmwgGLvEKzs",
      description:
        "Learn essential ES6 JavaScript features that we'll use throughout our hotel management system project",
      is_premium: false,
      isFreeTrial: true,
    },
    {
      id: 3,
      title:
        "Project Setup: MVC Architecture & Express.js - Hotel Management System #2",
      url: "https://youtu.be/5yek6gHnd90",
      description:
        "Set up professional MVC architecture with Express.js and organize your project structure",
      is_premium: false,
      isFreeTrial: true,
    },
    {
      id: 4,
      title:
        "File Uploads in Node.js Using Multer — Clean Backend Setup (Express)",
      url: "https://www.youtube.com/watch?v=amu313PyL-I",
      description:
        "Learn how to handle file uploads in Node.js using Multer — set up storage, routes, and serve uploaded files with Express.",
      is_premium: false,
      isFreeTrial: true,
    },
  ];

  // Fetch courses (simulated for now)
  const fetchCourses = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For now, use free trials as courses
      const allCourses = freeTrials.map((trial) => ({
        id: trial.id,
        title: trial.title,
        description: trial.description,
        video_url: trial.url,
        price: 0,
        is_premium: trial.is_premium,
        isFreeTrial: true,
      }));

      setCourses(allCourses);

      // Set initial video
      if (freeTrials.length > 0) {
        setCurrentVideo(freeTrials[0].url);
      }
    } catch (err) {
      console.error(err);
      // Fallback to free trials
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

  // Add useEffect here - this was missing
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

  const handleVideoPlay = (videoUrl: string, isPremium: boolean) => {
    if (isPremium && !isEnrolled) return;
    setCurrentVideo(videoUrl);
  };

  const handleEnroll = () => {
    // Navigate to register page
    window.location.href = "/register";
  };

  if (loading) {
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
  }

  return (
    <div className="premium-wrapper">
      <div className="vertical-layout">
        {/* Left Side: Video Player */}
        <div className="left-column">
          {/* 🎬 Main Video Player */}
          <div className="video-player-container">
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
        </div>

        {/* Right Side: Course List */}
        <div className="right-column">
          <div className="course-list-header">
            <h2>Course Videos</h2>
            <p>Click on any video to play it</p>
          </div>

          {/* Vertical Course List */}
          <div className="vertical-course-list">
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
                  className={`vertical-course-item ${locked ? "locked" : ""} ${
                    course.isFreeTrial ? "free-trial" : ""
                  } ${currentVideo === course.video_url ? "active" : ""}`}
                  onClick={() =>
                    !locked &&
                    handleVideoPlay(course.video_url, course.is_premium)
                  }
                >
                  <div className="course-thumbnail">
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
                    {currentVideo === course.video_url && (
                      <div className="playing-badge">▶ Playing</div>
                    )}
                  </div>

                  <div className="course-content">
                    <h3 style={{fontSize:'14px'}} className="course-title" >
                      {course.title}
                      {locked && <span className="premium-badge">Premium</span>}
                    </h3>
                    <p className="course-description">{course.description}</p>
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

          {/* Enrollment Button */}
          <div className="enrollment-section">
            <h3>Ready to Start Learning?</h3>
            <p>
              Enroll now to get access to all premium content and mentorship!
            </p>
            <Link to="/register">
              <button className="enroll-btn-large">
                Proceed to Enrollment
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Why Mentor Section */}
      <div>
        <Whymentor />
      </div>
    </div>
  );
};

export default Details;
