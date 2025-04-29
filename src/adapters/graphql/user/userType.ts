import {GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql';
import { PostgresKeysRepository } from '../../PostgresKeysRepository.js';
import { PostgresPixRepository } from '../../PostgresPixRepository.js';
import { KeyType } from '../key/keyType.js';
import { PixType } from '../pix/pixType.js';

const keysRepository = new PostgresKeysRepository();
const pixRepository = new PostgresPixRepository();

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {type: GraphQLInt },
        username: {type: GraphQLString},
        keys: {
            type: new GraphQLList(KeyType),
            async resolve(parentValue) {
                return keysRepository.getKeysFromUser(parentValue.id);
            }
        },
        sendedPix: {
            type: new GraphQLList(PixType),
            async resolve(parentValue) {
                return pixRepository.getPixFromUser(parentValue.id)
            }
        },
        receivedPix: {
            type: new GraphQLList(PixType),
            async resolve(parentValue) {
                return pixRepository.getPixToUser(parentValue.id)
            }
        }
    }
    
})