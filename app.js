var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var hbs = require('express-handlebars');
var fileUpload = require('express-fileupload');
var db = require('./config/connection');
var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({ secret: "key", cookie: { maxAge: 600000 } }));

process.env.PWD = process.cwd()
app.use(express.static(process.env.PWD + '/public/product-images'));

db.connect((err) => {
  if (err) {
    console.log("error" + err)
  }
  else {
    console.log("database connected")
  }
})

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
