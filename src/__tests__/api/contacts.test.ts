import { createMocks } from "node-mocks-http";
import contactHandler from "@/pages/api/contact";
import createHandler from "@/pages/api/contact/create";
import getMongoClient from "@/lib/mongodb";

describe("Contact API", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe("GET /api/contact", () => {
    it("returns contacts successfully", async () => {
      const mockDate = new Date().toISOString();
      const mockContacts = [
        {
          _id: "60d21b4667d0d8992e610c85",
          name: "John Doe",
          email: "john@example.com",
          subject: "Question about services",
          message: "I would like to know more about your services.",
          read: false,
          createdAt: mockDate,
          updatedAt: mockDate,
        },
      ];

      const mockCollection = {
        find: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue(mockContacts),
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

      await contactHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockContacts);
      expect(mockDb.collection).toHaveBeenCalledWith("contacts");
    });

    it("returns 405 for non-GET requests", async () => {
      const { req, res } = createMocks({
        method: "POST",
      });

      await contactHandler(req, res);

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

      await contactHandler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Failed to fetch contacts",
      });
    });
  });

  describe("POST /api/contact/create", () => {
    it("creates a contact successfully", async () => {
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

      const contactData = {
        name: "Jane Smith",
        email: "jane@example.com",
        subject: "Website Feedback",
        message: "I love your website design!",
      };

      const { req, res } = createMocks({
        method: "POST",
        body: contactData,
      });

      await createHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Contact sent successfully",
        contactId: mockObjectId,
      });

      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
          read: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
    });

    it("returns 400 when required fields are missing", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Jane Smith",
          email: "jane@example.com",
          // missing subject and message
        },
      });

      await createHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: "All fields are required",
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

    it("returns 500 when an error occurs", async () => {
      (getMongoClient as jest.Mock).mockRejectedValue(
        new Error("Database connection error")
      );

      const contactData = {
        name: "Jane Smith",
        email: "jane@example.com",
        subject: "Website Feedback",
        message: "I love your website design!",
      };

      const { req, res } = createMocks({
        method: "POST",
        body: contactData,
      });

      await createHandler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Error creating contact",
      });
    });
  });
});
