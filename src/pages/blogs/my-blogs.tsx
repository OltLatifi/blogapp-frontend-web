import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService, Blog } from "@/services/blogService";

export default function MyBlogs() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const queryClient = useQueryClient();
    const [error, setError] = useState("");

    const { data: blogs, isLoading } = useQuery<Blog[]>({
        queryKey: ["my-blogs"],
        queryFn: () => blogService.getUserBlogs(),
        enabled: !!session?.user,
    });

    const deleteBlogMutation = useMutation({
        mutationFn: (blogId: string) => blogService.delete(blogId),
        onSuccess: () => {
            toast.success("Blog deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : "Failed to delete blog";
            toast.error(errorMessage);
            setError(errorMessage);
        },
    });

    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!session) {
        router.push("/auth/login");
        return null;
    }

    const handleCreateClick = () => {
        router.push("/blogs/create");
    };

    const handleEditClick = (blogId: string) => {
        router.push(`/blogs/${blogId}/edit`);
    };

    const handleDeleteClick = (blogId: string) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            deleteBlogMutation.mutate(blogId);
        }
    };

    const handleViewClick = (blogId: string) => {
        router.push(`/blogs/${blogId}`);
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Blogs</h1>
                <Button onClick={handleCreateClick}>
                    Create New Blog
                </Button>
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 mb-4 rounded">
                    {error}
                </div>
            )}

            <Card className="pb-0">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4">Title</th>
                                    <th className="text-left p-4">Created</th>
                                    <th className="text-left p-4">Tags</th>
                                    <th className="text-right p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs?.map((blog) => (
                                    <tr key={blog._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium">{blog.title}</div>
                                            <div className="text-sm text-gray-500">
                                                {blog.content.substring(0, 100)}...
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                                        </td>
                                        <td className="p-4">
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {blog.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewClick(blog._id)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditClick(blog._id)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(blog._id)}
                                                    disabled={deleteBlogMutation.isPending}
                                                >
                                                    {deleteBlogMutation.isPending ? "Deleting..." : "Delete"}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {blogs?.length === 0 && !error && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You haven't created any blogs yet</p>
                    <Button onClick={handleCreateClick} className="mt-4">
                        Create Your First Blog
                    </Button>
                </div>
            )}
        </div>
    );
} 