import PublicHeader from "@/components/layout/PublicHeader";
import CourseCard from "@/components/CourseCard";
import { dummyCourses } from "@/data/dummyData";

export default function CoursesBrowser() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="page-header">Browse Courses</h1>
        <p className="text-muted-foreground mb-8 -mt-4">
          Explore all available courses and request enrollment
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dummyCourses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              teacherName={course.teacherName}
              showEnroll
            />
          ))}
        </div>
      </div>
    </div>
  );
}
