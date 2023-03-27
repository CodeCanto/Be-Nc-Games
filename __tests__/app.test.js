const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const {
  categoryData,
  reviewData,
  userData,
  commentData,
} = require("../db/data/test-data/index.js");
const request = require("supertest");
const { app, server } = require("../app.js");

beforeEach(() => {
  return seed({ categoryData, reviewData, userData, commentData });
});

afterAll(() => {
  server.close();
  return db.end();
});

describe("GET /api", () => {
  it("200: returns, Server online.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Server online.");
      });
  });
});

describe("GET /api/categories", () => {
  it("200: Returns an array of category objects which have the properties slug and description.", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        const { categoryObj } = body;
        categoryObj.forEach((categoryObj) => {
          expect(categoryObj).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
