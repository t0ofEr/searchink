import { registerAs } from "@nestjs/config";

export default registerAs('cacheCfg', () => ({
  ttlOneMin: Number(process.env.TTL_ONE_MIN) * 1000,
  ttlThirtyMin: Number(process.env.TTL_THIRTY_MIN) * 1000,
  ttlOneHour: Number(process.env.TTL_ONE_HOUR) * 1000,
  ttlOneDay: Number(process.env.TTL_ONE_DAY) * 1000,
}));