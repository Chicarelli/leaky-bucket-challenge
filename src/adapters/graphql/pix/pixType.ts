import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';
import { KeyType } from '../key/keyType.js';
import { PostgresKeysRepository } from '../../PostgresKeysRepository.js';
import { PostgresUserRepository } from '../../PostgresUserRepository.js';

const keysRepository = new PostgresKeysRepository();
const usersRepository = new PostgresUserRepository();

export const PixType = new GraphQLObjectType({
    name: "Pix",
    fields: {
        amount: { type: GraphQLInt },
        key: {
            type: KeyType,
            resolve: async (parentValue) => {
                return await keysRepository.getKeysFromUser(parentValue.key_id);
            }
        },
        from: {
            type: GraphQLString,
            resolve: async (parentValue) => {
                const user = await usersRepository.getUser(parentValue.from_user_id)

                return user?.username;
            }
        },
        to: {
            type: GraphQLString,
            resolve: async (parentValue) => {
                const user = await usersRepository.getUser(parentValue.to_user_id)

                return user?.username
            }
        }
    }
})