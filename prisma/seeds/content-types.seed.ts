import { CONTENT_TYPES } from "src/common/constants/content-types.constants";
import { PrismaClient } from "../../generated/prisma/client";

const prisma = new PrismaClient();

export async function seedContentTypes() {
    console.log("Seeding content types...");

    for (const [id, name] of Object.entries(CONTENT_TYPES)) {
        console.log(id, name);
        await prisma.contentType.upsert({
            where: { id: Number(id) },
            update: { name },
            create: { id: Number(id), name },
        });
    }

    console.log("Content types seeded.");
}
