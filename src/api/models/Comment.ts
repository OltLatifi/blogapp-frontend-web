export interface Comment {
    content: string;
    authorId: string;
    authorName: string;
    blogId: string;
    createdAt: Date;
    updatedAt: Date;
    parentId?: string;
} 