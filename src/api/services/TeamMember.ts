import getMongoClient from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { TeamMember } from "@/api/models/TeamMember";
import { CreateTeamMember } from "@/pages/api/teamMembers/create";

export async function createTeamMember(data: CreateTeamMember) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const result = await db.collection("teamMembers").insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result;
}

export async function getTeamMembers() {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const teamMembers = await db
    .collection("teamMembers")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return teamMembers;
}

export async function getTeamMemberById(id: string) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const teamMember = await db
    .collection("teamMembers")
    .findOne({ _id: new ObjectId(id) });
  return teamMember;
}

export async function deleteTeamMember(id: string) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  await db.collection("teamMembers").deleteOne({ _id: new ObjectId(id) });
}

export async function updateTeamMember(id: string, data: Partial<TeamMember>) {
  const client = await getMongoClient();
  const db = client.db("myapp");
  const result = await db.collection("teamMembers").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    }
  );
  return result;
}
