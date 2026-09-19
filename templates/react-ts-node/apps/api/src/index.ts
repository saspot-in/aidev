import { buildApp } from "./app";

const port = Number(process.env.PORT ?? 3001);
const app = buildApp();

app.listen({ port, host: "127.0.0.1" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
