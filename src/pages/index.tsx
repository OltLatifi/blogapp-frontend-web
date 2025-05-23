import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Hero from "@/components/home/hero";
import { blogService } from "@/services/blogService";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
    const { data: session } = useSession();
    const router = useRouter();

    const { data: blogs, isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: blogService.getAll,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Hero />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {blogs?.map((blog) => (
                    <Card key={blog._id} className="hover:shadow-lg transition-shadow overflow-hidden pt-0">
                        {blog.imageUrl && (
                            <div className="relative w-full h-48">
                                <Image
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-xl">{blog.title}</CardTitle>
                            <div className="text-sm text-gray-500">
                                By {blog.authorName ?? "Anonymous"} • {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 line-clamp-3">{blog.content}</p>
                            <Link
                                href={`/blogs/${blog._id}`}
                                className="mt-4 p-0 hover:underline"
                            >
                                Read more
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}