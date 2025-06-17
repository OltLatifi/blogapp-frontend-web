import { useRouter } from "next/router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { blogService } from "@/services/blogService";
import { useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
    queryFn: () => blogService.getById(blogId),
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title,
        content: blog.content,
        imageUrl: blog.imageUrl || "",
      });
    }
  }, [blog, form]);

  const updateBlogMutation = useMutation({
    mutationFn: (values: FormValues) => blogService.update(blogId, values),
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
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <CldUploadWidget
                uploadPreset="blog_images"
                options={{
                  sources: ["local", "url"],
                  maxFiles: 1,
                  resourceType: "image",
                  showAdvancedOptions: false,
                  styles: {
                    palette: {
                      window: "#FFFFFF",
                      windowBorder: "#90A0B3",
                      tabIcon: "#0078FF",
                      menuIcons: "#5A616A",
                      textDark: "#000000",
                      textLight: "#FFFFFF",
                      link: "#0078FF",
                      action: "#FF620C",
                      inactiveTabIcon: "#0E2F5A",
                      error: "#F44235",
                      inProgress: "#0078FF",
                      complete: "#20B832",
                      sourceBg: "#E4EBF1",
                    },
                  },
                }}
                onSuccess={(result) => {
                  const info = result.info as { secure_url: string };
                  if (info?.secure_url) {
                    form.setValue("imageUrl", info.secure_url);
                    toast.success("Image uploaded successfully");
                  }
                }}
                onError={(error) => {
                  toast.error("Failed to upload image");
                  console.error("Upload error:", error);
                }}
              >
                {({ open }) => (
                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => open()}
                      className="w-full"
                    >
                      Upload Image
                    </Button>
                    {form.watch("imageUrl") && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <Image
                          src={form.watch("imageUrl") || ""}
                          alt="Blog cover"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => form.setValue("imageUrl", "")}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateBlogMutation.isPending}>
                {updateBlogMutation.isPending ? "Updating..." : "Update Blog"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
