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
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEnrollmentRequests from "./pages/admin/AdminEnrollmentRequests";
import AdminTeacherRequests from "./pages/admin/AdminTeacherRequests";
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
            <Route path="/achievement" element={<Jocode />} />

            <Route path="/courses" element={<CoursesBrowser />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/students" element={<TeacherStudents />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route
              path="/admin/requests"
              element={<AdminEnrollmentRequests />}
            />
            <Route path="/admin/teachers" element={<AdminTeacherRequests />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
