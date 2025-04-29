import { GraphQLInt, GraphQLString } from "graphql";
import { PixType } from "./pixType.js";
import { InsertPixUseCaseImpl } from "../../../application/InsertPixUseCase.js";
import { PostgresPixRepository } from "../../PostgresPixRepository.js";
import { PostgresKeysRepository } from "../../PostgresKeysRepository.js";

const addPixApplication = new InsertPixUseCaseImpl(
  new PostgresKeysRepository(),
  new PostgresPixRepository()
);

export const addPix = {
  type: PixType,
  args: {
    amount: { type: GraphQLInt },
    value_key: { type: GraphQLString },
    type_key: { type: GraphQLString },
  },
  resolve: async (_, args, ctx) =>
    addPixApplication.handle(
      ctx.state?.user?.user_id,
      args.amount,
      args.value_key,
      args.type_key
    ),
};
