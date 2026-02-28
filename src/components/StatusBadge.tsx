interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  APPROVED: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  REJECTED: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  ARCHIVED: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  ACTIVE: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  ENROLLED: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  COMPLETED: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  CANCELLED: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const upperStatus = (status || "UNKNOWN").toUpperCase();
  const styles = statusStyles[upperStatus] || "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles} ${className}`}>
      {upperStatus}
    </span>
  );
}
