import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import * as schema from "./schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const connection = await mysql.createConnection(process.env.DATABASE_URL);
export const db = drizzle(connection, { schema, mode: "default" });

export * from "./schema";
