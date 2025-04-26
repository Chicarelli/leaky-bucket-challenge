import Koa from "koa";
import route from "koa-route";

const app = new Koa();

app.use(
  route.post("/login", async (ctx, next) => {
    ctx.body = { message: "login successfull" };
  })
);

app.use(route.get("/route1", async (ctx, next) => {
    ctx.body = {message: "consulted route1 succesfully"}
}))

app.use(route.get("/route2", async (ctx, next) => {
    ctx.body = {message: "consulted route2 succesfully"}
}))

app.listen(3000);
