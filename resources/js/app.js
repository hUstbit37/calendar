const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = function (msg, vm, trace) {
    // `trace` is the component hierarchy trace
    if (msg === ignoreWarnMessage) {
        msg = null;
        vm = null;
        trace = null;
    }
}

require('./bootstrap');
window.Vue = require('vue');

import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { routes } from './routes.js'
import App from './App.vue'
import Vue from 'vue';
// import VueFire from 'vuefire';

// Vue.use(VueFire);
Vue.use(VueRouter);
window.Vue.use(Vuetify);

// Vue.component('example-component', require('./components/ExampleComponent.vue').default);

firebase.initializeApp({
    apiKey: "AIzaSyAHIdXlTW0IEDqtFBJaKNB2P89XseoK4aw",
    authDomain: "calendar-14066.firebaseapp.com",
    databaseURL: "https://calendar-14066.firebaseio.com",
    projectId: "calendar-14066",
    storageBucket: "calendar-14066.appspot.com",
    messagingSenderId: "209313344190",
    appId: "1:209313344190:web:47220294a8455c9915ccef"
});

export const db = firebase.firestore();

const router = new VueRouter({
    mode: 'history',
    routes
})

const app = new Vue({
    vuetify: new Vuetify(),
    el: '#app',
    components: { App },
    router,
}).$mount("#app");

