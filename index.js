/* Libraries */
/*---------------------------*/
const express = require('express');
const expressSession = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv').config({ path: './config/.env' });
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const redisStore = require('connect-redis')(expressSession);
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const cache = require('./app/db/redis/cache');

/* Init express */
/*---------------------------*/
const app = express();

/* Middlewares */
/*---------------------------*/
app.use(expressLayouts);
app.use(helmet.noCache());
app.use(helmet.frameguard());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Shortcut path's */
/*---------------------------*/
app.use('/dist', express.static('dist'));
app.use('/img', express.static('dist/img'));
app.use('/css', express.static('dist/css'));
app.use('/js', express.static('dist/js'));
app.use('/logs', express.static('dist/logs'));
app.use('/assets', express.static('src/assets'));
app.use('/', express.static(__dirname));

/* Express session configuration */
/*---------------------------*/
app.use(expressSession({
  secret: 'very very secret',
  resave: true,
  saveUninitialized: false,
  store: new redisStore({
    host: process.env.REDIS_HOST !== 'null' ? process.env.REDIS_HOST : '127.0.0.1',
    port: process.env.REDIS_PORT !== 'null' ? process.env.REDIS_PORT : '6379'
  })
}));

/* Express view configuration */
/*---------------------------*/
app.set('view engine', 'ejs');
app.set('view cache', false);
app.set('views', [path.join(__dirname, 'dist/views')]);

/* Application routes */
/*---------------------------*/
app.use(require('./app/routes'));

/* Express server initialize */
/*---------------------------*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  cache.delete('cache:watch');

  console.log(logSymbols.success, chalk.green('Ready! Listening to: http://localhost:' + PORT));

});
