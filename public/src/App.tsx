import Header from "./component/header/Header";
import Footer from "./component/footer/Footer";
import { Routes, Route } from "react-router-dom";
import Blog from "./component/blog/Blog";
import Sample from "./component/blog/Sample";
import Register from "./component/register/Register";
import Login from "./component/login/Login";
import CoursesShowcase from "./Enrollement/CoursesShowcase";
import Aauthenthicatiions from "./component/auth/Aauthenthicatiions";
import Fourfour from "./Fourfour";
import Wait from "./wait/Wait";
import Docs from "./component/mern/Docs";
import Htmlcourse from "./component/html/Htmlcourse";
import Protected from "./Protected";
import Authsaprove from "./component/blog/google/Authsaprove";
import Resourcedoc from "./component/resourse/resource/Resourcedoc";
import Contact from "./Enrollement/contact/Contact";
import Hero from "./component/hero/Hero";
import Roadmap from "./component/roadmap/Roadmap";
import About from "./component/about/About";
import Jocode from "./component/jocodes/Jocode";
import Frontend from "./Enrollement/Frontend";

// Admin course management pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AddAdminCourse from "./pages/admin/AddAdminCourse";
import EditAdminCourse from "./pages/admin/EditAdminCourse";
import AdminEnrollments from "./pages/admin/AdminEnrollments";

// Teacher course management pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import AddTeacherCourse from "./pages/teacher/AddTeacherCourse";
import EditTeacherCourse from "./pages/teacher/EditTeacherCourse";
import TeacherEnrollments from "./pages/teacher/TeacherEnrollments";


function App() {

  return (
    <div>

      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
            <Hero />
              <CoursesShowcase />
              <h1 style={{ textAlign: "center", color: "gray" }}>
                Welcome To Jocode
              </h1>
              <Sample />
              <Contact />
            </>
          }
        />
        <Route
          path="/mern"
          element={
            <Protected>
              <Docs />
            </Protected>
          }
        />
        <Route
          path="/maths"
          element={
            <Protected>
              <Authsaprove />
            </Protected>
          }
        />
        <Route path="/html" element={<Htmlcourse />} />
        <Route
          path="/waittoaprove"
          element={
            <>
              <Wait />
            </>
          }
        />
        <Route
          path="/tutorial"
          element={
            <>
              <Blog />
            </>
          }
        />
        <Route
          path="/resource"
          element={
            <>
              <Resourcedoc />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Register />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route path="/detail" element={<Aauthenthicatiions />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/about" element={<About />} />
        <Route path="/achievements" element={<Jocode />} />
        

        <Route path="/frontend" element={<Frontend />} />
        <Route
          path="/courses"
          element={
            <>
              <CoursesShowcase />
            </>
          }
        />

        {/* Admin course management routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/courses/add" element={<AddAdminCourse />} />
        <Route path="/admin/courses/:id/edit" element={<EditAdminCourse />} />
        <Route path="/admin/enrollments" element={<AdminEnrollments />} />

        {/* Teacher course management routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/courses" element={<TeacherCourses />} />
        <Route path="/teacher/courses/add" element={<AddTeacherCourse />} />
        <Route path="/teacher/courses/:id/edit" element={<EditTeacherCourse />} />
        <Route path="/teacher/enrollments" element={<TeacherEnrollments />} />

        <Route path="*" element={<Fourfour />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
