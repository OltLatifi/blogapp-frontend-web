import { Contact } from "@/api/models/Contact";
import api from "./api";

export interface CreateContact {
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
}

export const contactService = {
  getAll: async (): Promise<Contact[]> => {
    const { data } = await api.get<Contact[]>("/contact");
    return data;
  },
  getById: async (id: string): Promise<Contact> => {
    const { data } = await api.get<Contact>(`/contact/${id}`);
    return data;
  },
  create: async (contactData: CreateContact): Promise<Contact> => {
    const { data } = await api.post<Contact>("/contact/create", contactData);
    return data;
  },
  update: async (
    id: string,
    contactData: Partial<CreateContact>
  ): Promise<Contact> => {
    const { data } = await api.put<Contact>(`/contact/${id}`, contactData);
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contact/${id}`);
  },
};
