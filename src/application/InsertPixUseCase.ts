import { Pix } from "../domain/models/Pix.js";
import { KeysRepository } from "../domain/ports/KeysRepository.js";
import { PixRepository } from "../domain/ports/PixRepository.js";

export class InsertPixUseCaseImpl {
  constructor(
    private keysRepository: KeysRepository,
    private pixRepository: PixRepository
  ) {}
  
  async handle(fromUserId: number, amount: number, keyValue: string, keyType: string): Promise<Pix> {
    const key = await this.keysRepository.getKeyFromValueType(keyValue, keyType);
    
    if (key) {
      return this.pixRepository.insertPix(amount, key.id, fromUserId, key.user_id);
    }

    throw new Error(`Error trying to find key to send pix`);
  }
}
