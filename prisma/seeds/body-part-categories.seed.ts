import { USER_TYPE_SUPER_ADMIN_INDEX } from "src/common/constants/user.constants";
import { PrismaClient } from "../../generated/prisma/client";
import { BODY_PART_CATEGORIES } from "../../src/common/constants/body-part-categories.constants";

export async function seedBodyPartCategories() {
    const prisma = new PrismaClient();

    for (const [id, name] of Object.entries(BODY_PART_CATEGORIES)) {
        console.log(`Saving ${name}`);
        await prisma.bodyPartCategory.upsert({
            where: { 
                name
            },
            update: {
                name,
            },
            create: {
                name,
                created_by: USER_TYPE_SUPER_ADMIN_INDEX,
                modified_by: USER_TYPE_SUPER_ADMIN_INDEX,
            },
        });
    }
    
    return await prisma.bodyPartCategory.findMany({
        where: { active: true }
    });;
}
