import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),

  DATABASE_URL: z.url(),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  JWT_ACCESS_SECRET: z.string().min(1),

  JWT_REFRESH_SECRET: z.string().min(1),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),

  // Storage
  STORAGE_PROVIDER: z.enum(["local", "cloudinary"]).default("local"),
  UPLOAD_DIR: z.string().default("uploads"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z
    .string()
    .optional()
    .transform(val => (val ? Number(val) : 465)),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional()
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment configuration");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

export const env: Readonly<Env> = Object.freeze(result.data);

export default env;
