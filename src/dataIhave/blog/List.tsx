// 🧩 Define the structure for a single documentation resource
export interface SkillDoc {
  name?: string;
  title?: string;
  url: string;
}

// 🧠 Define the structure for each skill or learning item
export interface Skill {
  id: string;
  name: string;
  category: string;
  color: string;
  videoUrl: string;
  videoId: string;
  docs?: SkillDoc[];
  description?: string;
}

// 🚀 Example dataset for your skill roadmap
export const roadmapSkills: Skill[] = [
  {
    id: "welcome-to-jocode",
    name: "Welcome to Jocode - Get Started",
    category: "basics",
    color: "skill-primary",
    videoUrl: "https://youtu.be/_BhpZdwS8ns?si=YOUR_VIDEO_ID",
    videoId: "_BhpZdwS8ns",
    description:
      "Welcome to Jocode! Learn how to use our platform, discover its benefits, and explore how to enroll in courses to boost your tech skills.",
  },
  {
    id: "mern-stack-amharic",
    name: "MERN Stack Full Guide በአማርኛ - From Zero to Deployment",
    category: "basics",
    color: "skill-dev",
    videoUrl: "https://www.youtube.com/watch?v=gpnYR_G6zco",
    videoId: "gpnYR_G6zco",
    description: "Complete MERN Stack mentorship in Amharic...",
  },
  {
    id: "hotel-management-mern",
    name: "Full-Stack Hotel Management System (MERN)",
    category: "fullstack",
    color: "skill-dev",
    videoUrl: "https://youtu.be/PyHK26jJfHU",
    videoId: "PyHK26jJfHU",
    description:
      "Learn how to build and deploy a full-stack hotel management system using the MERN stack, step by step.",
  },

  {
    id: "chrome-devtools",
    name: "Learn Developer Tool በ 15 ደቂቃ",
    category: "tools",
    color: "skill-tools",
    videoUrl: "https://youtu.be/qf-zcK1AV1Q?si=eESB7ClkCi0OXopi",
    videoId: "qf-zcK1AV1Q",
    description:
      "Quickly learn how to inspect, debug, and optimize websites using Chrome DevTools efficiently.",
  },
  {
    id: "free-photo-resources",
    name: "5 Free Photo Sites You Need - All in One Place",
    category: "tools",
    color: "skill-tools",
    videoUrl: "https://youtu.be/f_Q20Yt2IXE",
    videoId: "f_Q20Yt2IXE",
    description:
      "Discover the top 5 free photo resources like Unsplash, Stocksnap, Pexels and more. Learn where to find high-quality images for your projects all in one place.",
  },
  {
    id: "frontend-roadmap-2025",
    name: "Frontend Roadmap 2025 በአማርኛ",
    category: "roadmap",
    color: "skill-roadmap",
    videoUrl: "https://www.youtube.com/watch?v=Icdh9VIGeWk",
    videoId: "Icdh9VIGeWk",
    description:
      "Explore the 2025 Frontend Developer Roadmap in Amharic — what to learn, in what order, and why it matters.",
  },
  {
    id: "vscode-shortcuts",
    name: "VS Code Shortcuts በቀላሉ",
    category: "tools",
    color: "skill-tools",
    videoUrl: "https://www.youtube.com/watch?v=-dugArwZQ6A&t=182s",
    videoId: "-dugArwZQ6A",
    description:
      "Boost your productivity with essential VS Code shortcuts and time-saving keyboard tips.",
  },
  {
    id: "vscode-extensions",
    name: "25 VS Code Extensions በቀላሉ",
    category: "tools",
    color: "skill-tools",
    videoUrl: "https://www.youtube.com/watch?v=x3lWZylSQZg&t=100s",
    videoId: "x3lWZylSQZg",
    description:
      "Discover 25 must-have VS Code extensions to make your development smoother and more efficient.",
  },
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
    id: "css-intro",
    name: "Introduction to CSS",
    category: "basics",
    color: "skill-basics",
    videoUrl: "https://youtu.be/6GbvzfjbKHw?si=x5ejYhj04fHHGtXq",
    videoId: "6GbvzfjbKHw",
    description:
      "Understand how to style web pages beautifully using Cascading Style Sheets (CSS) — colors, layouts, and more.",
  },
  {
    id: "backend-roadmap",
    name: "Backend Roadmap በ የ JS እውቀት ላይ",
    category: "roadmap",
    color: "skill-backend",
    videoUrl: "https://youtu.be/JwBoGhUWIuE?si=lD53VcOrQmCuJ_9Q",
    videoId: "JwBoGhUWIuE",
    description:
      "Dive deep into the backend roadmap for JavaScript developers — from Node.js to APIs and databases.",
  },
  {
    id: "command-line-intro",
    name: "Using Command Line on OS",
    category: "tools",
    color: "skill-tools",
    videoUrl: "https://youtu.be/tHtwC1Wo4tc?si=XU68OCoWXf9odRIC",
    videoId: "tHtwC1Wo4tc",
    description:
      "Master basic command-line skills — navigate, manage files, and automate tasks on any operating system.",
  },
];
