import getMongoClient from "@/lib/mongodb";
import { User } from "@/api/models/User";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

export async function seedAdminUser() {
    try {
        const client = await getMongoClient();
        const db = client.db("myapp");
        
        const existingAdmin = await db.collection("users").findOne({ email: ADMIN_EMAIL });
        
        if (existingAdmin) {
            console.log("Admin user already exists");
            return;
        }
        
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        
        const adminUser: User = {
            name: "Admin",
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
            createdAt: new Date()
        };
        
        await db.collection("users").insertOne(adminUser);
        console.log("Admin user created successfully");
    } catch (error) {
        console.error("Error seeding admin user:", error);
        throw error;
    }
} 