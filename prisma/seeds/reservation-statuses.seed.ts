import { PrismaClient } from "../../generated/prisma/client";
import { RESERVATION_STATUS_LIST } from "../../src/common/constants/reservations-status.constants";

const prisma = new PrismaClient();

export async function seedReservationStatuses() {
    for (const status of RESERVATION_STATUS_LIST) {
        console.log(`${status.name} added`);
        await prisma.reservationStatus.upsert({
            where: { id: status.id },
            update: {
                name: status.name,
            },
            create: {
                id: status.id,
                name: status.name,
            }
        });
    }
    console.log("Reservation statuses seeded");
}
