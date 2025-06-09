import { createContact } from "@/api/services/Contact";
import { CreateContact } from "@/services/contactService";
import { NextApiRequest, NextApiResponse } from "next";

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

    const contactData: CreateContact = {
      name,
      email,
      subject,
      message,
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
