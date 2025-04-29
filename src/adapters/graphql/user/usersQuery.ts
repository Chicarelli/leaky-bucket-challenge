import { GraphQLList } from "graphql";
import { PostgresUserRepository } from "../../PostgresUserRepository.js";
import { UserType } from "./userType.js";

const userRepository = new PostgresUserRepository();

export const users = {
  type: new GraphQLList(UserType),
  resolve: async () => {
    return await userRepository.getUsers();
  },
};
