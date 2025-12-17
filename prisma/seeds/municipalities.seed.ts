import { PrismaClient } from "../../generated/prisma/client";
import municipalitiesData from "../../src/data/chile/municipalities.json";

const prisma = new PrismaClient();

export async function seedMunicipalities(regionMap: Map<string, number>) {
    const municipalitiesToInsert: {
        name: string;
        region_id: number;
    }[] = [];

    for (const region of municipalitiesData) {
        const regionId = regionMap.get(region.abbreviation);

        if (!regionId) {
            console.warn("Region not found in map:", region.region);
            continue;
        }

        for (const comuna of region.comunas) {
            municipalitiesToInsert.push({
                name: comuna,
                region_id: regionId
            });
        }
    }

    for (const municipality of municipalitiesToInsert) {
        console.log(municipality.name)
        await prisma.municipality.upsert({
            where: {
                region_id_name: {
                    region_id: municipality.region_id,
                    name: municipality.name
                }
            },
            update: {
                name: municipality.name
            },
            create: municipality
        });
    }

    console.log("Municipalities seeded.");
}
