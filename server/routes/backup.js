const express = require('express');
const path = require('path');
const moment = require('moment')
const router  = express.Router();
const config    = require(path.join(__dirname, '..', 'config', 'config.json')).mysql;

router.post('/', function (req, res) {
  const mysqlDump = require('mysqldump')
  const now = moment()
  const fileName = path.join('.', 'backup', now.format('YYYY-MM-DD-HH-mm-ss') + '.sql')
  mysqlDump({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    dest: fileName // destination file
  },function(err){
    res.download(fileName)
  })
})

module.exports = router