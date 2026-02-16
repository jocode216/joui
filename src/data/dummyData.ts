export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "teacher" | "admin";
  avatar?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  teacherName: string;
  studentsCount: number;
  revenue: number;
  status: "active" | "draft";
}

export interface EnrollmentRequest {
  id: number;
  userName: string;
  userEmail: string;
  courseTitle: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface TeacherRequest {
  id: number;
  userName: string;
  userEmail: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
}

export const dummyUsers: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "user" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "user" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", role: "teacher" },
  { id: 4, name: "David Brown", email: "david@example.com", role: "user" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", role: "teacher" },
  { id: 6, name: "Frank Lee", email: "frank@example.com", role: "user" },
  { id: 7, name: "Grace Kim", email: "grace@example.com", role: "user" },
  { id: 8, name: "Henry Davis", email: "henry@example.com", role: "user" },
];

export const dummyCourses: Course[] = [
  { id: 1, title: "MERN Stack Hotel Management System", description: "Build a full-stack hotel management app with MongoDB, Express, React & Node.js", teacherName: "Carol Williams", studentsCount: 45, revenue: 2250, status: "active" },
  { id: 2, title: "ES6 JavaScript Fundamentals", description: "Master modern JavaScript features — arrow functions, destructuring, async/await and more", teacherName: "Carol Williams", studentsCount: 120, revenue: 0, status: "active" },
  { id: 3, title: "React.js Complete Guide", description: "Learn React from scratch — components, hooks, routing, state management", teacherName: "Eva Martinez", studentsCount: 87, revenue: 4350, status: "active" },
  { id: 4, title: "Node.js & Express API Development", description: "Build RESTful APIs with Node.js and Express, including authentication and database integration", teacherName: "Eva Martinez", studentsCount: 63, revenue: 3150, status: "active" },
  { id: 5, title: "MySQL Database Mastery", description: "Learn relational database design, SQL queries, joins, indexing and optimization", teacherName: "Carol Williams", studentsCount: 34, revenue: 1700, status: "active" },
];

export const dummyEnrollmentRequests: EnrollmentRequest[] = [
  { id: 1, userName: "Alice Johnson", userEmail: "alice@example.com", courseTitle: "MERN Stack Hotel Management System", requestedAt: "2024-01-15", status: "pending" },
  { id: 2, userName: "Bob Smith", userEmail: "bob@example.com", courseTitle: "React.js Complete Guide", requestedAt: "2024-01-14", status: "pending" },
  { id: 3, userName: "David Brown", userEmail: "david@example.com", courseTitle: "Node.js & Express API Development", requestedAt: "2024-01-13", status: "pending" },
  { id: 4, userName: "Frank Lee", userEmail: "frank@example.com", courseTitle: "ES6 JavaScript Fundamentals", requestedAt: "2024-01-12", status: "pending" },
];

export const dummyTeacherRequests: TeacherRequest[] = [
  { id: 1, userName: "Henry Davis", userEmail: "henry@example.com", requestedAt: "2024-01-10", status: "pending" },
  { id: 2, userName: "Grace Kim", userEmail: "grace@example.com", requestedAt: "2024-01-09", status: "pending" },
];

export const userEnrolledCourses = [dummyCourses[1], dummyCourses[2]];
