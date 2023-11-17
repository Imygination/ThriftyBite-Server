const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models')
const { queryInterface } = sequelize

const user1 = {
    email: "user.test1@mail.com",
    username: "User Test",
    password: "usertest",
    phoneNumber:"0819 5644 2993",
    role:"seller"
};

beforeAll(async () => {
  await request(app)
      .post("/register")
      .send(user1)
})

afterAll((done) => {
  queryInterface
    .bulkDelete('Users', null, {cascade: true, restartIdentity: true, truncate: true})
    .then(() => {
      done();
    })
    .catch(err => {
      done(err);
    })
});

describe("User Routes Test", () => {
  describe("POST /register - create new user", () => {
    test("201 Success register - should create new User", (done) => {
      request(app)
        .post("/register")
        .send({
            email: "user.test2@mail.com",
            username: "User Test",
            password: "usertest",
            phoneNumber:"0819 5644 2993",
            role:"seller"
          })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body).toHaveProperty("email", "user.test2@mail.com");
          return done();
        });
        });

    test("400 Failed register - should return error if email is null", (done) => {
      request(app)
        .post("/register")
        .send({
            username: "User Test",
            password: "usertest",
            phoneNumber:"0819 5644 2993",
            role:"seller",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email cannot be empty");
          return done();
        });
    });

    test("400 Failed register - should return error if email is already exists", (done) => {
      request(app)
        .post("/register")
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Email must be unique");
          return done();
        });
    });

    test("400 Failed register - should return error if wrong email format", (done) => {
      request(app)
        .post("/register")
        .send({
            email: "user.test",
            username: "User Test",
            password: "usertest",
            phoneNumber:"0819 5644 2993",
            role:"seller",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty("message", "Invalid email format");
          return done();
        });
    });
  });

  describe("POST /login - user login", () => {
    test("200 Success login - should return access_token", (done) => {
      request(app)
        .post("/login")
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toHaveProperty("access_token", expect.any(String));
          return done();
        });
    });

    test("401 Failed login - should return error", (done) => {
      request(app)
        .post("/login")
        .send({
          email: "hello@mail.com",
          password: "salahpassword",
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toHaveProperty("message", "Invalid email or password");
          return done();
        });
    });
  });
});
