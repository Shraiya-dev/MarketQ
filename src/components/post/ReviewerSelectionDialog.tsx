
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sampleReviewers } from "@/lib/sample-data";
import { User, Users } from "lucide-react";
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface ReviewerSelectionDialogProps {
  onSelectReviewer: (reviewerId: string) => void;
  trigger: React.ReactNode; 
}

export function ReviewerSelectionDialog({ onSelectReviewer, trigger }: ReviewerSelectionDialogProps) {
  const [selectedReviewer, setSelectedReviewer] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (selectedReviewer) {
      onSelectReviewer(selectedReviewer);
    } else {
      toast({
        title: "No Reviewer Selected",
        description: "Please select a reviewer or team to submit the post to.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog onOpenChange={(open) => { if (!open) setSelectedReviewer(undefined); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Submit for Review
          </DialogTitle>
          <DialogDescription>
            Choose a reviewer or team to send this post to. They will be notified.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedReviewer} onValueChange={setSelectedReviewer}>
            <div className="space-y-2">
              {sampleReviewers.map((reviewer) => (
                <Label 
                  key={reviewer.id} 
                  htmlFor={reviewer.id}
                  className="flex items-center gap-3 p-3 rounded-md border has-[:checked]:bg-muted has-[:checked]:border-primary transition-all cursor-pointer"
                >
                  <RadioGroupItem value={reviewer.name} id={reviewer.id} />
                  <div className="flex-1">
                    <p className="font-semibold">{reviewer.name}</p>
                    <p className="text-sm text-muted-foreground">{reviewer.role}</p>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <DialogClose asChild>
             <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={!selectedReviewer}>
            Confirm & Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
