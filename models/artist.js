'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      artist.hasMany(models.music, {
        foreignKey: {
          name: "id_artist",
        },
      });
    }
  }
  artist.init({
    name: DataTypes.STRING,
    old: DataTypes.INTEGER,
    tipe: DataTypes.STRING,
    career: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'artist',
  });
  return artist;
};