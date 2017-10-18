var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {
  models.company.create({
    name: req.body.name  
  }).then(function() {
    res.json({
      success: true
    });
  })
});

router.post('/update', function(req, res) {
  let company = req.body.company
  console.log(company)
  let id = company.id
  delete(company.id)
  delete(company.created)
  models.company.update(company, {
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
  models.company.findAndCountAll({
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
      companys: result.rows,
      total: result.count
    });
  });
});

router.post('/delete', function(req, res) {
  models.company.update({
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
