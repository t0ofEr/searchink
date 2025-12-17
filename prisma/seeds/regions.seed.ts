import { PrismaClient } from "../../generated/prisma/client";
import municipalitiesData from "../../src/data/chile/municipalities.json";

const prisma = new PrismaClient();

export async function seedRegions(countryId: number) {

    for (const region of municipalitiesData) {
        console.log(region.region)
        await prisma.region.upsert({
            where: {
                country_id_name: {
                    country_id: countryId,
                    name: region.region
                }
            },
            update: {
                name: region.region,
                abbreviation: region.abbreviation,
            },
            create: {
                name: region.region,
                abbreviation: region.abbreviation,
                country_id: countryId
            }
        });
    }

    const regionsDb = await prisma.region.findMany({
        where: { country_id: countryId }
    });

    const regionMap = new Map<string, number>();
    for (const region of regionsDb) {
        regionMap.set(region.abbreviation, region.id);
    }
    console.log("Regions seeded.")
    return regionMap;
}
