import { USER_TYPE_SUPER_ADMIN_INDEX } from "src/common/constants/user.constants";
import { BodyPartCategory, PrismaClient } from "../../generated/prisma/client";
import bodyPartsData from "../../src/data/bodyParts/body-parts.json";
export async function seedBodyParts(bodyPartsCategories: BodyPartCategory[]) {
    const prisma = new PrismaClient();
    const bodyPartsToInsert: {
        name: string;
        description: string;
        body_part_category_id: number;
    }[] = [];

    for (const bodyPart of bodyPartsData) {
        const bodyPartCategory = bodyPartsCategories.find(category => category.name === bodyPart.category);
        
        if (!bodyPartCategory) {
            console.warn("Category not found in map:", bodyPart.category);
            continue;
        }
        for (const part of bodyPart.bodyParts) {
            bodyPartsToInsert.push({
                name: part.name,
                description: part.description,
                body_part_category_id: bodyPartCategory.id
            });
        }
    }

    for (const bodyPart of bodyPartsToInsert) {
        console.log(bodyPart.name)
        await prisma.bodyPart.upsert({
            where: {
                name: bodyPart.name
            },
            update: {
                name: bodyPart.name,
                description: bodyPart.description,
                body_part_category_id: bodyPart.body_part_category_id
            },
            create: {
                name: bodyPart.name,
                description: bodyPart.description,
                body_part_category_id: bodyPart.body_part_category_id,
                created_by: USER_TYPE_SUPER_ADMIN_INDEX,
                modified_by: USER_TYPE_SUPER_ADMIN_INDEX,
            }
        });
    }

    console.log("Body parts seeded.");
}