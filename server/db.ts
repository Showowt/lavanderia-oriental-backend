import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  dbInstance = drizzle(pool, { schema });
} else {
  console.warn("DATABASE_URL not set - database features will be unavailable");
}

export const db = dbInstance!;
export const isDbConnected = () => !!dbInstance;
