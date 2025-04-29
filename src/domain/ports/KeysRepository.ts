import { Key } from "../models/Key.js";

export interface KeysRepository {
    insertKey(user_id: number, type: string, value: string): Promise<Key | null>;
    getKeysFromUser(user_id: number): Promise<Key[]>;
    getKey(key_id: number): Promise<Key | null>;
    getKeyFromValueType(value: string, type: string): Promise<Key | null>;

}