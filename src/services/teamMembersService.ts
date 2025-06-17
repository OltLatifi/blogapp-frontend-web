import { TeamMember } from "@/api/models/TeamMember";
import api from "./api";
import axios from "axios";

const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : "";

export const teamMembersService = {
  getAll: async (): Promise<TeamMember[]> => {
    try {
      const { data } = await axios.get<TeamMember[]>(
        `${baseUrl}/api/teamMembers`
      );
      return data;
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      return [];
    }
  },
  getById: async (id: string): Promise<TeamMember> => {
    const { data } = await api.get<TeamMember>(`/teamMembers/${id}`);
    return data;
  },
  create: async (teamMemberData: TeamMember): Promise<TeamMember> => {
    const { data } = await api.post<TeamMember>(
      "/teamMembers/create",
      teamMemberData
    );
    return data;
  },
  update: async (
    id: string,
    teamMemberData: Partial<TeamMember>
  ): Promise<TeamMember> => {
    const { data } = await api.put<TeamMember>(
      `/teamMembers/${id}`,
      teamMemberData
    );
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/teamMembers/${id}`);
  },
};
