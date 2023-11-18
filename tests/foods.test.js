const request = require("supertest");
const app = require("../app");
const { User, Food , Store } = require("../models");
const { signToken } = require("../helpers/jwt");

let validToken, validToken2, invalidToken ,validToken3, invalidToken2
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

const userTest4 = {
  email: "user.test4@mail.com",
  password: "usertest4",
  username: "User Test4",
  phoneNumber:"0819 5644 2334",
  role:"user"
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
            "name": "User 2 toko ",
            "address": "Jakarta Timur",
            "location": "POINT(107.5925576773082 -6.940669415817259)",
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
      return Food.bulkCreate(
        [
          {
            "name": "Ikan Goreng",
            "imageUrl": "gambar ikan",
            "description": "Ikan Sarden dimasak goreng abis",
            "UserId": 1 ,
            "StoreId": 1,
            "price": 20000,
            "stock": 32,
          },
          {
            "name": "Mie Goreng",
            "imageUrl": "Gambar Mie",
            "description": "Produk indonesia paling mantap",
            "UserId": 1,
            "StoreId": 2,
            "price": 5000,
            "stock": 80,
          },
          {
            "name": "Steak Ayam",
            "imageUrl": "Gambar Steak",
            "description": "Daging di goreng diatas arang",
            "UserId": 2 ,
            "StoreId": 1,
            "price": 67000,
            "stock": 15,
          },
          {
            "name": "Sushi",
            "imageUrl": "Gambar Sushi",
            "description": "Makanan jepang nasi dibungkus rumput laut",
            "UserId": 2 ,
            "StoreId": 2,
            "price": 44000,
            "stock": 24,
          }
        ],
        {
          ignoreDuplicates: true,
        }
      );
    })
    .then(() => {
      return User.create(userTest4)
    })
    .then((registeredUser4) => {
      invalidToken2 = signToken({
        id: registeredUser4.id,
        email: registeredUser4.email,
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
        return Food.destroy({ truncate: true, cascade: true, restartIdentity: true })
      })
    .then(_ => {
      done();
    })
    .catch(err => {
      done(err);
    });
});

describe("GET /foods", () => {
  test("200 success GET foods", (done) => {
    request(app)
      .get("/foods")
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

  test("200 success GET foods by id", (done) => {
    request(app)
      .get("/foods/1")
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(typeof body).toBe('object');
        expect(body).toHaveProperty("Store", expect.any(Object));
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("UserId", expect.any(Number));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("404 error GET food by id Not Found", (done) => {
    request(app)
      .get("/foods/100")
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Food not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("201 success POST foods", (done) => {
    request(app)
      .post(`/foods`)
      .send({
        "name": "Nasi Goreng",
        "imageUrl": "Gambar Nasi Goreng",
        "description": "nasi di Goreng",
        "UserId": 1 ,
        "StoreId": 1,
        "price": 23000,
        "stock": 15,
        })
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(201);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("UserId", expect.any(Number));
        expect(body).toHaveProperty("StoreId", expect.any(Number));
        expect(body).toHaveProperty("name", "Nasi Goreng");
        expect(body).toHaveProperty("price", expect.any(Number));
        expect(body).toHaveProperty("stock", expect.any(Number));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("400 POST foods with empty body", (done) => {
    request(app)
      .post(`/foods`)
      .send({
        "imageUrl": "Gambar Nasi Goreng",
        "description": "nasi di Goreng",
        "UserId": 1 ,
        "StoreId": 1,
        "price": 23000,
        "stock": 15,
        })
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Name cannot be empty");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("401 POST foods with invalid token", (done) => {
    request(app)
      .post(`/foods`)
      .send({
        "name": "Nasi Goreng",
        "imageUrl": "Gambar Nasi Goreng",
        "description": "nasi di Goreng",
        "UserId": 1 ,
        "StoreId": 1,
        "price": 23000,
        "stock": 15,
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

  test("401 POST foods without token", (done) => {
    request(app)
      .post(`/foods`)
      .send({
        "name": "Nasi Goreng",
        "imageUrl": "Gambar Nasi Goreng",
        "description": "nasi di Goreng",
        "UserId": 1 ,
        "StoreId": 1,
        "price": 23000,
        "stock": 15,
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

  test("401 POST foods with unauthorized token", (done) => {
    request(app)
      .post(`/foods`)
      .send({
        "name": "Nasi Goreng",
        "imageUrl": "Gambar Nasi Goreng",
        "description": "nasi di Goreng",
        "UserId": 4 ,
        "StoreId": 1,
        "price": 23000,
        "stock": 15,
        })
        .set("access_token", invalidToken2)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(403);
        expect(body).toHaveProperty("message", "You are not authorized");
        done()
      })
      .catch((err) => {
        done(err);
      });
  });

});

