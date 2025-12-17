import { PrismaClient } from "../../generated/prisma/client";
import {
    COUNTRY_NAME,
    COUNTRY_ISO2,
    COUNTRY_ISO3,
    COUNTRY_PHONE_CODE,
    COUNTRY_ID,
} from "../../src/common/constants/country.chile";

const prisma = new PrismaClient();

export async function seedCountries() {
    const country = await prisma.country.upsert({
        where: { id: COUNTRY_ID },
        update: {
            name: COUNTRY_NAME,
            iso2: COUNTRY_ISO2,
            iso3: COUNTRY_ISO3,
            phone_code: COUNTRY_PHONE_CODE
        },
        create: {
            name: COUNTRY_NAME,
            iso2: COUNTRY_ISO2,
            iso3: COUNTRY_ISO3,
            phone_code: COUNTRY_PHONE_CODE
        }
    });

    console.log("Country seeded:", country);
    return country;
}
