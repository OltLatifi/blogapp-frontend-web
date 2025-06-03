import clientPromise from "@/lib/mongodb";
import { Comment } from "@/api/models/Comment";
import { ObjectId } from "mongodb";

interface CommentWithReplies extends Comment {
    _id: ObjectId;
    replies: CommentWithReplies[];
    isEdited: boolean;
}

export async function createComment(data: Comment) {
    const client = await clientPromise();
    const db = client.db("myapp");
    const result = await db.collection("comments").insertOne({
        ...data,
        parentId: data.parentId ? String(data.parentId) : undefined,
        isEdited: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result;
}

export async function getCommentsByBlogId(blogId: string) {
    const client = await clientPromise();
    const db = client.db("myapp");

    const allComments = await db.collection("comments")
        .find({ blogId })
        .sort({ createdAt: 1 })
        .toArray();

    const commentMap: Record<string, CommentWithReplies> = {};
    allComments.forEach(comment => {
        comment.replies = [];
        commentMap[comment._id.toString()] = comment as CommentWithReplies;
    });

    const rootComments: CommentWithReplies[] = [];
    allComments.forEach(comment => {
        if (comment.parentId) {
            if (commentMap[comment.parentId]) {
                commentMap[comment.parentId].replies.push(comment as CommentWithReplies);
            }
        } else {
            rootComments.push(comment as CommentWithReplies);
        }
    });

    return rootComments;
}

export async function updateComment(commentId: string, content: string) {
    const client = await clientPromise();
    const db = client.db("myapp");
    const result = await db.collection("comments").updateOne(
        { _id: new ObjectId(commentId) },
        { 
            $set: { 
                content,
                isEdited: true,
                updatedAt: new Date()
            }
        }
    );
    return result;
}

export async function deleteComment(commentId: string) {
    const client = await clientPromise();
    const db = client.db("myapp");
    
    async function deleteReplies(parentId: string) {
        const replies = await db.collection("comments").find({ parentId }).toArray();
        for (const reply of replies) {
            await deleteReplies(reply._id.toString());
            await db.collection("comments").deleteOne({ _id: reply._id });
        }
    }

    await deleteReplies(commentId);
    const result = await db.collection("comments").deleteOne({
        _id: new ObjectId(commentId),
    });
    return result;
} 