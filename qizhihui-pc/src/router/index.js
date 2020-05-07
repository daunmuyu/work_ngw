// import index from '@/pages/index';
// import about from '@/pages/about/about';
import personalCenter from '@/pages/personalcenter/personalcenter';
// import productService from '@/pages/productservice/productservice';
import protocol from '@/components/RegProtocol.vue';
// import tradeguide from '@/pages/tradeguide/tradeguide';
import trade from '@/pages/trade';
// import result from '@/pages/result';

export default [
  {
    path: '/',
    name: 'trade',
    component: trade,
  },
  {
  //   path: '/',
  //   name: 'index',
  //   component: index,
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: about,
  // },
  // {
    path: '/personalcenter',
    name: 'personalcenter',
    component: personalCenter,
  },
  {
    path: '/personalcenter/:type',
    name: 'personalcenterType',
    component: personalCenter,
  },
  {
  //   path: '/productservice',
  //   name: 'productservice',
  //   component: productService,
  // },
  // {
    path: '/protocol',
    name: 'protocol',
    component: protocol,
  },
  {
  //   path: '/tradeguide',
  //   name: 'tradeguide',
  //   component: tradeguide,
  // },
  // {
    path: '/trade',
    name: 'trade',
    component: trade,
  },
  // {
  //   path: '/result',
  //   name: 'result',
  //   component: result,
  // },
  // {
  //   path: '*',
  //   component: index,
  // },
];
