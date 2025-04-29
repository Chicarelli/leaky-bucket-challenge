import { Pool } from "pg";

class Database {
  private static instance: Pool;

  private constructor() {}

  public static getInstance(): Pool {
    if (!Database.instance) {
      Database.instance = new Pool({
        host: "localhost",
        port: 5432,
        user: "user",
        password: "password",
        database: "postgres",
      });
    }
    return Database.instance;
  }
}

export default Database;