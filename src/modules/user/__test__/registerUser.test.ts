import faker from "@faker-js/faker";
import { test } from "tap";
import { ImportMock } from "ts-mock-imports";
import buildServer from "../../../server";
import prisma from "../../../utils/prisma";
import * as userService from "../user.service";

test("POST `/api/users` - create user successfully with mock createUser", async (t) => {
  const name = faker.name.findName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const id = Math.floor(Math.random() * 1_000);

  const fastify = buildServer();

  const stub = ImportMock.mockFunction(userService, "createUser", {
    name,
    email,
    id,
  });

  t.teardown(() => {
    fastify.close();
    stub.restore();
  });

  const response = await fastify.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      email,
      password,
      name,
    },
  });

  t.equal(response.statusCode, 201);
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");

  const json = response.json();

  t.equal(json.name, name);
  t.equal(json.email, email);
  t.equal(json.id, id);
});
test("POST `/api/users` - create user successfully with test database", async (t) => {
  const name = faker.name.findName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  const fastify = buildServer();

  t.teardown(async () => {
    fastify.close();
    await prisma.user.deleteMany({});
  });

  const response = await fastify.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      email,
      password,
      name,
    },
  });

  t.equal(response.statusCode, 201);
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");

  const json = response.json();

  t.equal(json.name, name);
  t.equal(json.email, email);
  t.type(json.id, "number");
});
test("POST `/api/users` - fail to create a user", async (t) => {
  const name = faker.name.findName();
  const password = faker.internet.password();

  const fastify = buildServer();

  t.teardown(async () => {
    fastify.close();
    await prisma.user.deleteMany({});
  });

  const response = await fastify.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      password,
      name,
    },
  });

  t.equal(response.statusCode, 400);

  const json = response.json();

  t.equal(json.message, "body should have required property 'email'");
});
