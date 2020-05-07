import liveHome from './views/live-home';
import LiveList from './LiveList';
import Live from './app.js';
import pdf from './views/pdf/index.vue'

export default [{
    path: '/',
    component: LiveList,
    name: 'LiveList',
  },
  {
    name: 'LiveHome',
    component: liveHome,
    path: '/live-home/:roomId/',
    children: [{
      path: 'pdf',
      component: pdf,
      name: 'pdf'
    }]
  }, {
    name: 'Live',
    component: Live,
    path: '/live'
  }
]
