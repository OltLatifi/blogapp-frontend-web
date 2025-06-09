import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.redirect("/auth/login");
  }

  if (session.user.role === "admin") {
    return res.redirect("/admin");
  } else {
    return res.redirect("/");
  }
}
