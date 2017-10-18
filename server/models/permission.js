/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permission', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    model: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'model',
        key: 'id'
      }
    },
    allowed: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    create: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    delete: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    read: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    modify: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    created: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'permission'
  });
};
