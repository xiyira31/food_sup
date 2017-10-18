var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {
  let school = req.body.school
  models.school.create(school).then(function() {
    res.json({
      success: true
    });
  })
});

router.post('/update', function(req, res) {
  let school = req.body.school
  let id = school.id
  delete(school.id)
  delete(school.created)
  models.school.update(school, {
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
  models.school.findAndCountAll({
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
      schools: result.rows,
      total: result.count
    });
  });
});

router.post('/delete', function(req, res) {
  models.school.update({
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
