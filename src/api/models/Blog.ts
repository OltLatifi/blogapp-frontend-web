export interface Blog {
    title: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: Date;
    updatedAt: Date;
    tags?: string[];
    imageUrl?: string;
} 