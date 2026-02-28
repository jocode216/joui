import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CoursesBrowser from "./pages/CoursesBrowser";
import CourseDetails from "./pages/CourseDetails";
import CourseEnroll from "./pages/CourseEnroll";
import CourseLessons from "./pages/CourseLessons";
import CourseEdit from "./pages/CourseEdit";
import LessonDashboard from "./pages/less/LessonDashboard";
import Lesson from "./pages/less/Lesson";
import AddLesson from "./pages/less/Addlesson";
import EditLesson from "./pages/less/Editlesson";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import MyRequests from "./pages/MyRequests";
import Certificates from "./pages/Certificates";
import CertificateVerify from "./pages/CertificateVerify";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEnrollmentRequests from "./pages/admin/AdminEnrollmentRequests";
import AdminTeacherRequests from "./pages/admin/AdminTeacherRequests";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import NotFound from "./pages/NotFound";
import CoursesShowcase from "./Enrollement/CoursesShowcase";
import Blog from "./dataIhave/blog/Blog";
import Sample from "./dataIhave/blog/Sample";
import About from "./dataIhave/about/About";
import Resource from "./dataIhave/resourse/Resource";
import Roadmap from "./dataIhave/roadmap/Roadmap";
import Jocode from "./dataIhave/jocodes/Jocode";
import Footer from "./dataIhave/footer/Footer";
import Contact from "./Enrollement/contact/Contact";
import Details from "./Enrollement/details/Details";
import Htmlcourse from "./dataIhave/html/Htmlcourse";
import UsersDetail from "./pages/users/UsersDetail";
import AdminCourse from "./pages/admin/AdminCourse";
import AdminCategory from "./pages/admin/AdminCategory";
import Certificate from "./Enrollement/certify/Certificate";
import AdminAddCourse from "./pages/admin/AdminAddcourse";
import Validatecertificate from "./pages/certificate/Validatecertificate";
import Editcertificate from "./pages/certificate/Editcertificate";
import Getallcertificate from "./pages/certificate/Getallcertificate";
import Addcertificate from "./pages/certificate/Addcertificate";
import MyCertificates from "./pages/certificate/MyCertificates";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Landing />
                  <CoursesShowcase />
                  <Sample />
                  <Contact />
                  <Footer />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/tutorial" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/resource" element={<Resource />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/achievements" element={<Jocode />} />
            <Route path="/detail" element={<Details />} />
            <Route path="/html" element={<Htmlcourse />} />

            {/* Course routes */}
            <Route path="/courses" element={<CoursesBrowser />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/courses/:id/enroll" element={<CourseEnroll />} />
            <Route path="/courses/:id/lessons" element={<CourseLessons />} />
            <Route path="/courses/:id/edit" element={<CourseEdit />} />

            {/* Lesson routes */}
            <Route path="/teacher/lessons" element={<LessonDashboard />} />
            <Route path="/teacher/courses/:id/lessons" element={<CourseLessons />} />
            <Route path="/teacher/courses/:courseId/lessons/add" element={<AddLesson />} />
            <Route path="/teacher/courses/:courseId/lessons/:lessonId" element={<Lesson />} />
            <Route path="/teacher/courses/:courseId/lessons/:lessonId/edit" element={<EditLesson />} />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/certificates/verify/:id" element={<CertificateVerify />} />
            <Route path="/certificate" element={<Certificate />} />

            {/* Teacher routes */}
            <Route path="/students" element={<TeacherStudents />} />
            <Route path="/admin/addcourse" element={<AdminAddCourse />} />

            {/* Admin routes */}
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/users/:id" element={<UsersDetail />} />
            <Route path="/admin/courses" element={<AdminCourse />} />
            <Route path="/admin/categories" element={<AdminCategory />} />
            <Route path="/admin/requests" element={<AdminEnrollmentRequests />} />
            <Route path="/admin/teachers" element={<AdminTeacherRequests />} />
            <Route path="/admin/approvals" element={<AdminApprovals />} />
            <Route path="/admin/enrollments" element={<AdminEnrollments />} />

            {/* Admin Certificate routes - Order matters: more specific routes first */}
            <Route path="/admin/certificates/add" element={<Addcertificate />} />
            <Route path="/admin/certificates/edit/:certificateId" element={<Editcertificate />} />
            <Route path="/admin/certificates" element={<Getallcertificate />} />

            {/* Certificate validation routes */}
            <Route path="/validate-certificate" element={<Validatecertificate />} />
            <Route path="/my-certificates" element={<MyCertificates />} />
            
            {/* Public certificate verification by ID - e.g., /c/JOCD-XXXX-XXXX */}
            <Route path="/c/:certificateId" element={<Validatecertificate />} />

            {/* 404 route - always last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;