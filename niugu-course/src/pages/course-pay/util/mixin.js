import bridge from 'ng-bridge';
import Cookie from 'js-cookie';

export default {
  methods: {
    toPay: () => {
      const courseid = bridge.search('courseid');
      if (+bridge.search('isH5') === 1) {
        if (Cookie.get('usertoken')) {
          window.location.href = `/public/pay/index.html?courseid=${courseid}`;
        } else {
          window.location.href = '/public/login/index.html';
        }
      } else {
        bridge.utoken((ut) => {
          if (ut) {
            bridge.toCoursePayment(courseid);
          } else {
            bridge.login();
          }
        });
      }
    },
    telphone(num) {
      bridge.telPhone(num);
    }
  }
};
