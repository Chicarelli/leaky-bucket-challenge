import { Key } from "./Key.js";
import { User } from "./User.js";

export interface Pix {
  id: number;
	from: User;
	key: Key;
	to: User;
	amount: number;
}
