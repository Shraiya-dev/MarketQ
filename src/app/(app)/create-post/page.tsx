
import { PostForm } from "@/components/post/PostForm";
import { PageHeader } from "@/components/PageHeader";
import { PlusSquare } from "lucide-react";

export default function CreatePostPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Create New Social Post"
        description="Fill in the details below to craft your next engaging post."
        icon={PlusSquare}
      />
      <PostForm />
    </div>
  );
}
