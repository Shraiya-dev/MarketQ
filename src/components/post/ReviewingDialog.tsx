
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserCheck } from "lucide-react"; // Or another suitable icon

interface ReviewingDialogProps {
  reviewedBy?: string;
  trigger: React.ReactNode; 
}

export function ReviewingDialog({ reviewedBy, trigger }: ReviewingDialogProps) {
  const reviewerDisplay = reviewedBy || "The team";

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserCheck className="mr-2 h-5 w-5 text-purple-500" />
            Post Under Review
          </DialogTitle>
          <DialogDescription>
            This post is currently being checked by our team.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground bg-muted p-3 rounded-md border">
            {reviewerDisplay} is reviewing this post. You'll be notified once the review is complete or if there's any feedback.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
