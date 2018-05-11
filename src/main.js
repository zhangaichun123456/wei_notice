// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import axios from 'axios'

Vue.config.productionTip = false;

Vue.prototype.$ajax = axios;
axios.defaults.withCredentials=true;
window.eventBus = new Vue;
Vue.prototype.baseurl='http://120.76.163.131:8082/xiuxiu/';//设置全局的url
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
