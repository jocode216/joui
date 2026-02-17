import PublicHeader from "@/components/layout/PublicHeader";
import CourseCard from "@/components/CourseCard";
import { dummyCourses } from "@/data/dummyData";
import CoursesShowcase from "@/Enrollement/CoursesShowcase";

export default function CoursesBrowser() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <CoursesShowcase />
    </div>
  );
}
