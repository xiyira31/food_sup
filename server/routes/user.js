var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {
  let user = req.body.user
  models.user.create(user).then(function() {
    res.json({
      success: true
    });
  })
});

router.post('/update', function(req, res) {
  let user = req.body.user
  let id = user.id
  delete(user.id)
  delete(user.created)
  models.user.update(user, {
    where: {
      id: id
    }
  }).then(function(types) {
    res.json({
      success: true
    });
  })
});

router.get('/lookup', function(req, res) {
  if (req.query.searchWord === undefined) {
    req.query.searchWord = ''
  }
  let searchWord = '%' + req.query.searchWord + '%'
  let limit = parseInt(req.query.limit)
  let offset = parseInt(req.query.offset)
  if (isNaN(limit) || limit === null || limit === undefined) {
    limit = 99999
  }
  if (isNaN(offset) || offset === null || offset === undefined) {
    offset = 0
  }
  models.user.findAndCountAll({
    where: {
      name: {
        $like: searchWord
      },
      valid: 1
    },
    limit: limit,
    offset: offset,
    include: [{
      model: models.role,
      as: '_role'
    }]
  }).then( result => {
    res.json({
      users: result.rows,
      total: result.count
    });
  });
});

router.get('/fetchRoles', function(req,res) {
  models.role.findAll({
    include: [
      {
        model: models.permission,
        as: 'permissions',
        where: {
          allowed: 1
        },
        attributes: ['id', 'model'],
        required: false
      }
    ]
  }).then(roles => {
    res.json({
      roles: roles
    })
  })
})

router.post('/createRole', function(req, res) {
  models.role.create({
    name: req.body.name
  }).then( role => {
    models.model.findAll().then(myModels => {
      let permissions = []
      myModels.forEach(function(model) {
        permissions.push({
          role: role.id,
          model: model.id
        })
      })
      models.permission.bulkCreate(permissions).then(_ => {
        res.json({
          success: true
        });
      })
    })
  })
})

router.post('/roleUpdate', function(req, res) {
  let role = req.body.role
  let permissions = req.body.permissions
  models.permission.update({
    allowed: 0
  }, {
    where: {
      role: role
    }
  }).then(_ => {
    models.permission.update({
      allowed: 1
    }, {
      where: {
        model: {
          $in: permissions
        }
      }
    }).then(_ => {
      res.json({
        success: true
      });
    })
  })
})

router.get('/fetchModels', function(req,res) {
  models.model.findAll().then(models => {
    res.json({
      models: models
    })
  })
})

router.post('/delete', function(req, res) {
  models.user.update({
    valid: 0
  }, {
    where: {
      id: req.body.id
    }
  }).then(function(types) {
    res.json({
      success: true
    });
  })
});

module.exports = router;
