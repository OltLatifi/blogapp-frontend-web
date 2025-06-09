import getMongoClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { CreateContact } from "@/services/contactService";

export async function createContact(contact: CreateContact) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const result = await db.collection("contacts").insertOne({
    ...contact,
    read: false, // Default to false if not provided
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

export async function updateContact(
  id: string,
  contact: Partial<CreateContact>
) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const result = await db
    .collection("contacts")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...contact, updatedAt: new Date() } }
    );
  return result;
}
