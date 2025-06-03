import getMongoClient from "@/lib/mongodb";
import { Contact } from "../models/Contact";
import { ObjectId } from "mongodb";

export async function createContact(contact: Contact) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const result = await db.collection("contacts").insertOne({
    ...contact,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}

export async function getContacts() {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const contacts = await db
    .collection("contacts")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return contacts;
}
export async function getContactById(id: string) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const contact = await db
    .collection("contacts")
    .findOne({ _id: new ObjectId(id) });
  return contact;
}
export async function deleteContact(id: string) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  await db.collection("contacts").deleteOne({ _id: new ObjectId(id) });
  return { success: true };
}
