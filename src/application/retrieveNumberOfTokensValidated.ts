import { PostgresUserRepository } from "../adapters/PostgresUserRepository.js";
import { UserRepository } from "../domain/ports/UserRepository.js";

export class RetrieveNumberOfTokensValidated {
    constructor(
        private userRepository: UserRepository = new PostgresUserRepository()
    ){}

    async handle(userId: string): Promise<number> {
        const user = await this.userRepository.getUser(userId);

        if (user) {

            const now = new Date();
            
            if (user.last_update === null) {
                this.userRepository.updateUserToken(10, new Date(), user.id);
                return
            }

            const diffMs = now.getTime() - user.last_update.getTime()
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

            const tokens = user.tokens + diffHours >= 10 ? 10 : user.tokens + diffHours;

            if (tokens !== user.tokens) {
                await this.userRepository.updateUserToken(tokens, now, user.id);
            }

            return tokens;
        }
    }
}