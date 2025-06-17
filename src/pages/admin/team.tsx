import { TeamMember } from "@/api/models/TeamMember";
import { teamMembersService } from "@/services/teamMembersService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Team() {
  const queryClient = useQueryClient();
  const {
    data: teamMembers,
    isLoading,
    error,
  } = useQuery<TeamMember[], Error>({
    queryKey: ["teamMembers"],
    queryFn: async () => teamMembersService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return teamMembersService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Team member deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete team member");
      console.error("Delete error:", error);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <Button asChild className="gap-2">
          <Link href="/admin/team/create">
            <Plus className="h-4 w-4" /> Create Team Member
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-0">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="pt-4">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          <p className="font-semibold">Error loading team members</p>
          <p>{error.message}</p>
        </div>
      )}

      {teamMembers && teamMembers.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <User className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No team members yet</h3>
          <p className="text-gray-500">
            Get started by creating a new team member
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/admin/team/create">
              <Plus className="h-4 w-4 mr-2" /> Add Team Member
            </Link>
          </Button>
        </div>
      )}

      {teamMembers && teamMembers.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member._id} className="p-0 pb-5">
              <div className="relative h-48 bg-gray-100">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-3xl">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              <CardHeader>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500 font-medium">
                  {member.role}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">{member.bio}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/team/edit/${member._id}`}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(member._id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
