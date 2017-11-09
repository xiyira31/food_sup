/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('print_order', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'order',
        key: 'id'
      }
    },
    printNo: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    orderType: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    company: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'company',
        key: 'id'
      }
    },
    orderStyle: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    carNum: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    deliverPerson: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    checked: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'print_order'
  }, {
    indexes: [
      // Create a unique index on poem
      {
        unique: true,
        fields: ['order', 'printNo']
      }
    ]
  });
};
