/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_producer', {
    product: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    producer: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    valid: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    created: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'product_producer'
  });
};
