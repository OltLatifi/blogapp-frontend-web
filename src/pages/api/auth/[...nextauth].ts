import NextAuth, { DefaultSession, DefaultUser, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { compare } from "bcryptjs";
import { getUser } from "@/api/services/User";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: string;
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        id: string;
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}

type JwtCallbackParams = {
    token: JWT;
    user: User;
}

type SessionCallbackParams = {
    session: Session;
    token: JWT;
}

export const authOptions: AuthOptions = {
    adapter: MongoDBAdapter(clientPromise) as Adapter,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await getUser(credentials?.email ?? "");
                if (!user) throw new Error("Email does not exist");
                const isValid = await compare(credentials!.password,
                    user.password);
                if (!isValid) throw new Error("Password is incorrect");
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        emailVerified: user.emailVerified ?? null,
                        role: user.role,
                    };
            },
        }),
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user }: JwtCallbackParams) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: SessionCallbackParams) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);