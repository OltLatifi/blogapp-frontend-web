import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService, Comment } from "@/services/commentService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Pencil, Trash2, X } from "lucide-react";

interface CommentSectionProps {
    blogId: string;
}

interface CommentFormProps {
    parentId?: string;
    onCancel?: () => void;
    initialContent?: string;
    onSubmit: (content: string) => void;
    isSubmitting: boolean;
    className?: string;
}

function CommentForm({ parentId, onCancel, initialContent = "", onSubmit, isSubmitting, className }: CommentFormProps) {
    const [content, setContent] = useState(initialContent);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content);
    };
    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className ?? ""}`}>
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={parentId ? "Write a reply..." : "Write a comment..."}
                className="min-h-[80px]"
            />
            <div className="flex justify-end space-x-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    Post
                </Button>
            </div>
        </form>
    );
}

function CommentItem({ comment, blogId, onEdit, onDelete, isReply = false }: {
    comment: Comment;
    blogId: string;
    onEdit: (comment: Comment) => void;
    onDelete: (commentId: string) => void;
    isReply?: boolean;
}) {
    const { data: session } = useSession();
    const isAuthor = session?.user?.email === comment.authorId;
    const [showReplies, setShowReplies] = useState(true);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const createReplyMutation = useMutation({
        mutationFn: (content: string) => commentService.create({ content, blogId, parentId: comment._id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
            setIsReplying(false);
            toast.success("Reply added successfully");
        },
        onError: () => {
            toast.error("Failed to add reply");
        }
    });

    const updateCommentMutation = useMutation({
        mutationFn: (content: string) => commentService.update(comment._id, { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
            setIsEditing(false);
            toast.success("Comment updated successfully");
        },
        onError: () => {
            toast.error("Failed to update comment");
        }
    });

    const handleReply = (content: string) => {
        createReplyMutation.mutate(content);
    };

    const handleEdit = (content: string) => {
        updateCommentMutation.mutate(content);
    };

    return (
        <div className={isReply ? "ml-8 border-l-2 border-gray-200 pl-4 bg-gray-50 space-y-2 p-4 pb-0" : ""}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <p className="font-semibold">
                            {comment.authorName}
                            {isReply && <span className="ml-2 text-xs text-blue-500">Reply</span>}
                        </p>
                        <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            {comment.isEdited && " (edited)"} {isReply && "Reply"}
                        </p>
                    </div>
                    {isAuthor && !isEditing && (
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => onDelete(comment._id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <CommentForm
                            initialContent={comment.content}
                            onSubmit={handleEdit}
                            isSubmitting={updateCommentMutation.isPending}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <>
                            <p className="whitespace-pre-wrap mb-4">{comment.content}</p>
                            <div className="flex items-center space-x-4">
                                {session && !isReply && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsReplying(!isReplying)}
                                        className="flex items-center"
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        {isReplying ? "Cancel Reply" : "Reply"}
                                    </Button>
                                )}
                                {!isReply && comment.replies && comment.replies.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowReplies(!showReplies)}
                                        className="flex items-center"
                                    >
                                        {showReplies ? (
                                            <>
                                                <X className="h-4 w-4 mr-2" />
                                                Hide Replies
                                            </>
                                        ) : (
                                            <>
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Show Replies ({comment.replies.length})
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
            {isReplying && !isReply && (
                <div className="ml-8 mt-2">
                    <CommentForm
                        parentId={comment._id}
                        onSubmit={handleReply}
                        isSubmitting={createReplyMutation.isPending}
                        onCancel={() => setIsReplying(false)}
                        className="my-4"
                    />
                </div>
            )}
            {showReplies && comment.replies && comment.replies.length > 0 && !isReply && (
                <div>
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            blogId={blogId}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function CommentSection({ blogId }: CommentSectionProps) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    const { data: comments, isLoading } = useQuery({
        queryKey: ["comments", blogId],
        queryFn: () => commentService.getByBlogId(blogId)
    });
    const createCommentMutation = useMutation({
        mutationFn: (content: string) => commentService.create({ content, blogId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
            toast.success("Comment added successfully");
        },
        onError: () => {
            toast.error("Failed to add comment");
        }
    });
    const updateCommentMutation = useMutation({
        mutationFn: (data: { commentId: string; content: string }) =>
            commentService.update(data.commentId, { content: data.content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
            setEditingComment(null);
            toast.success("Comment updated successfully");
        },
        onError: () => {
            toast.error("Failed to update comment");
        }
    });
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: string) => commentService.delete(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
            toast.success("Comment deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete comment");
        }
    });
    const handleSubmit = (content: string) => {
        if (editingComment) {
            updateCommentMutation.mutate({ commentId: editingComment._id, content });
        } else {
            createCommentMutation.mutate(content);
        }
    };
    const handleDelete = (commentId: string) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            deleteCommentMutation.mutate(commentId);
        }
    };
    if (isLoading) {
        return <div>Loading comments...</div>;
    }
    return (
        <div className="space-y-6">
            {session && !editingComment && (
                <CommentForm
                    onSubmit={handleSubmit}
                    isSubmitting={createCommentMutation.isPending}
                />
            )}
            {editingComment && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Edit Comment</h3>
                    <CommentForm
                        initialContent={editingComment.content}
                        onSubmit={handleSubmit}
                        isSubmitting={updateCommentMutation.isPending}
                        onCancel={() => setEditingComment(null)}
                    />
                </div>
            )}
            <div className="space-y-6">
                {comments?.map((comment: Comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        blogId={blogId}
                        onEdit={setEditingComment}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
}