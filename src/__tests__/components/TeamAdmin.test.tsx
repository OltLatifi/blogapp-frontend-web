import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Team from "@/pages/admin/team";
import { teamMembersService } from "@/services/teamMembersService";
import { toast } from "sonner";

// Mock the modules
jest.mock("@/services/teamMembersService");
jest.mock("sonner");
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Team Admin Page", () => {
  let queryClient: QueryClient;
  // Store the original window.confirm function
  const originalConfirm = window.confirm;
  beforeEach(() => {
    // Mock window.confirm to always return true
    window.confirm = jest.fn(() => true);
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore the original window.confirm
    window.confirm = originalConfirm;
  });

  it("renders loading state initially", () => {
    // Mock the teamMembersService.getAll to return a promise that never resolves
    jest
      .spyOn(teamMembersService, "getAll")
      .mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <Team />
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays team members when loaded", async () => {
    const mockTeamMembers = [
      {
        _id: "1",
        name: "John Doe",
        role: "Developer",
        bio: "Full stack developer",
        skills: ["React", "Node.js"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "2",
        name: "Jane Smith",
        role: "Designer",
        bio: "UI/UX designer",
        skills: ["Figma", "Adobe XD"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(teamMembersService, "getAll").mockResolvedValue(mockTeamMembers);

    render(
      <QueryClientProvider client={queryClient}>
        <Team />
      </QueryClientProvider>
    );

    // Wait for the team members to be displayed
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Developer")).toBeInTheDocument();
      expect(screen.getByText("Designer")).toBeInTheDocument();
    });
  });

  it("handles delete team member", async () => {
    const mockTeamMembers = [
      {
        _id: "1",
        name: "John Doe",
        role: "Developer",
        bio: "Full stack developer",
        skills: ["React", "Node.js"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(teamMembersService, "getAll").mockResolvedValue(mockTeamMembers);
    jest.spyOn(teamMembersService, "delete").mockResolvedValue(undefined);

    render(
      <QueryClientProvider client={queryClient}>
        <Team />
      </QueryClientProvider>
    );

    // Wait for the team member to be displayed
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    }); // Find and click the delete button
    const deleteButtons =
      screen.getAllByRole("button", { name: /delete/i }) ||
      screen.getAllByTitle("Delete team member");
    fireEvent.click(deleteButtons[0]);

    // window.confirm is already mocked in beforeEach to return true

    await waitFor(() => {
      expect(teamMembersService.delete).toHaveBeenCalledWith("1");
      expect(toast.success).toHaveBeenCalledWith(
        "Team member deleted successfully"
      );
    });
  });

  it("displays error when team members fail to load", async () => {
    jest
      .spyOn(teamMembersService, "getAll")
      .mockRejectedValue(new Error("Failed to fetch team members"));

    render(
      <QueryClientProvider client={queryClient}>
        <Team />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Error loading team members/i)
      ).toBeInTheDocument();
    });
  });
});
