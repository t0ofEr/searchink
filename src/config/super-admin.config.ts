import { registerAs } from "@nestjs/config";

export default registerAs('superadmin', () => ({
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL as string,
  superAdminPass: process.env.SUPER_ADMIN_PASS as string,
}));