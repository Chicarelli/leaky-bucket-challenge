import { Key } from "../domain/models/Key.js";
import { KeysRepository } from "../domain/ports/KeysRepository.js";

export class InsertKeyUseCaseImpl {
    constructor(private keysRepository: KeysRepository) {}

    async handle(userId: number, type: string, value: string): Promise<Key> {
        return await this.keysRepository.insertKey(userId, type, value);
    }
}