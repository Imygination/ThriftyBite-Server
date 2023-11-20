function errorHandler(error, request, response, next) {
  switch (error.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      response.status(400).json({ message: error.errors[0].message });
      break
    case "EmailNull":
      response.status(400).json({ message: "Email is required" });
      break
    case "PasswordNull":
      response.status(400).json({ message: "Password is required" });
      break;
    case "CartEmpty":
      response.status(400).json({ message: "Cart cannot be empty" });
      break;
    case "StatusEmpty":
      response.status(400).json({ message: "Status cannot be empty" });
      break;
    case "LongLatEmpty":
      response.status(400).json({ message: "Longitude and Latitude cannot be empty" });
      break;
    case "PaymentFailed":
      response.status(400).json({ message: "Payment failed" });
      break;
    case "OrderFailed":
      response.status(400).json({ message: "Order failed" });
      break;
    case "UserNotFound":
    case "PasswordInvalid":
      response.status(401).json({ message: "Invalid email or password" });
      break;
    case "Unauthenticated":
    case "JsonWebTokenError":
      response.status(401).json({ message: "Unauthenticated" });
      break;
    case "Forbidden":
      response.status(403).json({ message: "You are not authorized" });
      break;
    case "OrderNotFound":
      response.status(404).json({ message: "Order not found" });
      break;
    case "FoodNotFound":
      response.status(404).json({ message: "Food not found" });
      break;
    case "StoreNotFound":
      response.status(404).json({ message: "Store not found" });
      break;
    default:
      console.log(error)
      response.status(500).json({ message: "Internal server error" });
      break;
  }
}

module.exports = errorHandler;
