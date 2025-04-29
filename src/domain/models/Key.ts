import { User } from "./User.js";

export interface Key {
    id: number;
    user: User;
    type: string;
    value: string;
}