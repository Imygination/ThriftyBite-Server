const request = require("supertest");
const app = require("../app");
const { User, Store } = require("../models");
const { signToken } = require("../helpers/jwt");

let validToken, validToken2, invalidToken;
const userTest1 = {
    email: "user.test1@mail.com",
    password: "usertest1",
    username: "User Test1",
    phoneNumber:"0819 5644 2993",
    role:"seller"
};

const userTest2 = {
  email: "user.test2@mail.com",
  password: "usertest2",
  username: "User Test2",
  phoneNumber:"0819 5644 2334",
  role:"seller"
};

beforeAll((done) => {
  User.create(userTest1)
    .then((registeredUser) => {
      validToken = signToken({
        id: registeredUser.id,
        email: registeredUser.email,
      });
      invalidToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9.gShAB2qaCUjlnvNuM1MBWfE";
      return User.create(userTest2);
    })
    .then((registeredUser2) => {
      validToken2 = signToken({
        id: registeredUser2.id,
        email: registeredUser2.email,
      });
      return Store.bulkCreate(
        [
          {
            "name": "User 1 toko",
            "address": "Jakarta Utara",
            "location": "POINT(107.5904275402039 -6.9439994342171225)",
            "UserId": 1
          },
          {
            "name": "User 1 toko 2",
            "address": "Jakarta Selatan",
            "location": "POINT(107.59278847659893 -6.942981263106864)",
            "UserId": 1
          },
          {
            "name": "User 2 toko ",
            "address": "Jakarta Timur",
            "location": "POINT(107.5925576773082 -6.940669415817259)",
            "UserId": 2
          },
          {
            "name": "User 2 toko 2",
            "address": "Jakarta Barat",
            "location": "POINT(107.59422277037818 -6.937911900280693)",
            "UserId": 2
          }
        ],
        {
          ignoreDuplicates: true,
        }
      );
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll(done => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then(_ => {
      return Store.destroy({ truncate: true, cascade: true, restartIdentity: true })
    })
    .then(_ => {
      done();
    })
    .catch(err => {
      done(err);
    });
});

describe("GET /stores", () => {
  test("200 success get stores", (done) => {
    request(app)
      .get("/stores")
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("200 success get stores by id", (done) => {
    request(app)
      .get("/stores/1")
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(typeof body).toBe('object');
        expect(body).toHaveProperty("Food", expect.any(Array));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("201 success POST stores", (done) => {
    request(app)
      .post(`/stores`)
      .send({
        "name": "Test for Post",
        "address": "Jakarta Utara",
        "longitude": 107.5904275402039,
        "latitude": -6.9439994342171225,
        "UserId": 1
        })
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(201);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("UserId", expect.any(Number));
        expect(body).toHaveProperty("name", "Test for Post");
        expect(body).toHaveProperty("location", {"coordinates": [107.5904275402039, -6.9439994342171225], "type": "Point"});
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("401 POST store with invalid token", (done) => {
    request(app)
      .post(`/stores`)
      .send({
        "name": "Test for Post",
        "address": "Jakarta Utara",
        "location": "POINT(107.5904275402039 -6.9439994342171225)",
        "UserId": 1
        })
      .set("access_token", invalidToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("401 POST store without token", (done) => {
    request(app)
      .post(`/stores`)
      .send({
        "name": "Test for Post",
        "address": "Jakarta Utara",
        "location": "POINT(107.5904275402039 -6.9439994342171225)",
        "UserId": 1
        })
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Unauthenticated");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });


});

