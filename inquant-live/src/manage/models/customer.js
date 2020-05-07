import {
  getCustomerList,
  getCustomerDetail,
  addCustomer,
  deleteCustomer,
  editCustomer,
  qrysubstrategylist,
  qrybrokerinfo,
  getindicatorstatus,
  setindicatorstatus
} from '../api/customer';

const SET_CUSTOMER_LIST = 'SET_CUSTOMER_LIST';
const SET_CUSTOMER_LIST_TOTAL = 'SET_CUSTOMER_LIST_TOTAL';
const SET_STRAGTEGY_LIST = 'SET_STRAGTEGY_LIST';

const statusList = [{
  value: 1,
  label: '正常',
}, {
  value: 0,
  label: '冻结',
}];

export default {
  state: {
    customerList: [],
    customerListTotal: 0,
    customerStatusList: statusList,
    stragtegyList: [],
  },
  mutations: {
    [SET_CUSTOMER_LIST](state, payload) {
      state.customerList = payload;
    },
    [SET_CUSTOMER_LIST_TOTAL](state, payload) {
      state.customerListTotal = payload;
    },
    [SET_STRAGTEGY_LIST](state, payload) {
      state.stragtegyList = payload;
    }
  },
  actions: {
    loadCustomerList({
      commit,
      rootState,
    }, payload) {
      const userToken = rootState.app.userInfo.userToken;
      return getCustomerList({
        ...payload,
        userToken,
      }).then((res) => {
        console.log(res);
        if (res.error_no === 0) {
          commit(SET_CUSTOMER_LIST, res.data);
          commit(SET_CUSTOMER_LIST_TOTAL, res.total);
        }
        return res;
      }, (err) => {
        console.log('[err]', err);
      });
    },
    handleGetindicatorstatus({
      commit,
      state,
      rootState,
    }, payload) {
      console.log(rootState)
      const userToken = rootState.app.userInfo.userToken;
      return getindicatorstatus({
        ...payload,
        userToken
      })
    },
    handleSetindicatorstatus({
      commit,
      state,
      rootState,
    }, payload) {
      const userToken = rootState.app.userInfo.userToken;
      return setindicatorstatus({
        ...payload,
        userToken,
      });
    },
    getCustomerById({
      commit,
      state,
      rootState,
    }, payload) {
      // console.log(payload, state.customerList);
      // const qureyCustomer = state.customerList.filter(customer => customer.agentUserID === payload);
      // console.log(8888, qureyCustomer);
      // if (qureyCustomer.length > 0) {
      //   return qureyCustomer[0]
      // }
      // return undefined;

      const userToken = rootState.app.userInfo.userToken;
      return getCustomerDetail({
        ...payload,
        userToken,
      });
    },
    addCustomer({
      commit,
      rootState,
    }, payload) {
      const userToken = rootState.app.userInfo.userToken;
      return addCustomer({
        ...payload,
        userToken,
      });
    },
    editCustomer({
      commit,
      rootState,
    }, payload) {
      const userToken = rootState.app.userInfo.userToken;
      return editCustomer({
        ...payload,
        userToken,
      });
    },
    deleteCustomer({
      commit,
      rootState,
    }, payload) {
      const userToken = rootState.app.userInfo.userToken;
      return deleteCustomer({
        ...payload,
        userToken,
      });
    },
    loadStragtegyList({
      commit,
    }) {
      return qrysubstrategylist().then((res) => {
        if (res.error_no === 0) {
          commit(SET_STRAGTEGY_LIST, res.quantStrategy);
        }
        return res;
      });
    },
    loadBrokerList({
      commit,
      rootState
    }, payload) {
      const userToken = rootState.app.userInfo.userToken;
      return qrybrokerinfo({
        userToken,
      });
    }
  },
  getters: {
    customerList({
      customerList,
    }) {
      return customerList;
    },
    customerListTotal({
      customerListTotal,
    }) {
      return customerListTotal;
    },
    customerStatusList({
      customerStatusList,
    }) {
      return customerStatusList;
    },
    stragtegyList({
      stragtegyList,
    }) {
      return stragtegyList;
    },
  },
};
