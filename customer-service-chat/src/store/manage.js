import { IMGroupList, IMTMList } from '@/service/group.js';

function getResetGroup(group) {
  group.userList = [];
  group.checkedUsersLen = 0;
  group.open = false;
  return group;
}

const data = {
  // 个人
  groupList: [],
  // 群组列表
  teamList: [],
};

const getters = {
  groupList: state => state.groupList,
  teamList: state => state.teamList,
};
const mutations = {
  setGroupList(state, value) {
    state.groupList = value;
  },
  setTeamList(state, value) {
    state.teamList = value;
  },
};
const actions = {
  async fetchGroupList(ctx) {
    const res = await IMGroupList();
    if (res.code === '0') {
      ctx.commit('setGroupList', res.data.map((group) => {
        return getResetGroup(group);
      }));
    }
  },
  async fetchTeamList(ctx) {
    const res = await IMTMList();
    if (res.code === '0') {
      ctx.commit('setTeamList', res.data);
    }
  },
};


export default {
  namespaced: true,
  state: data,
  getters,
  mutations,
  actions,
};
