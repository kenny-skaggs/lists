import './my.sass';

import Vue from 'vue';
import Buefy from 'buefy';
import VueSocketIO from 'vue-socket.io';
import ioClient from 'socket.io-client';

import App from './App.vue';
import router from './router';
import store from './store';

const client = ioClient('http://localhost:5000', {
  cors: {
    origin: '*',
  },
});

Vue.use(new VueSocketIO({
  debug: true,
  connection: client,
}));
Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
