import { useState } from "react";

interface CourseCardProps {
  id?: number | string;
  title: string;
  description: string;
  imageUrl?: string;
  teacherName?: string;
  progress?: number;
  showEnroll?: boolean;
  showGoToCourse?: boolean;
  onGoToCourse?: () => void;
}

export default function CourseCard({
  id,
  title,
  description,
  imageUrl,
  teacherName,
  progress,
  showEnroll,
  showGoToCourse,
  onGoToCourse,
}: CourseCardProps) {
  const [enrollStatus, setEnrollStatus] = useState<"idle" | "pending">("idle");

  return (
    <div className="dash-card flex flex-col justify-between gap-4 overflow-hidden p-0 group">
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden border-b border-border bg-muted">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
      )}
      <div className="p-4 flex-1">
        <h3 className="text-base font-semibold text-foreground mb-1 truncate">{title}</h3>
        {teacherName && (
          <p className="text-xs text-muted-foreground mb-2">by {teacherName}</p>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
        
        {progress !== undefined && progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-muted-foreground font-medium">Progress</span>
              <span className="text-primary font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 pt-0">
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
