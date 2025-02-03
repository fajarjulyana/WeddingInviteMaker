import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Connect to the SQLite database file
const sqlite = new Database("database.sqlite"); // Path to the SQLite file

// Initialize Drizzle ORM with the database and schema
export const db = drizzle(sqlite, { schema });

