import { AuthProvider } from "generated/prisma/enums";

export class GoogleAuthIdentityDto {
    user_id: number;
    provider_id: string;
    provider: AuthProvider;
}