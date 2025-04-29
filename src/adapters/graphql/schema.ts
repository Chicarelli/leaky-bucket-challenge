import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import {user} from './user/userQuery.js'
import {keys} from './key/keyQuery.js';
import { users } from './user/usersQuery.js';
import { addKey } from './key/keyMutation.js';
import { addPix } from './pix/pixMutation.js';

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            user,
            keys,
            users
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            addKey,
            addPix
        }
    })
})