import {
  getEmployeeList,
  getEmployeeDetail,
  addEmployee,
  editEmployee,
  deleteEmployee,
} from '../api/employee';

const SET_EMPLOYEE_LIST = 'SET_CUSTOMER_LIST';
const SET_CUSTOMER_LIST_TOTAL = 'SET_CUSTOMER_LIST_TOTAL';

const statusList = [{
  value: 1,
  label: '正常',
}, {
  value: 0,
  label: '冻结',
}];
const roleList = [{
  value: 3,
  label: '老师',
}, {
  value: 2,
  label: '助理',
}, {
  value: 4,
  label: '高手',
}];

export default {
  state: {
    employeeList: [],
    employeeStatusList: statusList,
    employeeRoleList: roleList,
  },
  mutations: {
    [SET_EMPLOYEE_LIST](state, payload) {
      state.employeeList = payload;
    },
  },
  actions: {
    loadEmployeeList({
      commit,
      rootState,
    }, payload) {
      const Id = rootState.app.userInfo.agentID;
      return getEmployeeList({
        Id,
      }).then((res) => {
        console.log(res);
        commit(SET_EMPLOYEE_LIST, res.items);
        return res;
      }, (err) => {
        console.log('[err]', err);
      });
    },
    getEmployeeDetail({
      commit,
    }, payload) {
      return getEmployeeDetail(payload);
    },
    addEmployee({
      commit,
      rootState,
    }, payload) {
      const proxyId = rootState.app.userInfo.agentID;
      return addEmployee({
        ...payload,
        proxyId,
      });
    },
    editEmployee({
      commit,
      rootState,
    }, payload) {
      const proxyId = rootState.app.userInfo.agentID;
      return editEmployee({
        ...payload,
        proxyId,
      });
    },
    deleteEmployee({
      commit,
      rootState,
    }, payload) {
      return deleteEmployee({
        ...payload,
      });
    }
  },
  getters: {
    employeeList({
      employeeList,
    }) {
      return employeeList;
    },
    employeeStatusList({
      employeeStatusList,
    }) {
      return employeeStatusList;
    },
    employeeRoleList({
      employeeRoleList,
    }) {
      return employeeRoleList;
    },
  },
};
