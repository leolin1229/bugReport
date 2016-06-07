var Vue = require('vue');
var VueResource = require('vue-resource');
var userApp = require('./components/userApp.vue');

Vue.config.debug = true;
Vue.use(VueResource);

new Vue(userApp);