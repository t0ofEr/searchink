import { Prisma } from '@prisma/client';

export async function generateUsername(
    base: string,
    tx: Prisma.TransactionClient,
): Promise<string> {
    const normalized = base
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');

    let username = normalized;
    let counter = 0;

    while (true) {
        const exists = await tx.user.findUnique({
            where: { username },
            select: { id: true },
        });

        if (!exists) {
            return username;
        }

        counter++;
        username = `${normalized}${counter}`;
    }
}
