import Home from './components/views/Home.vue'
import Test from './components/views/Test.vue'
import Schedule from './components/views/Schedule.vue'
import Login from './components/auth/Login.vue'
import Day from './components/views/catagory/Day.vue'
import Month from './components/views/catagory/Month.vue'
import Week from './components/views/catagory/Week.vue'
import Test2 from './components/views/Test2.vue'


export const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        children: [{
            path: 'schedule',
            name: 'schedule',
            component: Schedule
        }, {

            path: 'test',
            name: 'test',
            component: Test
        },

        ]

    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/test2',
        name: 'test2',
        component: Test2,
        children: [{
            path: 'day',
            name: 'day',
            component: Day
        }, {
            path: 'month',
            name: 'month',
            component: Month
        }, {
            path: 'week',
            name: 'week',
            component: Week
        }]
    }
];