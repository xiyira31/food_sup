let express = require('express')
let app = express()
let http = require('http').Server(app)
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session')
let bodyParser = require('body-parser');
let path = require('path')
let fs = require('fs')

let savePath = path.join(__dirname + '/log/foodsup-%DATE%.log')
// daily logger
var rotatingLogStream = 
  require('file-stream-rotator').getStream({
    filename:savePath, 
    frequency:"daily", 
    verbose: false, 
    date_format: "YYYY-MM-DD"}
  );
app.use(logger("combined", {stream: rotatingLogStream}));

let login = require('./routes/login');
let type = require('./routes/type');
let school = require('./routes/school');
let producer = require('./routes/producer');
let product = require('./routes/product');
let order = require('./routes/order');
let company = require('./routes/company');
let user = require('./routes/user');
let backup = require('./routes/backup');
let main = require('./routes/main');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'))

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use('/', login);
app.use('/type', type);
app.use('/school', school);
app.use('/producer', producer);
app.use('/product', product);
app.use('/order', order);
app.use('/company', company);
app.use('/user', user);
app.use('/backup', backup);
app.use('/main', main);

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
})