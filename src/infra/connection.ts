import { Pool } from "pg";
import "dotenv/config";

class Database {
  private static instance: Pool;

  private constructor() {}

  public static getInstance(): Pool {
    if (!Database.instance) {
      Database.instance = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
    }
    return Database.instance;
  }
}

export default Database;