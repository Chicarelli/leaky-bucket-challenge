import { GraphQLInt, GraphQLString } from 'graphql';
import { PostgresKeysRepository } from '../../PostgresKeysRepository.js';
import { KeyType } from './keyType.js';
import { InsertKeyUseCaseImpl } from '../../../application/InsertKeyUseCase.js';

const insertKeyApplication = new InsertKeyUseCaseImpl(new PostgresKeysRepository());

export const addKey = {
    type: KeyType,
    args: {
        user_id: {type: GraphQLInt},
        type: {type: GraphQLString},
        value: {type: GraphQLString}
    },
    resolve: async (_, args) => {
        return await insertKeyApplication.handle(args.user_id, args.type, args.value);
    }
}