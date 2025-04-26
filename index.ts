import Koa from "koa";
import route from "koa-route";
import jwt from "jsonwebtoken";
import { koaBody } from "koa-body";
import { Pool } from "pg";
import { graphqlHTTP } from "koa-graphql";
import schema from "./schema.js";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "user",
  password: "password",
  database: "postgres",
});
const app = new Koa();

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAoaVRdiKA/2RmW7J1KHEQw6/uUwxYIBfNKGCxrbaQDUzVQvw/
NS/y91N80J+HZFlr+tr8p5uTjyX1ZyoezSZpdrniMDIin39jVP6zjuGTERKD4Oxb
yCmRc2ppRPuuj5YXukUmlsuu0G6lq7u9C/ygFXJj7PIT7f28aamyEiBFUgcUSUEE
GQHTzv6YcsVaYiL0cVdndv6e+MTS3DoTqOTtlthE6JMpFOD3XOILfdCdcXhFxDPN
a4tG4h4OwGPbGlww2mKTQWKPFroIgN5esRrNsWNHUWlfDDuLwpTSI6s3un8SAiKt
G7fyMuCd7KuS3ietSwDqmAvoDc3pXGDSz1JCBwIDAQABAoIBAQCLp5W6t9K1U9uv
S343A4BVYPFJpPeaOpYQVYIMsBbCtuflaKN/Yz7J+cJzR/CkfTFyWLJCaIJTAZuE
lvpnidFCNxS5SQdqv5dlPmyJfFAgRtvTfsFJLMiya3QpmjxVZ3p2fvn4/F67S20s
8xVAfvEbtmmos/kN+9NFgswLJwBc/cs/QMlvIaF2fxEABaxZKa2WJONlL54v1Ovn
5up3vbj36L4gfzQbeBEIcIitVBcjIShTsc+j5168zCb97kZKdvImmZW51o/e8r7h
3jW0s++K3fHefA3dmEzzuzx1RvRPUg+lzBXLKIBpRdYca62CAoFdu7vhPQHzKNqO
rLLxByaRAoGBAM1P1sYYgdIQ2vIMm8iBnPcq6ERWKPDxsOAeWNca936VUHD76icm
zkFGMP5R5BQwvZTZVJLBEjnmTYrV+al6KojxYj4yvITC3nXO8SB6QOcrR9JJneQT
nwYWowuQfwC0OVd3b8KMisrba5UIaJYHNCGCPI1bv/z2AaVgFK5+Ak8fAoGBAMmN
r6HBbFdNlXd7MmhDih95mEvuvR0rAOx+fNSgAwPaYcyRNghsjQcr0lGOhVOX2mtg
TF8ho/WaccpqcWio+3cnlOjQy8kPeGwA6cuSo7dap8twfX20Hh0KMJyZ92KxxI0Q
EbKqfiCeluphfSLkamsJE9K3hTPFnqyVTR/tvngZAoGAMU2s6+FSu5lkmp/AgUPu
58QcBt0R89p2eTuQZgeJy5IbwSYdss001qP+e/Q6a0bRH/+Yua03rUPK9z4vOC2o
LT6aMwmID/Gj7nKFoSD6mQjhtHQNQIodtB6XhN1sQkUFSCXcZsHNSq2qhh2A0BZm
xG08EU4pKpwBBS+vh7+m2k0CgYEAt1gLzDkHNON+c5G96NqHatpRj8E8hqv3yynE
pCZql7awAEaXwFH+d+eFCmt7HO+l4MdYsbEIVQKJQHhTccFF/r4i1yYYOm24PYcX
JffetYvh104c2ZxfSEtcrRfh0gWjpi5X6w7sbP/WiJ7mFjdyFqvLPIN0yAOcs6Gc
5s591QECgYBEwAx0wTmEvMF22oeesZhEyX05lqfHnIT9j1/zcoWi7xGMTW6Iv25j
qJi9H7wmYfEp1Z24ePDoN5Rzh6LW4c2GwyOnBzleLEcm6gAczuOOhkpHtJ7xrLqD
JXtWE+8MXtsaP8s96zO/9o9kr1FO4tI5X0XdK44UqrKd0L/2EkubDg==
-----END RSA PRIVATE KEY-----
`;

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoaVRdiKA/2RmW7J1KHEQ
w6/uUwxYIBfNKGCxrbaQDUzVQvw/NS/y91N80J+HZFlr+tr8p5uTjyX1ZyoezSZp
drniMDIin39jVP6zjuGTERKD4OxbyCmRc2ppRPuuj5YXukUmlsuu0G6lq7u9C/yg
FXJj7PIT7f28aamyEiBFUgcUSUEEGQHTzv6YcsVaYiL0cVdndv6e+MTS3DoTqOTt
lthE6JMpFOD3XOILfdCdcXhFxDPNa4tG4h4OwGPbGlww2mKTQWKPFroIgN5esRrN
sWNHUWlfDDuLwpTSI6s3un8SAiKtG7fyMuCd7KuS3ietSwDqmAvoDc3pXGDSz1JC
BwIDAQAB
-----END PUBLIC KEY-----
`;

app.use(koaBody());
app.use(
  route.post("/login", async (ctx) => {
    const { username, password } = ctx.request.body;

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (rows.length === 0) {
      ctx.status = 401;
      ctx.body = { message: "Invalid username or password" };
      return;
    }
    const user = rows[0];

    await pool.query(`UPDATE users SET last_update = $1 WHERE id = $2`, [new Date(), user.id])

    ctx.body = {
      message: "login successfull",
      access_token: jwt.sign(
        {
          user: user.username,
          user_id: user.id,
        },
        privateKey,
        { algorithm: "RS256", expiresIn: "1h" }
      ),
    };
  })
);

app.use(async (ctx, next) => {
  if (ctx.path === "/graphql") {
    const token = ctx.request.headers["authorization"]?.split(" ")[1];
    try {
      jwt.verify(token, publicKey, { algorithms: ["RS256"] });
      const decoded = jwt.decode(token);
      ctx.state.user = decoded;
    } catch (err) {
      ctx.status = 401;
      ctx.body = { message: "Invalid token" };
      return;
    }
  }
  await next();
});


type User = {
  id: number;
  username: string;
  tokens: number;
  last_update: Date;
}
app.use(async (ctx, next) => {
  if (ctx.path === "/graphql") {
   const user_id = ctx.state.user.user_id;
    
   try {
      const userData = (await pool.query(`SELECT * FROM users WHERE id = ${user_id}`)).rows[0] as User ;

      if (userData.last_update !== null && userData.tokens < 10) { //If null, users request never break;
        const now = new Date();

        const diffMs = now.getTime() - userData.last_update.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        const tokens = userData.tokens + diffHours >= 10 ? 10 : userData.tokens + diffHours;

        if (tokens !== userData.tokens) {
          await pool.query(`UPDATE users SET tokens = $1, last_update = $2 WHERE id = $3`, [tokens, now, user_id]);
        }

        if (tokens === 0) {
          ctx.status = 429;
          ctx.body = {message: "Request limit exceeded"}
          return;
        }
      }
       
    }
    catch(error) {
      console.error(error);
      ctx.body = `Error `
      return;
    }


    await next();
  }
})


app.use(async(ctx, next) => {
  await next();

  if (Array.isArray(ctx.body?.errors) && ctx.body.errors.length > 0) {
    const userId = ctx.state.user.user_id;

    if (userId) {
      await pool.query(`UPDATE users SET tokens = tokens - 1 WHERE id = $1`, [userId]);
    }


  }
})

app.use(
  route.all(
    "/graphql",
   graphqlHTTP({schema, graphiql: true}),
    
  )
);


app.listen(3000);
