import { GraphQLObjectType, GraphQLString } from "graphql";

export const KeyType = new GraphQLObjectType({
  name: "Key",
  fields: {
    type: { type: GraphQLString },
    value: { type: GraphQLString },
  },
});
