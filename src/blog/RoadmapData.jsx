import { 
    FaComputer, 
    FaHtml5, 
    FaJs, 
    FaGitAlt, 
    FaReact, 
    FaNodeJs, 
    FaDatabase 
  } from 'react-icons/fa6';
  import { FaTools } from 'react-icons/fa';
  import { SiExpress } from 'react-icons/si';
  import { IconType } from 'react-icons';
  
  export interface Skill {
    id: string;
    name: string;
    category: 'basics' | 'tools' | 'frontend' | 'backend' | 'database';
    icon: IconType;
    color: string;
    videoUrl: string;
    videoId: string;
    docs: { name: string; url: string }[];
    description: string;
  }
  
  export const roadmapSkills: Skill[] = [
    {
      id: 'computer-basics',
      name: 'Basic Computer Skills',
      category: 'basics',
      icon: FaComputer,
      color: 'skill-basics',
      videoUrl: 'https://youtu.be/y2kg3MOk1sY?si=si0H4M7FYMqrwpVm',
      videoId: 'y2kg3MOk1sY',
      docs: [],
      description: 'Essential computer fundamentals every developer needs'
    },
    {
      id: 'dev-tools',
      name: 'Developer Tools',
      category: 'tools',
      icon: FaTools,
      color: 'skill-tools',
      videoUrl: 'https://youtu.be/x4q86IjJFag?si=Vjz7ZB_fZpUT6w0c',
      videoId: 'x4q86IjJFag',
      docs: [],
      description: 'VS Code, Chrome DevTools, and essential development setup'
    },
    {
      id: 'html-css',
      name: 'HTML & CSS',
      category: 'frontend',
      icon: FaHtml5,
      color: 'skill-frontend',
      videoUrl: 'https://youtu.be/G3e-cpL7ofc?si=rElI5d-GHsi5_6bB',
      videoId: 'G3e-cpL7ofc',
      docs: [
        { name: 'W3Schools HTML', url: 'https://www.w3schools.com/html/' },
        { name: 'W3Schools CSS', url: 'https://www.w3schools.com/css/' }
      ],
      description: 'Structure and style web pages with HTML and CSS'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'frontend',
      icon: FaJs,
      color: 'skill-frontend',
      videoUrl: 'https://youtu.be/EerdGm-ehJQ?si=XHKVGX4_pLZ0Voyb',
      videoId: 'EerdGm-ehJQ',
      docs: [
        { name: 'W3Schools JavaScript', url: 'https://www.w3schools.com/js/' }
      ],
      description: 'Programming language that powers interactive web experiences'
    },
    {
      id: 'git-github',
      name: 'Git & GitHub',
      category: 'tools',
      icon: FaGitAlt,
      color: 'skill-tools',
      videoUrl: 'https://youtu.be/b_glcE0SOoE?si=Tja0p8BVV-dV4xJT',
      videoId: 'b_glcE0SOoE',
      docs: [
        { name: 'Git Documentation', url: 'https://git-scm.com/doc' },
        { name: 'GitHub Docs', url: 'https://docs.github.com/' }
      ],
      description: 'Version control and collaborative development platform'
    },
    {
      id: 'react',
      name: 'React',
      category: 'frontend',
      icon: FaReact,
      color: 'skill-frontend',
      videoUrl: 'https://youtu.be/CgkZ7MvWUAA?si=v0slhYVHjlUO4_yg',
      videoId: 'CgkZ7MvWUAA',
      docs: [
        { name: 'React Documentation', url: 'https://reactjs.dev/' }
      ],
      description: 'Modern JavaScript library for building user interfaces'
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'backend',
      icon: FaNodeJs,
      color: 'skill-backend',
      videoUrl: 'https://youtu.be/yGl3f0xTl_0?si=jKR4q_dnVta5J11R',
      videoId: 'yGl3f0xTl_0',
      docs: [
        { name: 'Node.js Documentation', url: 'https://nodejs.org/en/docs' }
      ],
      description: 'JavaScript runtime for server-side development'
    },
    {
      id: 'express',
      name: 'Express',
      category: 'backend',
      icon: SiExpress,
      color: 'skill-backend',
      videoUrl: 'https://youtu.be/fBzm9zja2Y8?si=BnzC-AI6foRHhkn5',
      videoId: 'fBzm9zja2Y8',
      docs: [
        { name: 'Express Documentation', url: 'https://expressjs.com/' }
      ],
      description: 'Fast, minimalist web framework for Node.js'
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      category: 'database',
      icon: FaDatabase,
      color: 'skill-database',
      videoUrl: 'https://youtu.be/fBzm9zja2Y8?si=BnzC-AI6foRHhkn5', // Same as Express since it's covered there
      videoId: 'fBzm9zja2Y8',
      docs: [
        { name: 'MongoDB Documentation', url: 'https://www.mongodb.com/docs/' }
      ],
      description: 'NoSQL database for modern applications'
    }
  ];
  
  export const certificationPlatforms = [
    { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/' },
    { name: 'CS50 by Harvard', url: 'https://cs50.harvard.edu/' },
    { name: 'Coursera', url: 'https://www.coursera.org/' },
    { name: 'Google Certificates', url: 'https://grow.google/certificates/' },
    { name: 'Meta Front-End Developer', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
    { name: 'SoloLearn', url: 'https://www.sololearn.com/' },
    { name: 'Programming Hub', url: 'https://programminghub.io/' }
  ];
  
  export const telegramChannels = [
    { name: '@jocode216', url: 'https://t.me/jocode216', description: 'Amazing development notes and tutorials' },
    { name: 'Web Dev Trainings', url: 'https://t.me/webdev_trainings', description: 'Comprehensive web development training materials' },
    { name: '@codehype', url: 'https://t.me/codehype', description: 'Latest coding trends and resources' }
  ];