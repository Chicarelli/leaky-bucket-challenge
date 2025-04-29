import { User } from "../models/User.js";

export interface UserRepository {
    getUsers(): Promise<User[]>;
    getUser(userId: string): Promise<User | null>;
    getUserLogin(username: string, password: string): Promise<User | null>;
    updateUserToken(tokens: number, lastUpdate: Date, id: number): Promise<void>;
    subtractNumberOfTokens(userId: number): Promise<void>;
}