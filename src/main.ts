import Koa from "koa";
import route from "koa-route";
import jwt from "jsonwebtoken";
import { koaBody } from "koa-body";
import { graphqlHTTP } from "koa-graphql";
import schema from "./adapters/graphql/schema.js";
import { LoginUseCase } from "./application/loginUseCase.js";
import { RetrieveNumberOfTokensValidated } from "./application/retrieveNumberOfTokensValidated.js";
import { SubtractNumberOfTokens } from "./application/subtractNumberOfTokens.js";
import "dotenv";

const app = new Koa();
const loginUseCase = new LoginUseCase();
const numberOfTokens = new RetrieveNumberOfTokensValidated();
const subtractNumberOfTokens = new SubtractNumberOfTokens();

app.use(koaBody());
app.use(
  route.post("/login", async (ctx) => {
    const { username, password } = ctx.request.body;
    try {
      return loginUseCase.handle(username, password);
    } catch (error) {
      ctx.status = 401;
      ctx.body = { message: "Invalid username or password" };
    }
  })
);

app.use(async (ctx, next) => {
  if (ctx.path === "/graphql") {
    const token = ctx.request.headers["authorization"]?.split(" ")[1];
    try {
      jwt.verify(token, process.env.PUBLIC_KEY, { algorithms: ["RS256"] });
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

app.use(async (ctx, next) => {
  if (ctx.path === "/graphql") {
    const tokens = await numberOfTokens.handle(ctx.state.user.user_id);

    if (tokens === 0) {
      ctx.status = 429;
      ctx.body = { message: "Request limit exceeded" };
      return;
    }

    await next();
  }
});


app.use(async (ctx, next) => {
  await next();

  if (Array.isArray(ctx.body?.errors) && ctx.body.errors.length > 0) {
    if (ctx.state.user.user_id) {
      await subtractNumberOfTokens.handle(ctx.state.user.user_id);
    }
  }
});

app.use(route.all("/graphql", graphqlHTTP({ schema, graphiql: true })));
