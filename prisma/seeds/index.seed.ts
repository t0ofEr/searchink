import { seedBodyPartCategories } from './body-part-categories.seed';
import { seedBodyParts } from './body-parts.seed';
import { seedContentTypes } from './content-types.seed';
import { seedCountries } from './country.seed';
import { seedMunicipalities } from './municipalities.seed';
import { seedRegions } from './regions.seed';
import { seedReservationStatuses } from './reservation-statuses.seed';
import { seedTattooStyles } from './tattoo-styles.seed';
import { seedUserTypes } from './user-types.seed';
import { seedUsers } from './users.seed';

async function step(name: string, fn: () => Promise<any>) {
    console.log(`\n=== ${name.toUpperCase()} START ===`);
    const result = await fn();
    console.log(`=== ${name.toUpperCase()} DONE ===\n`);
    return result;
}

async function main() {
    await step("user types", seedUserTypes);
    await step("content types", seedContentTypes);
    await step("users", seedUsers);

    const country = await step("countries", seedCountries);
    const regionMap = await step("regions", () => seedRegions(country.id));

    await step("municipalities", () => seedMunicipalities(regionMap));
    const bodyPartCategoriesMap = await step("body part categories", seedBodyPartCategories);
    await step("body parts", () => seedBodyParts(bodyPartCategoriesMap))

    await step("tattoo styles", seedTattooStyles);

    await step("reservation statuses", seedReservationStatuses);
}

main()
    .catch((e) => console.error(e))
    .finally(() => process.exit());