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
  it("400: should return bad request when endpoint has an invalid id.", () => {
    return request(app)
      .get("/api/reviews/:monkey")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });
  });
  it("404: should return a not found if given a valid id which does not exist.", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/reviews", () => {
  it("200: returns an array of review objects with the correct properties sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
          const { reviews } = body;
          expect(reviews).toBeSorted("created_at");
        });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("200: should respond with an array of comments for the given review_id of which each comment has the correct properties in descending order of date.", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((review) => {
          expect(review).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
          const { comments } = body;
          expect(comments).toBeSorted("created_at", {
            descending: true,
          });
        });
      });
  });
  it("400: should return bad request when endpoint has an invalid id.", () => {
    return request(app)
      .get("/api/reviews/monkey/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });
  });
  it("404: should return a not found if given a valid id which does not exist.", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  it("200: should return an empty array if a review exists but has no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  it("201: should accept a request body with correct properties and respond with the posted comment", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "bainesface", body: "Time to tickle." })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual("Time to tickle.");
      });
  });
  it("201: should ignore unnecessary properties on the request body and respond with the posted comment", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({
        username: "mallionaire",
        body: "Who wants to be a millionaire?",
        animal: "Rhino",
        Biscuits: "Bourbon",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual("Who wants to be a millionaire?");
      });
  });
  it("404: should return Invalid Key if given a valid id which does not exist.", () => {
    return request(app)
      .post("/api/reviews/999/comments")
      .send({ username: "bainesface", body: "Time to tickle." })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid key");
      });
  });
  it("400: should return Bad request when endpoint has an invalid id.", () => {
    return request(app)
      .post("/api/reviews/monkey/comments")
      .send({ username: "bainesface", body: "Time to tickle." })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });
  });
  it("400: should return Bad request if invalid input body.", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ body: "bainesface" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });
  });
});

describe("PATCH: /api/reviews/:review_id ", () => {
  it("200: should add to the votes at the review with the review id and return the updated review.", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_id: 2,
          review_img_url:
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 6,
        });
      });
  });
  it("400: should return Bad request if invalid input body.", () => {
    const request1 = request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: "These votes were brought with bribes." })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });

    const request2 = request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 1.5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });

    return Promise.all([request1, request2]);
  });
  it("404: should return Invalid key when endpoint has a valid id which does not exist.", () => {
    return request(app)
      .patch("/api/reviews/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Invalid key`);
      });
  });
  it("400: should return Bad request when endpoint has an invalid id.", () => {
    return request(app)
      .patch("/api/reviews/monkey")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });
  });
  it("200: should ignore unnecessary properties on the request body and respond with the patched review object.", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 1, bad_vote: 2, monkey_vote: 4 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_id: 2,
          review_img_url:
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 6,
        });
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  it("204: should delete a comment at the specific id and respond with a 204 no content status.", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  it("404: should return Invalid key if passed valid id which does not exist.  ", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Invalid key`);
      });
  });
  it("400: should return Bad Request if passed an invalid id", () => {
    return request(app)
      .delete("/api/comments/monkey")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Bad request`);
      });
  });
});

describe("GET: /api/users", () => {
  it("should respond with an array of user objects with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET: api/reviews (queries)", () => {
  it("should return all reviews with matching queried category", () => {
    return request(app)
      .get("/api/reviews/?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toEqual([
          {
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_id: 2,
            review_img_url:
              "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 5,
          },
        ]);
      });
  });
  it("should sort correctly by input sort_by value", () => {
    return request(app)
      .get("/api/reviews?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSorted("created_at");
      });
  });
  it("should sort correctly by input order value", () => {
    return request(app)
      .get("/api/reviews?order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSorted(`ASC`);
      });
  });
  it("should default to sort by created_at", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSorted("created_at");
      });
  });
  it("should default to desc", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSorted("DESC");
      });
  });
  it("400: rejects trying to sort by an invalid value", () => {
    return request(app)
      .get("/api/reviews?sort_by=DROP")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`DROP is not a valid sort_by value.`);
      });
  });
  it("400: rejects trying to order by an invalid value", () => {
    return request(app)
      .get("/api/reviews?order=MONKEY")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`MONKEY is not a valid order value.`);
      });
  });
  it("404: should return if a category does not exist", () => {
    return request(app)
      .get("/api/reviews?category=DonutKing")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Sorry we can't find that category.`);
      });
  });
  it("200: should return for valid category despite no reviews being associated with that category", () => {
    return request(app)
      .get("/api/reviews?category=children''s games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toEqual([]);
      });
  });
});
