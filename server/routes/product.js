var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/create', function(req, res) {
  let product = req.body.product
  if (product.shelf_life === '') {
    product.shelf_life = null
  }
  models.product.findAll({
    where: {
      name: product.name,
      spec: product.spec 
    }
  }).then(results => {
    if (results.length === 0) {
      models.product.create(product).then( createdProduct => {
        if (product.producers.length > 0) {
          product.producers.forEach(producer => {
            models.product_producer.create({
              product: createdProduct.id,
              producer: producer
            }).then( _=> {
              res.json({
                success: true
              })
            })
          })
        } else {
          res.json({
            success: true
          })
        }
      })
    } else {
      res.json({
        success: false,
        reason: '已有相同的品名与规格的商品，无法继续添加该商品！'
      })
    }
  })
});

router.post('/update', function(req, res) {
  let product = req.body.product
  let id = product.id
  if (product.shelf_life === '') {
    product.shelf_life = null
  }
  delete(product.id)
  delete(product.created)
  models.product.update(product, {
    where: {
      id: id
    }
  }).then(_ => {
    models.product_producer.destroy({
        where: {
          product: id
        }
      }).then( _ => {
        let instances = []
        product.producers.forEach(p => {
          instances.push({
            product: id,
            producer: p
          })
        })
        console.log(instances)
        models.product_producer.bulkCreate(instances).then(_ => {
          res.json({
            success: true
          });
        })
      })
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
  models.product.findAndCountAll({
    include: [ '_type' ],
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
      products: result.rows,
      total: result.count
    });
  });
});

router.post('/delete', function(req, res) {
  models.product.update({
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

router.post('/readOne', function(req, res) {
  let id = req.body.id
  models.product.findById(id).then( product => {
    if (product !== null) {
      models.product_producer.findAll({
        where: {
          product: id,
          valid: 1
        }
      }).then( p_p => {
        let producers = []
        p_p.forEach(p => {
          producers.push(p.producer)
        })
        res.json({
          product: product,
          producers: producers
        })
      })
    }
  })
});

router.post('/lookupDailyPrice', function(req, res) {
  let typeId = req.body.type
  let limit = req.body.limit
  let offset = req.body.offset
  let date = req.body.date
  let searchWord = req.body.searchWord
  models.product.findAndCountAll({
    where: {
      type: typeId,
      valid: 1,
      name: {
        $like: '%' + searchWord + '%'
      }
    },
    offset: offset,
    limit: limit,
    include: [{
      model: models.daily_price,
      as: 'prices',
      where: {date: date},
      required: false
    }]
  }).then( result => {
    res.json({
      products: result.rows,
      total: result.count
    });
  });
});

router.post('/saveDailyPrice', function(req, res) {
  let dailyPrice = req.body.dailyPrice
  if (dailyPrice.id) {
    models.daily_price.update(dailyPrice, {
      where: {
        id: dailyPrice.id
      }
    }).then(_ => {
      res.json({
        success: true
      })
    })
  } else {
    models.daily_price.create(dailyPrice).then(_ => {
      res.json({
        success: true
      })
    })
  }
})

module.exports = router;
