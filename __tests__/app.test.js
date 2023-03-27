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

describe("Non existant endpoints.", () => {
  it("404: Returns an error if trying to access a nonexistant endpoint.", () => {
    return request(app)
      .get("/not-an-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found.");
      });
  });
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

describe("GET /api/reviews/:review_id", () => {
  it("200: Returns a review object with the correct properties.", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { reviewObj } = body;
        expect(reviewObj).toMatchObject({
          review_id: 1,
          title: "Agricola",
          review_body: "Farmyard fun!",
          designer: "Uwe Rosenberg",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          votes: 1,
          category: "euro game",
          owner: "mallionaire",
          created_at: "2021-01-18T10:00:20.514Z",
        });
      });
  });
  it("400: should return bad request when endpoint has an id which does not exist.", () => {
    return request(app)
      .get("/api/reviews/:monkey")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });
  });
});
