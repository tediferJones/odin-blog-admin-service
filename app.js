var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/view');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

// this is not secure at all, but thats not the point of this project
app.use(function(req, res, next) {
  if (req.cookies.isAdmin) {
    res.locals.admin = true;
  }
  next();
});

app.use('/admin', adminRoutes);
app.use('/', userRoutes);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

