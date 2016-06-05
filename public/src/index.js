var Vue = require('vue');
var VueResource = require('vue-resource');
var indexApp = require('./components/indexApp.vue');

Vue.config.debug = true;
Vue.use(VueResource);

var app = new Vue(indexApp);