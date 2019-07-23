var models  = require('../models');
let db = require('../models/index')
var express = require('express');
let moment = require('moment')
var router  = express.Router();

router.post('/create', function(req, res) {
  models.order.findOrCreate({
    where: {
      date: req.body.date,
      school: req.body.school
    }
  }).spread((order, created) => {
    let orderId = order.id
    let detail = req.body.detail
    detail.order = orderId
    models.order_detail.create(detail).then(function() {
      res.json({
        success: true
      });
    })
  })
});

router.post('/update', function(req, res) {
  let detail = req.body.detail
  models.order_detail.update(detail, {
    where: {
      id: req.body.id
    }
  }).then(function(affected) {
    if (affected[0] > 0) {
      res.json({
        success: true
      });
    } else {
      res.json({
        success: false
      });
    }
  })
});

router.post('/quickUpdate', function (req, res) {
  let id = req.body.id
  let price = req.body.price
  models.order_detail.update({
    price: price
  }, {
    where: {
      id: id
    }
  }).then(affected => {
    if(affected[0] > 0) {
      res.json({
        success: true
      });
    } else {
      res.json({
        success: false
      });
    }
  })
})

router.get('/lookup', function(req, res) {
  models.order.findAll({
    where: {
      date: req.query.date,
      school: req.query.school
    },
    order: [ [ { model: models.order_detail, as: 'details' }, 
              { model: models.product, as: '_product' }, 'type' ]],
    include: [{
      model: models.order_detail,
      as: 'details',
      include: [{
        model: models.producer,
        as: '_producer'
      }, {
        model: models.print_order,
        as: '_print_order'
      }, {
        model: models.product,
        as: '_product',
        include: [{
          model: models.product_producer,
          as: 'producers',
          include: [{
            model: models.producer,
            as: '_producer'
          }]
        }, {
          model: models.daily_price,
          as: 'prices',
          where: {date: req.query.date},
          required: false
        }]
      }]
    }]
  }).then( order => {
    res.json({
      order: order
    });
  });
});

router.get('/lookupBy', function (req, res) {
  let school = req.query.school
  let date = req.query.date
  let where = {}
  if (school) {
    where.school = school
  }
  if (date) {
    where.date = date
  }
  models.order.findAndCountAll({
    where: where,
    limit: parseInt(req.query.limit),
    offset: parseInt(req.query.offset),
    include: [{
      model: models.school,
      as: '_school'
    }]
  }).then(result => {
    res.json({
      total: result.count,
      orders: result.rows
    })
  })
})

router.get('/lookupAll', function(req, res) {
  models.order.findAll({
    include: [{model: models.product, as: 'products', where: { valid: 1}, include: [{
      model: models.product_producer, as: 'producers', include: [{
        model: models.producer, as: '_producer'
      }]
    }]}]
  }).then(orders => {
    res.json({
      orders: orders
    })
  })
})

router.get('/lookupDetaiById', function(req, res) {
  let id = parseInt(req.query.order)
  models.order_detail.findAll({
    where: {
      order: id
    },
    include:[
      {
        model: models.product, 
        as: '_product',
        include: [{
          model: models.type,
          as: '_type'
        }]
      }, {
        model: models.producer,
        as: '_producer'
      }, {
        model: models.print_order,
        as: '_print_order'
      }
    ]
  }).then(details => {
    res.json({
      details: details
    })
  })
})

router.post('/delete', function(req, res) {
  models.order_detail.destroy({
    where: {
      id: req.body.id
    }
  }).then(function(num) {
    if (num > 0) {
      res.json({
        success: true
      });
    } else {
      res.json({
        success: false
      });
    }
  })
});

router.post('/createPrintOrder', function(req, res) {
  let printOrder = req.body.printOrder
  models.print_order.findOrCreate({
    where: {
      order: printOrder.order,
      printNo: printOrder.printNo
    },
    defaults: {
      company: printOrder.company,
      orderType: printOrder.orderType,
      orderStyle: printOrder.orderStyle,
      carNum: printOrder.carNum,
      deliverPerson: printOrder.deliverPerson
    }
  }).then( (newPrints, created) => {
    if (newPrints.length === 0) {
      return
    }
    let newPrint = newPrints[0]
    let details = printOrder.details
    let ids = []
    details.forEach(detail => {
      ids.push(detail.id)
    })
    models.order_detail.update({
      print_order: newPrint.id
    }, {
      where: {
        id: {
          $in: ids
        }
      }
    }).then(_ => {
      res.json({
        success: true
      })
    })
  })
})

router.post('/getPrintOrders', function (req, res) {
  let orderId = req.body.orderId
  models.print_order.findAll({
    where: {
      order: orderId
    },
    include: [
      {
        model: models.order_detail,
        as: 'details',
        include: [
          {
            model: models.product,
            as: '_product'
          }
        ]
      }
    ]
  }).then(print_orders => {
    res.json({
      print_orders: print_orders
    })
  })
})

router.post('/getPrintOrdersByDateSchool', function (req, res) {
  let school = req.body.school
  let date = req.body.date
  if (date && school) {
    models.print_order.findAll({
      include: [{
        model: models.order,
        as: '_order',
        where: {
          date: date,
          school: school
        },
        include: [{
          model: models.school,
          as: '_school'
        }]
      }, {
        model: models.order_detail,
        as: 'details',
        include: [{
          model: models.product,
          as: '_product'
        }]
      }, {
          model: models.company,
          as: '_company'
      }]
    }).then(result => {
      res.json({
        print_orders: result
      })
    })
  } else {
    res.json({
      print_orders: []
    })
  }
})

router.post('/checkPrintOrder', function (req, res) {
  let id = req.body.printNo
  models.print_order.update({
    checked: 1
  }, {
    where: {
      id: id
    }
  }).then(_ => {
    res.json({
      success: true
    })
  })
})

router.post('/deletePrintOrders', function (req, res) {
  let printOrders = req.body.printOrders
  models.sequelize.transaction(function (t) {
    let orders = []
    printOrders.forEach(printOrder => {
      orders.push(printOrder.id)
    })
    return models.order_detail.update({
      print_order: null
    }, {
      where: {
        print_order: {
          $in : orders
        }
      },
      include: {
        model: models.print_order,
        where: {
          checked: 0
        }
      }
    }, {transaction: t}).then(_ => {
      return models.print_order.destroy({
        where: {
          id: {
            $in: orders
          },
          checked: 0
        }
      }, {transaction: t})
    })
  }).then(function (result) {
    res.json({
      success: true
    })
  })
})

router.post('/modifyCost', function (req, res) {
  let details = req.body.details
  details.forEach(detail => {
    delete(detail.created)
  });
  models.order_detail.bulkCreate(details, {updateOnDuplicate: ['cost']}).then(result => {
    res.json({
      success: true
    })
  })
})

router.post('/printOrderSummary', function (req, res) {
  let start = req.body.start
  let end = req.body.end
  let school = req.body.school
  models.print_order.findAll({
    attributes: ['id', 'printNo', 'orderStyle',
      [models.sequelize.fn('sum', 
        models.sequelize
          .literal('details.price * if(details.fake_num is null, details.num, details.fake_num)')), 
                  'amount'],
      [models.sequelize.fn('sum', 
      models.sequelize
        .literal('details.cost * if(details.fake_num is null, details.num, details.fake_num)')), 
                'costAmount']],
    group: ['printNo'],
    order: ['printNo'],
    include: [{
      model: models.order,
      as: '_order',
      attributes: [],
      where: {
        school: school,
        date: {
          $gte: start,
          $lte: end
        }
      }
    }, {
      model: models.order_detail,
      as: 'details',
      attributes: []
    }]
  }).then(result => {
    res.json({
      print_orders: result
    })
  })
})

router.post('/producerSummary', function (req, res) {
  let start = req.body.start
  let end = req.body.end
  let producer = req.body.producer
  models.order_detail.findAll({
    attributes: ['producer', '_order.date', 'product', 
      [models.sequelize.fn('sum', models.sequelize.col('num')), 'count']],
    group: ['producer', '_order.date', 'product', '_order.school'],
    where: {
      producer: producer
    },
    include: [{
      model: models.order,
      as: '_order',
      attributes: ['date', 'school'],
      where: {
        date: {
          $gte: start,
          $lte: end
        }
      },
      include: [{
        model: models.school,
        as: '_school',
        where: {
          valid: 1
        }
      }]
    }, {
      model: models.producer,
      as: '_producer',
      where: {
        valid: 1
      }
    }, {
      model: models.product,
      as: '_product',
      where: {
        valid: 1
      }
    }]
  }).then(result => {
    res.json({
      details: result
    })
  })
})

router.post('/lookupOrders', function (req, res) {
  const start = req.body.start
  const end = req.body.end
  const school = req.body.school
  const limit = req.body.limit
  const offset = req.body.offset
  const where = {}
  if (start || end) {
    where.date = {}
  }  
  if (school) {
    where.school = school
  }
  if (start) {
    where.date.$gte = start
  }
  if (end) {
    where.date.$lte = end
  }
  models.order.findAndCountAll({
    where: where,
    offset: offset,
    limit: limit,
    include: [{
      model: models.school,
      as: '_school'
    }, {
      model: models.order_detail,
      as: 'details'
    }]
  }).then( result => {
    models.order.count({
      where: where
    }).then(c => {
      res.json({
        orders: result.rows,
        total: c
      });
    })    
  });
})

module.exports = router;
