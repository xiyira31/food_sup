const express = require('express');
const router  = express.Router();
const path = require('path')
const website    = require(path.join(__dirname, '..', 'config', 'config.json')).website;

router.get('/', function (req, res) {
  res.json({
    websiteName: website.name
  })
})

module.exports = router