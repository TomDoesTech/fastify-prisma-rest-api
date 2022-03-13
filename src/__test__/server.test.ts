import { test } from "tap";
import buildServer from "../server";

test("requests the `/healthcheck` route", async (t) => {
  const fastify = buildServer();

  t.teardown(() => {
    fastify.close();
  });

  const response = await fastify.inject({
    method: "GET",
    url: "/healthcheck",
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), { status: "OK" });
});
