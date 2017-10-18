var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {
  models.type.create({
    name: req.body.name
  }).then(function() {
    res.json({
      success: true
    });
  })
});

router.post('/update', function(req, res) {
  let type = req.body.type
  let id = type.id
  delete(type.id)
  delete(type.created)
  models.type.update(type, {
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
  models.type.findAndCountAll({
    where: {
      name: {
        $like: searchWord
      },
      valid: 1
    },
    limit: limit,
    offset: offset
  }).then( result => {
    res.json({
      types: result.rows,
      total: result.count
    });
  });
});

router.get('/lookupAll', function(req, res) {
  models.type.findAll({
    include: [{model: models.product, as: 'products', where: { valid: 1}, include: [{
      model: models.product_producer, as: 'producers', include: [{
        model: models.producer, as: '_producer'
      }]
    }]}],
    order: ['orderBy']
  }).then(types => {
    res.json({
      types: types
    })
  })
})

router.post('/delete', function(req, res) {
  models.type.update({
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

router.post('/lookupTypeSummary', function(req, res) {
  let types = req.body.types
  let start = req.body.start
  let end = req.body.end
  models.order_detail.findAll({
    order: [
      [
        {model: models.product, as: '_product'}, 'id'
      ]
    ],
    include: [{
      model: models.product,
      as: '_product',
      where: {
        type: {
          $in: types
        },
        valid: 1
      }
    }, {
      model: models.order,
      as: '_order',
      where: {
        date: {
          $gte: start,
          $lte: end
        }
      },
      include: [{
        model: models.school,
        as: '_school'
      }]
    }]
  }).then(result => {
    res.json({
      details: result
    })
  })
})

module.exports = router;
