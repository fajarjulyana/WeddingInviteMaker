import dotenv from "dotenv";
dotenv.config();  // Load environment variables before accessing them

import { defineConfig } from "drizzle-kit";

// Ensure the path to the SQLite database file is defined
if (!process.env.DATABASE_FILE_PATH) {
  throw new Error("DATABASE_FILE_PATH is missing, ensure the SQLite database path is provided");
}

export default defineConfig({
  out: "./migrations",  // Output directory for migrations
  schema: "./db/schema.ts",  // Path to your Drizzle schema file
  dialect: "sqlite",  // Change the dialect to SQLite
  dbCredentials: {
    // Use the environment variable for the SQLite file path
    url: process.env.DATABASE_FILE_PATH,  // Point to SQLite file path in .env
  },
});

