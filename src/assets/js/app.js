/* Vendors */
/*---------------------------*/
import jquery from 'jquery';

window.jQuery = jquery;
window.$ = jquery;

require("jquery-validation");

/* Directives */
/*---------------------------*/
require('./directives/date');

/* Pages */
/*---------------------------*/
require('./pages/site/home').default();
require('./pages/panel/redis-header').default();
require('./pages/panel/redis-login').default();
require('./pages/panel/redis-log').default();
require('./pages/panel/redis').default();
