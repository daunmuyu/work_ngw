import App from './app';
import Login from './login';
import Manage from './views/Manage.vue';
import Speak from './views/Speak.vue';
import LiveData from './views/LiveData.vue';
import Edit from './views/Edit.vue';
import TeacherEdit from './views/TeacherEdit.vue';
import LiveEncryption from './views/LiveEncryption.vue';
import UrlStatistical from './views/UrlStatistical.vue';
import pdfUpload from './views/pdfUpload.vue';
import UserLiveTime from './views/UserLiveTime.vue'
import SalseTeamSet from './views/SalseTeamSet.vue'


export default [{
    name: 'App',
    path: '/home/:roomid',
    component: App
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    name: 'Manage',
    path: '/manage',
    component: Manage,
    children: [{
        name: 'Speak',
        path: 'speak/:roomid',
        component: Speak
      },
      {
        name: 'LiveData',
        path: 'live-data/:roomid',
        component: LiveData
      },
      {
        name: 'Edit',
        path: 'edit/:roomid',
        component: Edit
      },
      {
        name: 'TeacherEdit',
        path: 'teacher-edit/:roomid',
        component: TeacherEdit
      },
      {
        name: 'LiveEncryption',
        path: 'live-encryption/:roomid',
        component: LiveEncryption
      },
      {
        name: 'UrlStatistical',
        path: 'url-statistical/:roomid',
        component: UrlStatistical,
      },
      {
        name: 'pdfUpload',
        path: 'pdf-upload/:roomid',
        component: pdfUpload,
      },
      {
        name: 'UserLiveTime',
        path: 'user-live-time/:roomid',
        component: UserLiveTime
      },
      {
        name: 'SalseTeamSet',
        path: 'salse-team-set/:roomid',
        component: SalseTeamSet
      },
    ]
  },
  {
    name: 'App',
    path: '*',
    // component: App
    redirect: '/home/0'
  },
]
