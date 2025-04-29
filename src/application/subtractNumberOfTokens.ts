import { PostgresUserRepository } from "../adapters/PostgresUserRepository.js";
import { UserRepository } from "../domain/ports/UserRepository.js";


export class SubtractNumberOfTokens {
    constructor(
        private userRepository: UserRepository = new PostgresUserRepository()
    ){}

    async handle(userId: number): Promise<void> {
        await this.userRepository.subtractNumberOfTokens(userId);
    }
}