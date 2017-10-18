var models  = require('../models');
let express = require('express');
let router  = express.Router();

router.post('/userLogin', function(req, res) {
  let username = req.body.username
  let password = req.body.password
  models.user.findOne({
    where: {
      username: username
    },
    include: [{
      model: models.role,
      as: '_role',
      include: [{
        model: models.permission,
        as: 'permissions'
      }]
    }]
  }).then(user => {
    if (user === null || user.password !== password) {
      res.json({
        success: false
      })
    } else {
      res.json({
        success: true,
        user: user
      })
    }
  })
});

router.get('/getInfo', function(req, res) {
  let username = req.query.username
  models.user.findOne({
    where: {
      username: username
    },
    include: [{
      model: models.role,
      as: '_role',
      include: [{
        model: models.permission,
        as: 'permissions'
      }]
    }]
  }).then(user => {
    if (user === null) {
      res.json({
        success: false
      })
    } else {
      res.json({
        success: true,
        user: user
      })
    }
  })
})

module.exports = router;