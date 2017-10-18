/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('daily_price', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    price1: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    price2: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    price3: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    price4: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    price5: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    price6: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  }, {
    tableName: 'daily_price'
  });
};
