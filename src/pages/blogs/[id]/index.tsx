import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { blogService } from "@/services/blogService";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CommentSection } from "@/components/comments/CommentSection";

export default function BlogPostPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { id } = router.query;

    const { data: blog, isLoading } = useQuery({
        queryKey: ["blog", id],
        queryFn: () => blogService.getById(id as string),
        enabled: !!id,
    });

    const deleteBlogMutation = useMutation({
        mutationFn: () => blogService.delete(id as string),
        onSuccess: () => {
            toast.success("Blog deleted successfully");
            router.push("/");
        },
        onError: (error) => {
            toast.error("Failed to delete blog");
            console.error("Error deleting blog:", error);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!blog) {
        return <div>Blog not found</div>;
    }

    const isAuthor = session && session?.user?.email === blog.authorEmail;

    return (
        <div className="container mx-auto px-4 py-8">
            <article className="max-w-4xl mx-auto">
                {blog.imageUrl && (
                    <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={blog.imageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
                
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
                            <div className="text-gray-500">
                                By {blog.authorName ?? "Anonymous"} • {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                            </div>
                        </div>
                        {isAuthor && (
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => router.push(`/blogs/${id}/edit`)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this blog?")) {
                                            deleteBlogMutation.mutate();
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="prose max-w-none">
                                {blog.content.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Comments</h2>
                        <CommentSection blogId={blog._id} />
                    </div>
                </div>
            </article>
        </div>
    );
} 