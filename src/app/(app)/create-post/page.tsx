
import { PostForm } from "@/components/post/PostForm";
import { PageHeader } from "@/components/PageHeader";
import { PlusSquare } from "lucide-react";

export default function CreatePostPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Create New Post"
        description="Use the form below to generate and refine your social media content."
        icon={PlusSquare}
      />
      <PostForm />
    </div>
  );
}
