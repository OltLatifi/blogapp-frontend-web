import { seedAdminUser } from "@/api/seeders/adminSeeder";

async function main() {
    try {
        await seedAdminUser();
        process.exit(0);
    } catch (error) {
        console.error("Error running seeder:", error);
        process.exit(1);
    }
}

main(); 