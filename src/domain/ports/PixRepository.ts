import { Pix } from "../models/Pix.js";


export interface PixRepository {
    getPixFromUser(userId: number): Promise<Pix[]>;
    getPixToUser(userId: number): Promise<Pix[]>;
    insertPix(amount: number, keyId: number, fromUserId: number, toUserId: number): Promise<Pix | null>
}