const request = require("supertest");
const app = require("./index");

describe("Pruebas básicas de la API", () => {
  test("Debe responder con un código 200", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  test("Debe responder con un código 404", async () => {
    const response = await request(app).get("/ruta-que-no-existe");
    expect(response.statusCode).toBe(404);
  });
});
