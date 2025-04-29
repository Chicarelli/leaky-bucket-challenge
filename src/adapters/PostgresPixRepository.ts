import { Pool } from "pg";
import { Pix } from "../domain/models/Pix.js";
import { PixRepository } from "../domain/ports/PixRepository.js";
import Database from "../infra/connection.js";

export class PostgresPixRepository implements PixRepository {
    constructor(private pool: Pool = Database.getInstance()) {};

    async getPixFromUser(userId: number): Promise<Pix[]> {
        const query = `SELECT * FROM pix WHERE from_user_id = $1`;

        try {
            const data = await this.pool.query(query, [userId]);

            return data.rows;
        } catch(error) {
            throw new Error(`Error trying to get pix from user`)
        }
    }

    async getPixToUser(userId: number): Promise<Pix[]> {
        const query = `SELECT * FROM pix WHERE to_user_id = $1`;

        try {
            const data = await this.pool.query(query, [userId]);

            return data.rows;
        } catch(error) {
            throw new Error(`Error trying to get pix from user`)
        }
    }

    async insertPix(amount: number, keyId: number, fromUserId: number, toUserId: number): Promise<Pix> {
        const query = `INSERT INTO pix (amount, key_id, from_user_id, to_user_id) VALUES ($1, $2, $3, $4) RETURNING *;`;

        try {
            const data = await this.pool.query(query, [amount, keyId, fromUserId, toUserId]);
            
            return data.rows[0] ? data.rows[0] : null
        } catch(error) {
            throw new Error(`Error trying to insert pix`)
        }
    }


}