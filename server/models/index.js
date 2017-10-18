"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var config    = require(path.join(__dirname, '..', 'config', 'config.json')).mysql;
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db["product"].belongsTo(db["type"], {
  foreignKey: 'type',
  as: '_type'
})
db["product"].hasMany(db["product_producer"], {
  foreignKey: 'product',
  as: 'producers'
})
db["type"].hasMany(db["product"], {
  foreignKey: 'type',
  as: 'products'
})
db["product_producer"].belongsTo(db["producer"], {
  foreignKey: 'producer',
  as: '_producer'
})
db["order"].hasMany(db["order_detail"], {
  foreignKey: 'order',
  as: 'details'
})
db["order_detail"].belongsTo(db["order"], {
  foreignKey: 'order',
  as: '_order'
})
db["order"].belongsTo(db["school"], {
  foreignKey: 'school',
  as: '_school'
})
db["order_detail"].belongsTo(db["product"], {
  foreignKey: 'product',
  as: '_product'
})
db["order_detail"].belongsTo(db["producer"], {
  foreignKey: 'producer',
  as: '_producer'
})
db['order_detail'].belongsTo(db['print_order'], {
  foreignKey: 'print_order',
  as: '_print_order'
})
db["print_order"].hasMany(db["order_detail"], {
  foreignKey: 'print_order',
  as: 'details'
})
db["print_order"].belongsTo(db["order"], {
  foreignKey: 'order',
  as: '_order'
})
db["print_order"].belongsTo(db["company"], {
  foreignKey: 'company',
  as: '_company'
})
db["daily_price"].belongsTo(db["product"], {
  foreignKey: 'product',
  as: '_product'
})
db["product"].hasMany(db["daily_price"], {
  foreignKey: 'product',
  as: 'prices'
})
db["role"].hasMany(db["permission"], {
  foreignKey: 'role',
  as: 'permissions'
})
db["user"].belongsTo(db["role"], {
  foreignKey: 'role',
  as: '_role'
})


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
