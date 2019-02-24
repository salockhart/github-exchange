const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const fathom = require('express-fathom');

const appsRouter = require('./routes/apps');

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.WHITELIST || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

if (process.env['NODE_ENV'] !== 'production') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(fathom({ server: process.env['FATHOM_SERVER'], siteID: process.env['FATHOM_SITE'] }))

app.use('/api/apps', appsRouter);

module.exports = app;
