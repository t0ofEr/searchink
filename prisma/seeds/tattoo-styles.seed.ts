import { USER_TYPE_SUPER_ADMIN_INDEX } from "src/common/constants/user.constants";
import { PrismaClient } from "../../generated/prisma/client";
import tattooStylesData from "../../src/data/tattooStyles/tattoo-styles.json";

export async function seedTattooStyles() {
    const prisma = new PrismaClient();
    for (const style of tattooStylesData) {
        console.log(`${style.name} added`);
        await prisma.tattooStyle.upsert({
            where: { name: style.name },
            update: {
                name: style.name,
                description: style.description,
                created_by: USER_TYPE_SUPER_ADMIN_INDEX,
                modified_by: USER_TYPE_SUPER_ADMIN_INDEX,
            },
            create: {
                name: style.name,
                description: style.description,
                created_by: USER_TYPE_SUPER_ADMIN_INDEX,
                modified_by: USER_TYPE_SUPER_ADMIN_INDEX,
            }
        });
    }
    console.log('Tattoo styles seeded.');
}