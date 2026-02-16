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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<CoursesBrowser />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/students" element={<TeacherStudents />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/requests" element={<AdminEnrollmentRequests />} />
            <Route path="/admin/teachers" element={<AdminTeacherRequests />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
