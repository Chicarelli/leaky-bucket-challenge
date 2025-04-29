import { GraphQLInt } from "graphql";
import { PostgresKeysRepository } from "../../PostgresKeysRepository.js";
import { KeyType } from "./keyType.js";

const keysRepository = new PostgresKeysRepository();

export const keys = {
  type: KeyType,
  args: { id: { type: GraphQLInt } },
  resolve: async (_, args) => {
    return keysRepository.getKeysFromUser.arguments(args.id);
  },
};
