import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CldUploadWidget } from "next-cloudinary";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamMembersService } from "@/services/teamMembersService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Upload, X, Image } from "lucide-react";
import Link from "next/link";
import { TeamMember } from "@/api/models/TeamMember";

interface TeamMemberFormData {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  skills: string;
  contact: {
    email: string;
    linkedin: string;
    twitter: string;
  };
}

export default function EditTeamMember() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status: sessionStatus } = useSession();
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: "",
    role: "",
    bio: "",
    imageUrl: "",
    skills: "",
    contact: {
      email: "",
      linkedin: "",
      twitter: "",
    },
  });

  const {
    data: teamMember,
    isLoading,
    isError,
  } = useQuery<TeamMember>({
    queryKey: ["teamMember", id],
    queryFn: async () => {
      console.log("Fetching team member with ID:", id);
      if (!id || typeof id !== "string") {
        throw new Error("Invalid team member ID");
      }
      return teamMembersService.getById(id);
    },
    enabled: !!id && !!session,
    retry: 1,
  });

  useEffect(() => {
    if (teamMember && !isLoading) {
      setFormData({
        _id: teamMember._id,
        name: teamMember.name || "",
        role: teamMember.role || "",
        bio: teamMember.bio || "",
        imageUrl: teamMember.imageUrl || "",
        skills: teamMember.skills ? teamMember.skills.join(", ") : "",
        contact: {
          email: teamMember.contact?.email || "",
          linkedin: teamMember.contact?.linkedin || "",
          twitter: teamMember.contact?.twitter || "",
        },
      });
    }
  }, [teamMember, isLoading]);

  const updateTeamMemberMutation = useMutation({
    mutationFn: async (data: TeamMemberFormData) => {
      if (!id) throw new Error("Missing team member ID");
      return teamMembersService.update(id as string, {
        name: data.name,
        role: data.role,
        bio: data.bio,
        imageUrl: data.imageUrl || undefined,
        skills: data.skills
          ? data.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        contact: Object.entries(data.contact).some(([, value]) => value)
          ? data.contact
          : undefined,
        updatedAt: new Date(),
      });
    },
    onSuccess: () => {
      toast.success("Team member updated successfully");
      router.push("/admin/team");
    },
  });

  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    router.replace("/auth/login");
    return null;
  }

  // Show loading state while waiting for team member data
  if (isLoading && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Loading team member data...</p>
        </div>
      </div>
    );
  }

  // Show error state if team member data fetch failed
  if (isError && !teamMember) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Failed to load team member
          </h2>
          <p className="text-red-600 mb-4">
            {isError ||
              "Could not retrieve team member data. The team member might have been deleted or there's a connection issue."}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-2" /> Return to Team List
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange =
    (field: keyof TeamMemberFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    updateTeamMemberMutation.mutate(formData);
  };

  return (
    <div>
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Team Member</h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Team
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            {isError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{isError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange("name")}
                      placeholder="Enter team member's name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Position/Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={handleInputChange("role")}
                      placeholder="Enter team member's role"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={handleInputChange("bio")}
                      placeholder="Write a short bio describing their experience, expertise, and background"
                      className="min-h-[200px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <div className="relative">
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={handleInputChange("skills")}
                        placeholder="Enter skills separated by commas (e.g. Web Development, Design, Marketing)"
                        className="pr-10"
                      />
                      <div className="absolute right-3 top-2.5 text-gray-400">
                        #
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Separate each skill with a comma
                    </p>
                  </div>
                  <div className="space-y-3 border-t pt-5 mt-6">
                    <div className="border-b pb-2 mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Contact Information
                      </h2>
                      <p className="text-sm text-gray-500">
                        Optional contact details for this team member
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.contact.email}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              email: e.target.value,
                            },
                          }));
                        }}
                        placeholder="team.member@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        value={formData.contact.linkedin}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              linkedin: e.target.value,
                            },
                          }));
                        }}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter/X URL</Label>
                      <Input
                        id="twitter"
                        value={formData.contact.twitter}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            contact: {
                              ...prev.contact,
                              twitter: e.target.value,
                            },
                          }));
                        }}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Profile Image</Label>
                  <div className="border rounded-lg p-4">
                    <CldUploadWidget
                      uploadPreset="team_members"
                      options={{
                        sources: ["local", "url", "camera"],
                        maxFiles: 1,
                        resourceType: "image",
                        showAdvancedOptions: false,
                        styles: {
                          palette: {
                            window: "#FFFFFF",
                            windowBorder: "#90A0B3",
                            tabIcon: "#0078FF",
                            menuIcons: "#5A616A",
                            textDark: "#000000",
                            textLight: "#FFFFFF",
                            link: "#0078FF",
                            action: "#FF620C",
                            inactiveTabIcon: "#0E2F5A",
                            error: "#F44235",
                            inProgress: "#0078FF",
                            complete: "#20B832",
                            sourceBg: "#E4EBF1",
                          },
                        },
                      }}
                      onSuccess={(result) => {
                        const info = result.info as { secure_url: string };
                        if (info?.secure_url) {
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: info.secure_url,
                          }));
                          toast.success("Image uploaded successfully");
                        }
                      }}
                      onError={(error) => {
                        toast.error("Failed to upload image");
                        console.error("Upload error:", error);
                      }}
                    >
                      {({ open }) => (
                        <div className="space-y-4">
                          {!formData.imageUrl ? (
                            <div
                              onClick={() => open()}
                              className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <Image className="h-12 w-12 text-gray-400 mb-2" />
                              <p className="font-medium">
                                Click to upload an image
                              </p>
                              <p className="text-sm text-gray-500">
                                SVG, PNG, JPG or WEBP (max. 2MB)
                              </p>
                            </div>
                          ) : (
                            <div className="relative rounded-lg overflow-hidden border">
                              <img
                                src={formData.imageUrl}
                                alt="Team member profile"
                                className="w-full aspect-square object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      open();
                                    }}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Change
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormData((prev) => ({
                                        ...prev,
                                        imageUrl: "",
                                      }));
                                    }}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateTeamMemberMutation.isPending}
                >
                  {updateTeamMemberMutation.isPending
                    ? "Updating..."
                    : "Update Team Member"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
