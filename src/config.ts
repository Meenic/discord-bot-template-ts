import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Discord-related variables
  TOKEN: z.string().min(1, 'TOKEN is required'),
  GUILD_ID: z.string().optional(), // Optional for development
  CLIENT_ID: z.string().min(1, 'Client ID is required'),

  // Database connection variables
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Redis configuration
  REDIS_URL: z.string().optional(),

  // Environment configuration
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(`[Config] Invalid environment variables:`, env.error.format());
  process.exit(1);
}

export const config = env.data;
