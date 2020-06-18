require('./bootstrap');
window.Vue = require('vue');
import VueRouter from 'vue-router'
// import VueTimepicker from 'vue2-timepicker'
Vue.use(VueRouter);
import Vuetify from 'vuetify'
window.Vue.use(Vuetify);
import { routes } from './routes.js'
import App from './App.vue'


Vue.component('example-component', require('./components/ExampleComponent.vue').default);

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = function (msg, vm, trace) {
    // `trace` is the component hierarchy trace
    if (msg === ignoreWarnMessage) {
        msg = null;
        vm = null;
        trace = null;
    }
}
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
