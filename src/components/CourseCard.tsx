import { useState } from "react";

interface CourseCardProps {
  title: string;
  description: string;
  teacherName?: string;
  showEnroll?: boolean;
  showGoToCourse?: boolean;
  onGoToCourse?: () => void;
}

export default function CourseCard({
  title,
  description,
  teacherName,
  showEnroll,
  showGoToCourse,
  onGoToCourse,
}: CourseCardProps) {
  const [enrollStatus, setEnrollStatus] = useState<"idle" | "pending">("idle");

  return (
    <div className="dash-card flex flex-col justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
        {teacherName && (
          <p className="text-xs text-muted-foreground mb-2">by {teacherName}</p>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div>
        {showEnroll && (
          <button
            onClick={() => setEnrollStatus("pending")}
            disabled={enrollStatus === "pending"}
            className={
              enrollStatus === "pending"
                ? "badge-pending cursor-default text-sm px-4 py-2"
                : "btn-primary"
            }
          >
            {enrollStatus === "pending" ? "Pending Approval" : "Request Enrollment"}
          </button>
        )}
        {showGoToCourse && (
          <button onClick={onGoToCourse} className="btn-primary">
            Go to Course
          </button>
        )}
      </div>
    </div>
  );
}
