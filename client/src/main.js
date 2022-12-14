import './my.sass';

import Vue from 'vue';
import Buefy from 'buefy';
import VueSocketIO from 'vue-socket.io-extended';
import ioClient from 'socket.io-client';
import { extend } from 'vee-validate';

import App from './App.vue';
import router from './router';
import store from './store';

const connectionOptions = {
  connection: undefined,
};
if (process.env.NODE_ENV === 'development') {
  connectionOptions.connection = ioClient('http://localhost:5000', {
    cors: {
      origin: '*',
    },
  });
  connectionOptions.debug = true;
} else {
  connectionOptions.connection = ioClient(window.location.href);
}
Vue.use(VueSocketIO, connectionOptions.connection);

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

extend('required', {
  validate(value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1,
    };
  },
  message: 'Must provide a {_field_}.',
  computesRequired: true,
});

extend('oneOrMore', {
  validate(list) {
    return list.length > 0;
  },
  message: 'Must select at least 1 {_field_}.',
  computesRequired: true,
});
