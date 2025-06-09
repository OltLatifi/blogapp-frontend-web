export interface Contact {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
