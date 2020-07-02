import Home from './components/views/Home.vue'
import Year from './components/views/Year.vue'
import Schedule from './components/views/Schedule.vue'
import Login from './components/auth/Login.vue'
import Test2 from './components/views/Test2.vue'
import Test from './components/views/Test.vue'


export const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        children: [{
            path: 'schedule',
            name: 'schedule',
            component: Schedule
        },]
    },

    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/test',
        name: 'test',
        component: Test,
    },
    {
        path: '/test2',
        name: 'test2',
        component: Test2,
    }
];