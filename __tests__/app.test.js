const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const {
  categoryData,
  reviewData,
  userData,
  commentData,
} = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => {
  return seed({ categoryData, reviewData, userData, commentData });
});

afterAll(() => {
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

describe("GET /api/reviews:review_id", () => {
  it("200: Returns a review object with the correct properties.", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { reviewObj } = body;
        expect(reviewObj).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
});
