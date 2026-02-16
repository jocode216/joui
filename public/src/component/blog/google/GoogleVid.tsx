import React, { useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import "./Blog.css";

interface DriveVideo {
  id: number;
  title: string;
  description: string;
  video_url: string;
}

const GoogleVid: React.FC = () => {
  const [videos, setVideos] = useState<DriveVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const defaultVideos: DriveVideo[] = [
    //I just want to create repo and put code on it  give it right description and title
    //
    {
      id: 1,
      title: "Put your site on GitHub Pages",
      description:
        "learn how  to put your code on github pages and let world see your work.",
      video_url:
        "https://drive.google.com/file/d/1suFwNBPA9HSaa24bZ0V2Qxt3jFk3YQrG/view",
    },
    {
      id: 2,
      title: "User Tracker previlege",
      description:
        "Finish user tracking interface how? let the admin edit and ban or delete users from the dashboard.",
      video_url:
        "https://drive.google.com/file/d/1MJM5NXvvEHDmwzaC09dQUCrXbJKz-hF-/view?usp=drivesdk",
    },
    {
      id: 3,
      title: "Order Tracker previlege",
      description:
        "Add Orders table, learn how to use primary key and foriegn key. also calculte total and quantity of menu user can order. then setup clean and clear setup",
      video_url:
        "https://drive.google.com/file/d/1ii_UVh2xnXnLNw-lEZS-fI_j1IecHv5J/view?usp=drivesdk",
    },
  ];

  const fetchVideos = async () => {
    try {
      // You can replace this with your actual API endpoint for Drive videos
      const res = await fetch("https://your-api.com/api/drive-videos");

      if (res.ok) {
        const data = await res.json();
        const allVideos = [...defaultVideos, ...(data.videos || [])];
        setVideos(allVideos);
      } else {
        setVideos(defaultVideos);
      }

      if (defaultVideos.length > 0) {
        setCurrentVideo(defaultVideos[0].video_url);
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setVideos(defaultVideos);

      if (defaultVideos.length > 0) {
        setCurrentVideo(defaultVideos[0].video_url);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Convert Google Drive share URL to direct embed URL
  const getDriveEmbedUrl = (driveUrl: string): string => {
    try {
      const fileIdMatch =
        driveUrl.match(/\/d\/([^\/]+)/) || driveUrl.match(/id=([^&]+)/);
      const fileId = fileIdMatch ? fileIdMatch[1] : null;

      if (!fileId) return "";

      return `https://drive.google.com/file/d/${fileId}/preview`;
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
        {/* 🎥 Video Player - Using iframe with overlay to hide Google Drive arrow */}
        <div className="video-player-container" ref={videoRef}>
          {currentVideo ? (
            <div className="drive-iframe-wrapper">
              <iframe
                ref={iframeRef}
                key={currentVideo}
                width="100%"
                height="100%"
                src={getDriveEmbedUrl(currentVideo)}
                title="Course Video"
                frameBorder={0}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
              {/* Overlay to hide the Google Drive arrow */}
              <div className="drive-overlay"></div>
            </div>
          ) : (
            <div className="video-placeholder">
              <p>Select a video to start learning 🎓</p>
            </div>
          )}
        </div>

        {/* Video Grid */}
        <div className="skills-grid">
          {videos.map((video) => (
            <div
              key={video.id}
              className="skill-item"
              onClick={() => handleVideoPlay(video.video_url)}
            >
              <div className="skill-thumbnail">
                <img
                  src="https://jocode.josephteka.com/jocode.jpg"
                  alt={video.title}
                />
              </div>

              <div className="skill-content">
                <h3 className="skill-title">{video.title}</h3>
                <p className="skill-description">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoogleVid;
