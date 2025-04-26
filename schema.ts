import graphql from "graphql";
import { Pool } from "pg";
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "user",
  password: "password",
  database: "postgres",
});

const UserType = new graphql.GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        username: { type: graphql.GraphQLString },
        keys: {
            type: new graphql.GraphQLList(KeyType),
            async resolve(parentValue, args, context) {

                const query = `SELECT * FROM keys WHERE 
                user_id = ${parentValue.id}`;
                try {
                    const data = await pool.query(query);
                    return data.rows;
                } catch (error) {
                    return `Error is ${error}`;
                }
            }
        },
        sendedPix: {
            type: new graphql.GraphQLList(PixType),
            async resolve(parentValue, args) {
                const query = `SELECT * FROM pix WHERE from_user_id = ${parentValue.id}`;

                try {
                    const data = await pool.query(query);
                    return data.rows
                } catch (error) {
                    return `Error is ${error}`
                }
            }
        },
        receivedPix: {
            type: new graphql.GraphQLList(PixType),
            async resolve(parentValue, args) {
                const query = `SELECT * FROM pix WHERE to_user_id = ${parentValue.id}`;

                try {
                    const data = await pool.query(query);
                    return data.rows
                } catch (error) {
                    return `Error is ${error}`
                }
            }
        }

    })
})

const KeyType = new graphql.GraphQLObjectType({
    name: "Key",
    fields: {
        type: {type: graphql.GraphQLString},
        value: {type: graphql.GraphQLString}
    }
})

const PixType = new graphql.GraphQLObjectType({
    name: "Pix",
    fields: {
        amount: {type: graphql.GraphQLInt},
        key: {
            type: KeyType,
            async resolve(parentValue, args) {
                const query = `SELECT * FROM keys WHERE id = ${parentValue.key_id}`;
                try {
                    const data = await pool.query(query);
                    return data.rows[0];
                } catch (error) {
                    return `Error is ${error}`;
                }
            }
        },
        from: {
            type: graphql.GraphQLString,
            async resolve(parentValue, args) {
                const query = `SELECT * FROM users WHERE id = ${parentValue.from_user_id}`;
                try {
                    const data = await pool.query(query);
                    return data.rows[0].username;
                } catch (error) {
                    return `Error is ${error}`;
                }
            }
        },
        to: {
            type: graphql.GraphQLString,
            async resolve(parentValue, args) {
                const query = `SELECT * FROM users WHERE id = ${parentValue.to_user_id}`;

                try {
                    const data = await pool.query(query);
                    return data.rows[0].username;
                } catch (error) {
                    return `Error is ${error}`;
                }
            }
        },
    }

})

const RootQuery = new graphql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: graphql.GraphQLInt}},
            async resolve(parentValue, args, ctx) {
                console.log(ctx.state.user);
                const query = `SELECT * FROM users WHERE id = ${args.id}`;
                try {
                    const data = await pool.query(query);
                    return data.rows[0];
                } catch (error) {
                    return `Error is ${error}`;
                }
            }
        },
        keys: {
            type: KeyType,
            args: {id: {type: graphql.GraphQLInt}},
            async resolve(parentValue, args) {
                const query = `SELECT * FROM keys WHERE id = ${args.id}`;

                try {
                    const data = await pool.query(query);
                    return data.rows[0];
                } catch (error) {
                    return `Error is ${error}`;
                }
            }
        },
        users: {
            type: new graphql.GraphQLList(UserType),
            async resolve() {
                const query = `SELECT *  FROM users`;

                try {
                    const data = await pool.query(query);
                    return data.rows;
                } catch (error) {
                    return `Error is ${error}`;

                }
            }
        },
    },
    
})

const Mutation = new graphql.GraphQLObjectType({
    name: "Mutation",
    fields: {
        addKey: {
            type: KeyType,
            args: {
                user_id: {type: graphql.GraphQLInt},
                type: {type: graphql.GraphQLString},
                value: {type: graphql.GraphQLString}
            },
            async resolve(parentValue, args, ctx) {
                const query = `INSERT INTO keys (user_id, type, value) VALUES ($1, $2, $3) RETURNING *;`;

                const values = [args.user_id, args.type, args.value];

                try {
                    const data = await pool.query(query, values);
                    return data.rows[0];
                } catch (error){
                    throw new Error(`Inserting error: ${error}`)
                }
            }
        },
        addPix: {
            type: PixType,
            args: {
                amount: {type: graphql.GraphQLInt},
                value_key: {type: graphql.GraphQLString},
                type_key: {type: graphql.GraphQLString},
            },
            async resolve(parentValue, args, ctx) {
                if(args.amount < 100) {
                    throw new Error("Amount should be equal or greater then $1 ")
                }

                const fromUserId = ctx.state.user.user_id;
                const {value_key, type_key} = args
                const queryKey = `SELECT * FROM keys WHERE value = $1 AND type = $2;`;
                let key = null;

                try {
                    const keys = await pool.query(queryKey, [value_key, type_key])
                   key = keys.rows.length == 0 ? null : keys.rows[0];
                    
                } catch( error ) {
                    throw new Error(`Error trying to get key: ${error}`);
                }

                const query = `INSERT INTO pix (amount, key_id, from_user_id, to_user_id) VALUES ($1, $2, $3, $4) RETURNING *;`;

                try {
                    const data = await pool.query(query, [args.amount, key.id, fromUserId, key.user_id])
                    return data.rows[0]
                } catch (error) {
                    throw new Error(`Inserting PIX error: ${error}`)
                }
            }
        }
    }

})

export default new graphql.GraphQLSchema({query: RootQuery, mutation: Mutation})