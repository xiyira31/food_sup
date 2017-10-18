/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    spec: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'type',
        key: 'id'
      }
    },
    shelf_life: {
      type: DataTypes.INTEGER(11),
      allowNull: true
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
    tableName: 'product'
  });
};
