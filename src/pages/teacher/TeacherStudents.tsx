import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { dummyCourses } from "@/data/dummyData";

const students = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", enrolledAt: "2024-01-10" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", enrolledAt: "2024-01-12" },
  { id: 3, name: "David Brown", email: "david@example.com", enrolledAt: "2024-01-14" },
  { id: 4, name: "Frank Lee", email: "frank@example.com", enrolledAt: "2024-01-15" },
  { id: 5, name: "Grace Kim", email: "grace@example.com", enrolledAt: "2024-01-16" },
];

export default function TeacherStudents() {
  const teacherCourses = dummyCourses.filter((c) => c.teacherName === "Carol Williams");
  const [selectedCourse, setSelectedCourse] = useState(teacherCourses[0]?.title || "");

  return (
    <DashboardLayout>
      <h1 className="page-header">Students</h1>

      {/* Course filter */}
      <div className="mb-6">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {teacherCourses.map((c) => (
            <option key={c.id} value={c.title}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Students table */}
      <div className="dash-card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td className="font-medium text-foreground">{s.name}</td>
                <td className="text-muted-foreground">{s.email}</td>
                <td className="text-muted-foreground">{s.enrolledAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
