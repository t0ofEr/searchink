import { BadRequestException } from "@nestjs/common";

export function assertNotSameUser(
    actorId: number,
    targetId: number,
    message = 'La acción no es válida sobre el mismo usuario',
): void {
    if (actorId === targetId) {
        throw new BadRequestException(message);
    }
}