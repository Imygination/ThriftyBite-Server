const request = require("supertest");
const app = require("../app");
const { User, Food , Store , Order , FoodOrder } = require("../models");
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
      return Order.bulkCreate(
        [
          {
            "totalPrice": 15000,
            "UserId": 2 ,
            "status": "active"
          },
          {
            "totalPrice": 35000,
            "UserId": 1 ,
            "status": "active"
          },
          {
            "totalPrice": 80000,
            "UserId": 1 ,
            "status": "active"
          },
          {
            "totalPrice": 155000,
            "UserId": 2 ,
            "status": "active"
          },
        ],
        {
          ignoreDuplicates: true,
        }
      )
    })
    .then(()=>{
        return FoodOrder.bulkCreate(
            [
              {
                "OrderId": 1,
                "FoodId": 1,
                "foodPrice": 15000,
                "count": 2 ,
              },
              {
                "OrderId": 2,
                "FoodId": 2,
                "foodPrice": 18000,
                "count": 3 ,
              },
              {
                "OrderId": 3,
                "FoodId": 3,
                "foodPrice": 9000,
                "count": 1 ,
              },
              {
                "OrderId": 4,
                "FoodId": 4,
                "foodPrice": 16000,
                "count": 20 ,
              },
            ],
            {
              ignoreDuplicates: true,
            }
          )
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
        return Order.destroy({ truncate: true, cascade: true, restartIdentity: true })
    })
    .then(_ => {
      done();
    })
    .catch(err => {
      done(err);
    });
});

describe("GET /orders", () => {
  test("200 success GET orders", (done) => {
    request(app)
      .get("/orders")
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

  test("401 GET orders with invalid token", (done) => {
    request(app)
      .get("/orders")
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

  test("401 GET orders with without token", (done) => {
    request(app)
      .get("/orders")
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

  test("404 orders not Found", (done) => {
    request(app)
      .get("/orders")
      .set("access_token", validToken3)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Order not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("200 success GET orders by id", (done) => {
    request(app)
      .get("/orders/2")
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(body).toHaveProperty("totalPrice", expect.any(Number));
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("UserId", expect.any(Number));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("401 GET orders by id with different UserId", (done) => {
    request(app)
      .get("/orders/2")
      .set("access_token", validToken3)
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

  test("404 error GET orders by id Not Found", (done) => {
    request(app)
      .get("/orders/100")
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Order not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("401 GET orders by id with invalid token", (done) => {
    request(app)
      .get("/orders/1")
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

  test("401 GET orders by id with without token", (done) => {
    request(app)
      .get("/orders/1")
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

  test("201 success POST orders", (done) => {
    request(app)
      .post(`/orders`)
      .send([{
        "price": 80000,
        "foodId": 1,
        "foodPrice": 16000,
        "count": 20 ,
      }])
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(201);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("UserId", expect.any(Number));
        expect(body).toHaveProperty("status", "active");
        expect(body).toHaveProperty("totalPrice", expect.any(Number));
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("500 POST orders with empty Body", (done) => {
    request(app)
      .post(`/orders`)
      .send([{
        "foodId": 1,
        "foodPrice": 16000,
        "count": 20 ,
      }])
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(500);
        expect(body).toHaveProperty("message");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("401 POST orders with Invalid Token", (done) => {
    request(app)
      .post(`/orders`)
      .send([{
        "price": 80000,
        "foodId": 1,
        "foodPrice": 16000,
        "count": 20 ,
      }])
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

  test("401 POST orders without Token", (done) => {
    request(app)
      .post(`/orders`)
      .send([{
        "price": 80000,
        "foodId": 1,
        "foodPrice": 16000,
        "count": 20 ,
      }])
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

  test("200 success PATCH order", (done) => {
    request(app)
      .patch(`/orders/2`)
      .send({
        "status": "Inactive"
      })
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(body).toHaveProperty("message", "Order has been updated");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("400 PATCH order with empty status", (done) => {
    request(app)
      .patch(`/orders/2`)
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Status cannot be empty");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test("404 PATCH order not found ", (done) => {
    request(app)
      .patch(`/orders/100`)
      .send({
        "status": "Inactive"
      })
      .set("access_token", validToken)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Order not found");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  

});

