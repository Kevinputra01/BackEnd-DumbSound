'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      payment.belongsTo(models.user, {
        as: "userId",
        foreignKey: {
          name: "id_user",
        },
      });
    }
  }
  payment.init({
    startDate: DataTypes.DATE,
    dueDate: DataTypes.DATE,
    id_user: DataTypes.INTEGER,
    attache: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payment',
  });
  return payment;
};