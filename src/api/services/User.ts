import getMongoClient from "@/lib/mongodb";
import { User } from "@/api/models/User";
import { ObjectId } from "mongodb";

export async function createUser(data: User) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const result = await db.collection("users").insertOne({
    ...data,
    createdAt: new Date(),
  });
  return result;
}

export async function getUserById(id: string) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const result = await db
    .collection("users")
    .findOne({ _id: new ObjectId(id) });
  return result;
}

export async function getUser(email: string) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const result = await db.collection("users").findOne({ email });
  console.log("result", result);
  return result;
}
export async function getUsers() {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const result = await db
    .collection("users")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return result;
}
