import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContactUsPage from "@/pages/contact";
import { contactService } from "@/services/contactService";
import { toast } from "sonner";
import userEvent from "@testing-library/user-event";

// Mock the modules
jest.mock("@/services/contactService");
jest.mock("sonner");

describe("Contact Page", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  it("renders the contact form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContactUsPage />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("submits the contact form successfully", async () => {
    const mockContactData = {
      name: "John Doe",
      email: "john@example.com",
      subject: "Test Subject",
      message: "This is a test message",
    };
    const mockResponse = {
      _id: "123456789012345678901234",
      name: "John Doe",
      email: "john@example.com",
      subject: "Test Subject",
      message: "This is a test message",
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(contactService, "create").mockResolvedValue(mockResponse);

    render(
      <QueryClientProvider client={queryClient}>
        <ContactUsPage />
      </QueryClientProvider>
    );

    const user = userEvent.setup();

    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), mockContactData.name);
    await user.type(screen.getByLabelText(/email/i), mockContactData.email);
    await user.type(screen.getByLabelText(/subject/i), mockContactData.subject);
    await user.type(screen.getByLabelText(/message/i), mockContactData.message);

    // Submit the form
    await user.click(screen.getByRole("button", { name: /send message/i })); // Check if the service was called with correct data
    await waitFor(() => {
      expect(contactService.create).toHaveBeenCalledWith(mockContactData);
      expect(toast.success).toHaveBeenCalledWith("Message sent successfully!");
    });
  });

  it("displays validation errors for invalid inputs", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ContactUsPage />
      </QueryClientProvider>
    );

    const user = userEvent.setup();

    // Submit the form without filling it
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });

    // Test invalid email format
    await user.type(screen.getByLabelText(/email/i), "invalid-email");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
    });
  });

  it("handles form submission error", async () => {
    const mockError = new Error("Network error");
    jest.spyOn(contactService, "create").mockRejectedValue(mockError);

    render(
      <QueryClientProvider client={queryClient}>
        <ContactUsPage />
      </QueryClientProvider>
    );

    const user = userEvent.setup();

    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/subject/i), "Test Subject");
    await user.type(
      screen.getByLabelText(/message/i),
      "This is a test message"
    );

    // Submit the form
    await user.click(screen.getByRole("button", { name: /send message/i })); // Check error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to send message");
    });
  });
});
