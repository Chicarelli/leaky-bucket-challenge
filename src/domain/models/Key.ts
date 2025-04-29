import { User } from "./User.js";

export interface Key {
    id: number;
    user_id: number;
    type: string;
    value: string;
}