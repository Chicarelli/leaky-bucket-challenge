import { Pool } from "pg";
import { KeysRepository } from "../domain/ports/KeysRepository.js";
import { Key } from "../domain/models/Key.js";
import Database from "../infra/connection.js";

export class PostgresKeysRepository implements KeysRepository {
	constructor(private pool: Pool = Database.getInstance()) {}
	
	async insertKey(user_id: number, type: string, value: string): Promise<Key | null> {
		const query = `INSERT INTO keys (user_id, type, value) VALUES ($1, $2, $3) RETURNING *;`

		try {
			const data = await this.pool.query(query, [user_id, type, value]);

			return data?.rows[0] ? data.rows[0] : null;
		} catch (error) {
			throw new Error(`Error insertinr key`, error);
		}
	}

	async getKeysFromUser(user_id: number): Promise<Key[]> {
		const query = `SELECT * from KEYS WHERE user_id = $1;`;

		try {
			const data = await this.pool.query(query, [user_id]);
			return data.rows;
		} catch (error) {
			throw new Error(`Error trying to fetch user's key`, error);
		}
	}

	async getKey(key_id: number): Promise<Key | null> {
		const query = `SELECT * FROM keys WHERE id = $1;`;

		try {
			const data = await this.pool.query(query, [key_id]);
			
			return data?.rows[0] ? data.rows[0]: null;
		} catch (error) {
			throw new Error(`Error trying to fetch the required key`, error);
		}
	}

	async getKeyFromValueType(value: string, type: string): Promise<Key | null> {
		const query = `SELECT * FROM keys WHERE value = $1 AND type = $2;`

		try {
			const data = await this.pool.query(query, [value, type]);
			
			return data?.rows[0] ? data.rows[0] : null;
		} catch (error) {
			throw new Error('Error trying to fetch the required key from value and type', error);
		}
	}		
}
