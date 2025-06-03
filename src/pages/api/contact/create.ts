import { NextApiRequest, NextApiResponse } from "next";
import { Contact } from "@/api/models/Contact";
import { createContact } from "@/api/services/Contact";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const contactData: Contact = {
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await createContact(contactData);
    res.status(201).json({
      message: "Contact sent successfully",
      contactId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ error: "Error creating contact" });
  }
}
