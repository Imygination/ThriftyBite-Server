'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FoodOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FoodOrder.belongsTo(models.Food, {foreignKey: "FoodId"})
      FoodOrder.belongsTo(models.Order, {foreignKey: "OrderId"})
    }
  }
  FoodOrder.init({
    FoodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "FoodId cannot be empty"
        }
      }
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "OrderId cannot be empty"
        }
      }
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "count cannot be empty"
        }
      }
    },
    foodPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "foodPrice cannot be empty"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'FoodOrder',
  });
  return FoodOrder;
};