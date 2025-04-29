import { PostgresUserRepository } from "../../PostgresUserRepository.js";
import { UserType } from "./userType.js";
import { GraphQLInt } from 'graphql';

const userRepository = new PostgresUserRepository();

export const user = {
    type: UserType,
    args: {id: { type: GraphQLInt }},
    resolve: async (_, args) => {
        return await userRepository.getUser(args.id);
    }
}