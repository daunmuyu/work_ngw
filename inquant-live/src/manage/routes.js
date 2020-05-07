import login from './views/login';
import app from './views/app';
import index from './views/index';
import live from './views/live';
import liveDetail from './views/liveDetail';
import notice from './views/notice';
import video from './views/video';
import customer from './views/customer';
import customerDetail from './views/customerDetail';
import employee from './views/employee';
import employeeDetail from './views/employeeDetail';
import videoDetail from './views/videoDetail';

export default [
  {
    name: 'login',
    path: '/login',
    component: login
  },
  {
    path: '/',
    component: app,
    children: [
      // 管理后台首页
      {
        name: 'index',
        path: '/index',
        component: index
      },
      // 直播列表
      {
        name: 'live',
        path: '/live',
        component: live
      },
      // 编辑直播信息
      {
        name: 'editLive',
        path: '/live/edit/:id',
        component: liveDetail
      },
      // 预告列表
      {
        name: 'notice',
        path: '/notice',
        component: notice
      },
      // 视频列表
      {
        name: 'video',
        path: '/video',
        component: video
      },
      // 新增视频
      {
        name: 'newVideo',
        path: '/video/new',
        component: videoDetail
      },
      // 编辑视频
      {
        name: 'editVideo',
        path: '/video/edit/:id',
        component: videoDetail
      },
      // 用户列表
      {
        name: 'customer',
        path: '/customer',
        component: customer
      },
      // 新增用户
      {
        name: 'newCustomer',
        path: '/customer/new',
        component: customerDetail
      },
      // 编辑用户
      {
        name: 'editCustomer',
        path: '/customer/edit/:customerId',
        component: customerDetail
      },
      // 查看用户
      {
        name: 'customerDetail',
        path: '/customer/detail/:customerId',
        component: customerDetail
      },
      // 内部员工列表
      {
        name: 'employee',
        path: '/employee',
        component: employee
      },
      // 新增员工
      {
        name: 'newEmployee',
        path: '/employee/new',
        component: employeeDetail
      },
      // 编辑员工
      {
        name: 'editEmployee',
        path: '/employee/edit/:employeeId',
        component: employeeDetail
      },
      // 员工详情
      {
        name: 'employeeDetail',
        path: '/employee/detail/:employeeId',
        component: employeeDetail
      },
      {
        path: '*',
        component: index
      }
    ]
  }
];
