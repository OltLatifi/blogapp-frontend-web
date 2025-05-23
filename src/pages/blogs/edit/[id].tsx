import { useRouter } from "next/router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface Blog {
    _id: string;
    title: string;
    content: string;
}

export default function EditBlogPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { id } = router.query;

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        router.push("/auth/login");
        return null;
    }

    if (!id || typeof id !== "string") {
        return <div>Invalid blog ID</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
            <EditBlogForm blogId={id} />
        </div>
    );
}

function EditBlogForm({ blogId }: { blogId: string }) {
    const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const { data: blog, isLoading } = useQuery({
        queryKey: ["blog", blogId],
        queryFn: async () => {
            const response = await fetch(`/api/blogs/${blogId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch blog");
            }
            const data = await response.json();
            form.reset({
                title: data.title,
                content: data.content,
            });
            return data;
        },
    });

    const updateBlogMutation = useMutation({
        mutationFn: async (values: FormValues) => {
            const response = await fetch(`/api/blogs/${blogId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Failed to update blog post");
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success("Blog updated successfully");
            router.push(`/blogs/${blogId}`);
        },
        onError: (error) => {
            toast.error("Failed to update blog post");
            console.error("Error updating blog:", error);
        },
    });

    async function onSubmit(values: FormValues) {
        updateBlogMutation.mutate(values);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!blog) {
        return <div>Blog not found</div>;
    }

    return (
        <Card>
            <CardHeader>
                <h2 className="text-2xl font-semibold">Edit Blog</h2>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter blog title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your blog content"
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={updateBlogMutation.isPending}
                            >
                                {updateBlogMutation.isPending ? "Updating..." : "Update Blog"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
} 