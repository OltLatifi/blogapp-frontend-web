export interface TeamMember {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id?: any;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  skills: string[];
  contact?: {
    email?: string;
    linkedin?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
