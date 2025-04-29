import { PostgresUserRepository } from "../adapters/PostgresUserRepository.js";
import { LoggedUser } from "../domain/models/LoggedUser.js";
import { UserRepository } from "../domain/ports/UserRepository.js";
import jwt from 'jsonwebtoken';
import "dotenv/config";

export class LoginUseCase {
    constructor(private userRepository: UserRepository = new PostgresUserRepository()){}

    async handle(username: string, password: string): Promise<LoggedUser> {

        const loggedUser = await this.userRepository.getUserLogin(username, password);

        if (loggedUser) {
            return {
                access_token: jwt.sign(
                    {
                    user: loggedUser.username,
                    user_id: loggedUser.id
                    },
                    process.env.PRIVATE_KEY,
                    {algorithm: "RS256", expiresIn: '1h'}
                )
            }
        }

        throw new Error("Error trying to log in");
    }
}
