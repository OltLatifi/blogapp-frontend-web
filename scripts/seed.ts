import { config } from "dotenv";
import { resolve } from "path";

const envPath = resolve(__dirname, "../.env");
config({ path: envPath });

if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env file");
    process.exit(1);
}

import { seedAdminUser } from "../src/api/seeders/adminSeeder";

seedAdminUser()
    .then(() => {
        console.log("Seeding completed");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exit(1);
    }); 