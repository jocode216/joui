import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "AWAITING_PAYMENT" | "PAID" | "CANCELLED" | string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "AWAITING_PAYMENT":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "PAID":
        return "bg-green-100 text-green-800 border border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "AWAITING_PAYMENT":
        return "Awaiting Payment";
      case "PAID":
        return "Paid";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        getStatusClasses(status),
      )}
    >
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
