import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CldUploadWidget } from "next-cloudinary";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamMembersService } from "@/services/teamMembersService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TeamMember } from "@/api/models/TeamMember";

interface TeamMemberFormData {
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

export default function CreateTeamMember() {
  const router = useRouter();
  const { data: session, status } = useSession();
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
  const [error, setError] = useState("");
  const createTeamMemberMutation = useMutation({
    mutationFn: async (data: TeamMemberFormData): Promise<TeamMember> => {
      const response = await teamMembersService.create({
        name: data.name,
        role: data.role,
        bio: data.bio,
        imageUrl: data.imageUrl || undefined,
        skills: data.skills
          ? data.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        contact: Object.values(data.contact).some((val) => val)
          ? data.contact
          : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return response;
    },
    onSuccess: () => {
      toast.success("Team member added successfully");
      router.push("/admin/team");
    },
    onError: (error) => {
      setError("An error occurred while adding the team member");
      console.error("Error creating team member:", error);
    },
  });

  if (status === "loading") {
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
    setError("");
    createTeamMemberMutation.mutate(formData);
  };

  return (
    <div>
      {" "}
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Create Team Member</h1>
            <p className="text-gray-500">
              Add a new member to your team with their details and contact
              information.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Team
            </Link>
          </Button>
        </div>

        <Card className="shadow-md border-0">
          <CardContent className="pt-6 pb-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {" "}
                <div className="space-y-6">
                  <div className="border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Basic Information
                    </h2>
                  </div>
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
                      className="min-h-[120px]"
                      required
                    />
                  </div>{" "}
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
                </div>{" "}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Profile Image</Label>
                  <div className="border rounded-lg p-6 bg-gray-50">
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
                              <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                              <p className="font-medium">
                                Click to upload an image
                              </p>
                              <p className="text-sm text-gray-500">
                                SVG, PNG, JPG or WEBP (max. 2MB)
                              </p>
                            </div>
                          ) : (
                            <div className="relative rounded-lg overflow-hidden border">
                              <Image
                                src={formData.imageUrl}
                                alt="Team member profile"
                                className="w-full aspect-square object-cover"
                                width={400}
                                height={400}
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
              </div>{" "}
              <div className="flex justify-end space-x-4 pt-6 mt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="px-8 bg-gray-900  hover:bg-black text-white"
                  disabled={createTeamMemberMutation.isPending}
                >
                  {createTeamMemberMutation.isPending ? (
                    <>
                      <span className="animate-spin mr-2">⊚</span>
                      Adding...
                    </>
                  ) : (
                    "Add Team Member"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
