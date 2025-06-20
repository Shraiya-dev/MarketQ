
import type { PostStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  FileEdit,
  Send,
  Clock,
  ThumbsUp,
  MessageSquareWarning,
  Rocket,
  AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FeedbackDialog } from "./FeedbackDialog";

interface StatusConfig {
  icon: LucideIcon;
  colorClass: string;
  label: string;
}

const statusMap: Record<PostStatus, StatusConfig> = {
  Draft: { icon: FileEdit, colorClass: "bg-yellow-500 hover:bg-yellow-600", label: "Draft" },
  Submitted: { icon: Send, colorClass: "bg-blue-500 hover:bg-blue-600", label: "Submitted" },
  "Under Review": { icon: Clock, colorClass: "bg-purple-500 hover:bg-purple-600", label: "Under Review" },
  Approved: { icon: ThumbsUp, colorClass: "bg-green-500 hover:bg-green-600", label: "Approved" },
  Feedback: { icon: MessageSquareWarning, colorClass: "bg-orange-500 hover:bg-orange-600", label: "Feedback" },
  "Ready to Publish": { icon: Rocket, colorClass: "bg-teal-500 hover:bg-teal-600", label: "Ready to Publish" },
};

interface StatusBadgeProps {
  status: PostStatus;
  feedbackNotes?: string;
}

export function StatusBadge({ status, feedbackNotes }: StatusBadgeProps) {
  const config = statusMap[status] || { icon: AlertCircle, colorClass: "bg-gray-500", label: "Unknown" };
  const Icon = config.icon;

  const badgeContent = (
    <Badge
      variant="default"
      className={cn(
        "flex items-center gap-1.5 capitalize text-xs px-2.5 py-1 text-white dark:text-gray-900",
        config.colorClass,
        status === "Feedback" && feedbackNotes ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );

  if (status === "Feedback" && feedbackNotes) {
    return (
      <FeedbackDialog feedbackNotes={feedbackNotes} trigger={badgeContent} />
    );
  }

  return badgeContent;
}
