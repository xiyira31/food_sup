/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('model', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    short: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    created: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'model'
  });
};
