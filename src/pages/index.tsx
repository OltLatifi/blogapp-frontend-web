import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Hero from "@/components/home/hero";

interface Blog {
    _id: string;
    title: string;
    content: string;
    author?: {
        name?: string;
        email?: string;
    };
    createdAt: string;
}

export default function HomePage() {
    const { data: session } = useSession();
    const router = useRouter();

    const { data: blogs, isLoading } = useQuery<Blog[]>({
        queryKey: ["blogs"],
        queryFn: async () => {
            const response = await fetch("/api/blogs");
            if (!response.ok) {
                throw new Error("Failed to fetch blogs");
            }
            return response.json();
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Hero />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                {session && (
                    <Button onClick={() => router.push("/blogs/new")}>
                        Create New Post
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {blogs?.map((blog) => (
                    <Card key={blog._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl">{blog.title}</CardTitle>
                            <div className="text-sm text-gray-500">
                                By {blog.author?.name || "Anonymous"} • {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 line-clamp-3">{blog.content}</p>
                            <Button
                                variant="link"
                                className="mt-4 p-0"
                                onClick={() => router.push(`/blogs/${blog._id}`)}
                            >
                                Read more
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}