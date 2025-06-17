import { createMocks } from "node-mocks-http";
import teamMembersHandler from "@/pages/api/teamMembers";
import getMongoClient from "@/lib/mongodb";

import { getServerSession } from "next-auth";
jest.mock("next-auth");
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));
jest.mock(
  "@/pages/api/auth/[...nextauth]",
  () => ({
    authOptions: {
      providers: [],
      callbacks: {},
    },
  }),
  { virtual: true }
);

import createHandler from "@/pages/api/teamMembers/create";

const mockGetServerSession = jest.mocked(getServerSession);

describe("TeamMembers API", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe("GET /api/teamMembers", () => {
    it("returns team members successfully", async () => {
      const mockDate = new Date().toISOString();
      const mockTeamMembers = [
        {
          _id: "60d21b4667d0d8992e610c85",
          name: "John Doe",
          role: "Developer",
          bio: "Experienced developer",
          skills: ["JavaScript", "React"],
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const mockCollection = {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue(mockTeamMembers),
          }),
        }),
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockCollection),
      };

      (getMongoClient as jest.Mock).mockResolvedValue({
        db: () => mockDb,
      });

      const { req, res } = createMocks({
        method: "GET",
      });

      await teamMembersHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockTeamMembers);
      expect(mockDb.collection).toHaveBeenCalledWith("teamMembers");
    });

    it("returns 405 for non-GET requests", async () => {
      const { req, res } = createMocks({
        method: "POST",
      });

      await teamMembersHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Method not allowed",
      });
    });

    it("returns 500 when an error occurs", async () => {
      (getMongoClient as jest.Mock).mockRejectedValue(
        new Error("Database connection error")
      );

      const { req, res } = createMocks({
        method: "GET",
      });

      await teamMembersHandler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Failed to fetch team members",
      });
    });
  });

  describe("POST /api/teamMembers/create", () => {
    it("creates a team member when authenticated", async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
        expires: new Date().toISOString(),
      });

      const mockObjectId = "60d21b4667d0d8992e610c85";
      const mockResult = {
        insertedId: mockObjectId,
      };

      const mockCollection = {
        insertOne: jest.fn().mockResolvedValue(mockResult),
      };

      const mockDb = {
        collection: jest.fn().mockReturnValue(mockCollection),
      };

      (getMongoClient as jest.Mock).mockResolvedValue({
        db: () => mockDb,
      });

      const teamMemberData = {
        name: "Jane Smith",
        role: "Designer",
        bio: "Creative designer with 5 years of experience",
        skills: ["UI/UX", "Figma", "Adobe XD"],
        contact: {
          email: "jane@example.com",
          linkedin: "linkedin.com/jane",
        },
      };

      const { req, res } = createMocks({
        method: "POST",
        body: teamMemberData,
      });

      await createHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Team member created successfully",
        teamMemberId: mockResult.insertedId,
      });

      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          name: teamMemberData.name,
          role: teamMemberData.role,
          bio: teamMemberData.bio,
          skills: teamMemberData.skills,
          contact: teamMemberData.contact,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
    });

    it("returns 401 when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Jane Smith",
          role: "Designer",
          bio: "Creative designer",
          skills: ["UI/UX"],
        },
      });

      await createHandler(req, res);

      expect(res._getStatusCode()).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({ error: "Unauthorized" });
    });

    it("returns 400 when required fields are missing", async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
        expires: new Date().toISOString(),
      });

      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Jane Smith",
          // missing role and bio
          skills: ["UI/UX"],
        },
      });

      await createHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Missing required fields",
      });
    });

    it("returns 405 for non-POST requests", async () => {
      const { req, res } = createMocks({
        method: "GET",
      });

      await createHandler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Method not allowed",
      });
    });
  });
});
