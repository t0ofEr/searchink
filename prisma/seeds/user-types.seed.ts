import { USER_TYPES } from "src/common/constants/user.constants";
import { PrismaClient } from "../../generated/prisma/client";

const prisma = new PrismaClient();

export async function seedUserTypes() {
    console.log("Seeding user types...");

    for (const [id, name] of Object.entries(USER_TYPES)) {
        console.log(id, name);
        await prisma.userType.upsert({
            where: { id: Number(id) },
            update: { name },
            create: { id: Number(id), name },
        });
    }

    console.log("User types seeded.");
}
