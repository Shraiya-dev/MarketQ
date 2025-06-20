
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquareWarning } from "lucide-react";

interface FeedbackDialogProps {
  feedbackNotes: string;
  trigger: React.ReactNode; 
}

export function FeedbackDialog({ feedbackNotes, trigger }: FeedbackDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquareWarning className="mr-2 h-5 w-5 text-orange-500" />
            Reviewer Feedback
          </DialogTitle>
          <DialogDescription>
            The following feedback was provided for this post. Please review and make necessary updates.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-foreground whitespace-pre-wrap bg-muted p-3 rounded-md border">
            {feedbackNotes}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
