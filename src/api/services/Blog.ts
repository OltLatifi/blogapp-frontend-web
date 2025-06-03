import getMongoClient from "@/lib/mongodb";
import { Blog } from "@/api/models/Blog";
import { ObjectId } from "mongodb";

export async function createBlog(data: Blog) {
    const client = await getMongoClient();
    const db = client.db("myapp");
    const result = await db.collection("blogs").insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return result;
}

export async function getBlogs() {
    const client = await getMongoClient();
    const db = client.db("myapp");
    const blogs = await db.collection("blogs")
        .find()
        .sort({ createdAt: -1 })
        .toArray();
    return blogs;
}

export async function getBlogById(id: string) {
    const client = await getMongoClient();
    const db = client.db("myapp");
    const blog = await db.collection("blogs")
        .findOne({ _id: new ObjectId(id) });
    return blog;
}

export async function getUserBlogs(userEmail: string) {
    const client = await getMongoClient();
    const db = client.db("myapp");
    const blogs = await db.collection("blogs")
        .find({ authorId: userEmail })
        .sort({ createdAt: -1 })
        .toArray();
    return blogs;
}

export async function deleteBlog(id: string, authorId: string) {
    const client = await getMongoClient();
    const db = client.db("myapp");

    const comments = await db.collection("comments").find({ blogId: id }).toArray();

    if (comments.length > 0) {
        await db.collection("comments").deleteMany({ blogId: id });
    }

    await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
}