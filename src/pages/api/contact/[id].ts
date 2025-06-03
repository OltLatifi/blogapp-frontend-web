import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { deleteContact } from "@/api/services/Contact";

const getSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid contact ID" });
  }

  try {
    const client = await clientPromise();
    const db = client.db("myapp");

    switch (req.method) {
      case "GET":
        const contact = await db
          .collection("contacts")
          .findOne({ _id: new ObjectId(id) });

        if (!contact) {
          return res.status(404).json({ error: "Contact not found" });
        }

        return res.status(200).json(contact);
      case "DELETE":
        const deleteSession = await getSession(req, res);
        const contactToDelete = await db
          .collection("contacts")
          .findOne({ _id: new ObjectId(id) });

        if (!contactToDelete) {
          return res.status(404).json({ error: "Contact not found" });
        }

        if (
          contactToDelete.authorId !== deleteSession.user.email &&
          deleteSession.user.role !== "admin"
        ) {
          return res
            .status(403)
            .json({ error: "Unauthorized to delete this contact" });
        }

        await deleteContact(id);

        return res
          .status(200)
          .json({ message: "Contact deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Error handling contact request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
