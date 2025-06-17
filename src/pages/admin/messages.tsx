import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Contact } from "@/api/models/Contact";
import { contactService } from "@/services/contactService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormatDate } from "@/hooks/useFormatData";

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: () => contactService.getAll(),
  });
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);
  const { formatDate } = useFormatDate();

  const updateReadMutation = useMutation({
    mutationFn: (contact: Contact) =>
      contactService.update(contact._id, { ...contact, read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setSelectedMessage(null);
    },
  });

  const handleSelectMessage = (message: Contact) => {
    setSelectedMessage(message);
    if (!message.read && message._id) {
      updateReadMutation.mutate(selectedMessage || message);
    }
  };

  const handleDeleteMessage = (id: string) => {
    console.log("Deleting message with ID:", id);
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">
          Failed to load messages. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Message Center</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center justify-between">
              Messages
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {messages.filter((m) => !m.read).length} New
              </span>
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedMessage?._id === message._id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  } ${!message.read ? "border-l-4 border-blue-500" : ""}`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="flex justify-between">
                    <p
                      className={`font-medium ${
                        !message.read ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500">
                      {message.createdAt
                        ? formatDate(message.createdAt)
                        : "Unknown"}
                    </p>
                  </div>
                  <p className="text-sm truncate">{message.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              {selectedMessage ? "Message Details" : "Select a message"}
            </h2>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      From: {selectedMessage.name} ({selectedMessage.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      Received:{" "}
                      {selectedMessage.createdAt
                        ? formatDate(selectedMessage.createdAt)
                        : "Unknown"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h2 className="text-2xl font-medium mb-2">
                    Message Content:
                  </h2>
                  <h3 className="text-xl font-medium">
                    {selectedMessage.subject}
                  </h3>
                  <p className="whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Select a message from the list to view its details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
