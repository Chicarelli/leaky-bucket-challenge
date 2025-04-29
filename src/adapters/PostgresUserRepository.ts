import { Pool } from "pg";
import { User } from "../domain/models/User.js";
import { UserRepository } from "../domain/ports/UserRepository.js";
import Database from "../infra/connection.js";

export class PostgresUserRepository implements UserRepository {
  constructor(private pool: Pool = Database.getInstance()) {}
  
  async getUsers(): Promise<User[]> {
    const query = `SELECT * FROM users`;

    try {
      const data = await this.pool.query(query);

      return data.rows;
    } catch (error) {
      throw new Error("Error trying to get users");
    }
  }

  async getUser(userId: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1`;

    try {
      const data = await this.pool.query(query);

      return data.rows[0] ? data.rows[0] : null;
    } catch (error) {
      throw new Error("Error trying to get user");
    }
  }

  async getUserLogin(username: string, password: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;

    try {
      const data = await this.pool.query(query, [username, password]);

      return data.rows[0] ? data.rows[0] : null;
    } catch (error) {
      throw new Error("Error trying to get user");
    }
  }

  async subtractNumberOfTokens(userId: number): Promise<void> {
    const query = `UPDATE users SET tokens = tokens - 1 WHERE id = $1`;

    await this.pool.query(query, [userId]);
  }
  
  async updateUserToken(tokens: number, lastUpdate: Date, id: number): Promise<void> {
    const query = `UPDATE users GET tokens = $1, last_update = $2 WHERE id = $3`;

    await this.pool.query(query, [tokens, lastUpdate, id]);
  }
}
