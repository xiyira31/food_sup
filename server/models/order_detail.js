/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_detail', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'order',
        key: 'id'
      }
    },
    print_order: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'print_order',
        key: 'id'
      }
    },
    product: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    producer: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'producer',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    cost: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    num: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    fake_num: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    produce_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    user: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    created: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'order_detail'
  });
};
