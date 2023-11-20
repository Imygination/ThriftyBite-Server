# ThriftyBite-server Documentation

- [ThriftyBite-server Documentation](#thriftybite-server-documentation)
    - [POST /register](#post-register)
    - [POST /login](#post-login)
    - [POST /stores](#post-stores)
    - [GET /stores](#get-stores)
    - [GET /stores/users](#get-storesusers)
    - [GET /stores/location](#get-storeslocation)
    - [GET /stores/:id](#get-storesid)
    - [POST /foods](#post-foods)
    - [GET /foods](#get-foods)
    - [GET /foods/:id](#get-foodsid)
    - [POST /orders](#post-orders)
    - [GET /orders](#get-orders)
    - [POST /orders/payment](#post-orderspayment)
    - [GET /orders/:id](#get-ordersid)

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
    "latitude": "float", //required
    "longitude": "float", //required
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
### GET /stores

> To get all stores

-   headers

```
    not needed
```

-   response (200)

```json
[
    {
        "name": "string",
        "address": "string",
        "name": "string",
        "UserId": "integer",
        "location": "Geometry(Point)"
    },
    ...,
]
```

### GET /stores/users

> To get a store by logged in user (seller)

-   headers

```json
{
    "access_token": "string"
}
```

-   response (200)

```json
{
    "name": "string",
    "address": "string",
    "name": "string",
    "UserId": "integer",
    "location": "Geometry(Point)",
    "Food": [
        {
            "id": "integer",
            "name": "string",
            "imageUrl": "string",
            "description": "string",
            "price": "integer",
            "stock": "integer",
            "UserId": "integer",
            "StoreId": "integer",
        },
        ...,
    ]
}

```
### GET /stores/location

> To get a store by location proximity

-   request query

```json
{
    "longitude": "float",
    "latitude": "float"
}
```

-   response (200)

```json
{
    "id": "integer",
    "name": "string",
    "address": "string",
    "name": "string",
    "UserId": "integer",
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
            "id": "integer",
            "name": "string",
            "imageUrl": "string",
            "description": "string",
            "price": "integer",
            "stock": "integer",
            "UserId": "integer",
            "StoreId": "integer",
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


### POST /orders

> To create an order

-   request

```json
//array
[ 
    {
        "count": "integer",
        "foodId": "integer", //ini emang f kecil
        "imageUrl": "string",
        "itemPrice": "integer",
        "name": "string",
        "price": "integer"
    },
    ...,
]
```

-   headers

```json
{
    "access_token": "string"
}
```

-   response (201)

```json
//midtrans
{
    "redirect_url": "string",
    "token": "string"
}
```

### GET /orders

> To get all order by logged in users


-   headers

```json
{
    "access_token": "string"
}
```

-   response (201)

```json
[
    {
        "id": "integer",
        "UserId": "integer",
        "status": "string",
        "totalPrice": "integer",
        "FoodOrders": [
            {
                "id": "integer",
                "FoodId": "integer",
                "OrderId": "integer",
                "count": "integer",
                "foodPrice": "integer",
                "Food": {
                    "name": "string"
                }
            },
            ...,
        ]
    },
    ...,
]
```

### POST /orders/payment

> To edit an order

-   request

```json
//midtrans
```

-   headers

```
    not needed
```

-   response (200)

```json
{
    "message": "Order has been updated"
}
```

### GET /orders/:id

> To get order by id

-   request params

```json
{
    "id": "integer"
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
    "id": "integer",
    "UserId": "integer",
    "status": "string",
    "totalPrice": "integer",
    "FoodOrders": [
        {
            "id": "integer",
            "FoodId": "integer",
            "OrderId": "integer",
            "count": "integer",
            "foodPrice": "integer",
            "Food": {
                "name": "string"
            }
        },
        ...,
    ]
}
```
