/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('type', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    father: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    created: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    valid: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    orderBy: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'type'
  });
};
