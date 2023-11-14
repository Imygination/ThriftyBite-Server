# ThriftyBite-server Documentation

- [ThriftyBite-server Documentation](#thriftybite-server-documentation)
    - [POST /register](#post-register)
    - [POST /login](#post-login)
    - [POST /stores](#post-stores)
    - [GET /stores/:id](#get-storesid)
    - [POST /foods](#post-foods)
    - [GET /foods](#get-foods)
    - [GET /foods/:id](#get-foodsid)
  - [Work in Progress](#work-in-progress)
    - [POST /orders](#post-orders)
    - [PATCH /orders](#patch-orders)

### POST /register

> To create a new account

-   request

```json
{
    "username": "string", //required
    "email": "string", //required
    "password": "string", //required
    "phoneNumber": "string", //required
    "role": "string" //required ["seller", "user"]
}
```

-   headers

```json
    not needed
```

-   response (201)

```json
{
    "username": "string",
    "email": "string",
    "phoneNumber": "string",
    "role": "string"
}
```

### POST /login

> To login with exsisting account

-   request

```json
{
    "email": "string", //required
    "password": "string" //required
}
```

-   headers

```json
    not needed
```

-   response (200)

```json
{
    "access_token": "string"
}
```

### POST /stores

> To create a new store

-   request

```json
{
    "name": "string", //required
    "address": "string", //required
    "latitude": "string", //required
    "longitude": "string", //required
    "UserId": "string" //required
}
```

-   headers

```json
{
    "access_token": "string"
}
```

-   response (201)

```json
{
    "name": "string",
    "address": "string",
    "name": "string",
    "location": "Geometry(Point)"
}
```

### GET /stores/:id

> To get store by id (include foods)

-   request params

```json
{
    "id": "integer"
}
```

-   headers

```
    not needed
```

-   response (200)

```json
{
    "name": "string",
    "address": "string",
    "name": "string",
    "location": "Geometry(Point)",
    "Foods": [
        {
            "name": "string",
            "imageUrl": "string",
            "price": "integer"
        },
        ...,
    ]
}
```

### POST /foods

> To create a food

-   request

```json
{
    "name": "string", //required
    "imageUrl": "string", //required
    "description": "string", //required
    "price": "integer", //required
    "stock": "integer", //required
    "UserId": "integer",
    "StoreId": "integer"
}
```

-   headers

```json
{
    "access_token": "string"
}
```

-   response (201)

```json
{
    "name": "string",
    "imageUrl": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "UserId": "integer",
    "StoreId": "integer"
}
```

### GET /foods

> To get all foods

-   headers

```
{
    not needed
}
```

-   response (200)

```json
[
    {
        "name": "string",
        "imageUrl": "string",
        "price": "integer",
        "UserId": "integer",
        "StoreId": "integer",
        "Store": {
            "location": "Geometry(Point)"
        }
    },
    ...,
]
```

### GET /foods/:id

> To get food by id

-   request params

```json
{
    "id": "integer"
}
```

-   headers

```
{
    not needed
}
```

-   response (200)

```json
{
    "name": "string",
    "imageUrl": "string",
    "description": "string",
    "price": "integer",
    "stock": "integer",
    "UserId": "integer",
    "StoreId": "integer",
    "Store": {
        "name": "string",
        "address": "string",
        "location": "Geometry(Point)"
    }
}
```

---

## Work in Progress

### POST /orders

> To create an order

-   request

```json
{
    "Order": {
        "UserId": "integer",
        "status": "string" // [active, finished] default: active
    },
    "FoodOrders": [
        {
            "FoodId": "integer",
            "OrderId": "integer",
            "count": "integer"
        },
        ...,
    ]
}
```

-   headers

```json
{
    "access_token": "string"
}
```

-   response (201)

```json
{
    "message": "Order created"
}
```

### PATCH /orders

> To edit an order

-   request

```json
{
    "Order": {
        "status": "string" // [active, finished]
    }
}
```

-   headers

```json
{
    "access_token": "string"
}
```

-   response (200)

```json
{
    "message": "Order has been updated"
}
```
