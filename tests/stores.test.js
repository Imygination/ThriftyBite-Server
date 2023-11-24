const request = require("supertest");
const app = require("../app");
const { User, Store } = require("../models");
const { signToken } = require("../helpers/jwt");

let validToken, validToken2, invalidToken ,validToken3
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

const userTest3 = {
  email: "user.test3@mail.com",
  password: "usertest3",
  username: "User Test3",
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
      return User.create(userTest3)
    })
    .then((registeredUser3) => {
      validToken3 = signToken({
        id: registeredUser3.id,
        email: registeredUser3.email,
      });
    })
    .then(()=>{
      done()
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
  test("200 success GET stores", (done) => {
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

  test("200 success GET stores by id", (done) => {
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

  test("404 error GET store by id Not Found", (done) => {
    request(app)
      .get("/stores/100")
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Store not found");
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

  test("400 POST store with empty body", (done) => {
    request(app)
      .post(`/stores`)
      .send({
        "address": "Jakarta Utara",
        "longitude": 107.5904275402039,
        "latitude": -6.9439994342171225,
        "UserId": 1
        })
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(400);
        expect(body).toHaveProperty("message","Name cannot be empty");
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
        "longitude": 107.5904275402039,
        "latitude": -6.9439994342171225,
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
        "longitude": 107.5904275402039,
        "latitude": -6.9439994342171225,
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

  test("400 POST store Database error", (done) => {
    request(app)
      .post(`/stores`)
      .send({
        "name": "Test for Post",
        "address": "Jakarta Utara",
        "longitude": "test longitude",
        "latitude": "test latitude",
        "UserId": 1
        })
        .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(400);
        expect(body).toHaveProperty("message");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("200 success GET stores by Logged in User", (done) => {
    request(app)
      .get("/stores/users")
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("UserId", expect.any(Number));
        expect(body).toHaveProperty("name", expect.any(String));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("404 failed GET stores by Logged in User", (done) => {
    request(app)
      .get("/stores/users")
      .set("access_token", validToken3)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Store not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("200 success GET stores location", (done) => {
    request(app)
      .get(`/stores/location`)
      .query({
        "longitude": 107.5904275402039,
        "latitude": -6.9439994342171225,
        })
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(Array.isArray(body)).toBeTruthy();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("404 GET stores location with empty body", (done) => {
    request(app)
      .get(`/stores/location`)
      .query({
        "longitude": 107.5904275402039,
        })
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Longitude and Latitude cannot be empty");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});

