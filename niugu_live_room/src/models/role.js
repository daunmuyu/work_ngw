// 角色
import {
  allRoleMembers,
  removeRoleMember,
  searchUser,
  addRoleMember,
  myRoles,
} from 'service/role.js';
import {
  openNotification,
} from 'utils/tool.js';

export default {
  namespace: 'role',
  state: {
    // 房间内的角色列表
    roomRoleList: [],
    // 当前可用角色
    myRoleList: [],
    // 当前选中角色
    currentRole: {
      roleid: '',
      rolename: '请选择角色'
    },
    // 搜索结果
    userSearchResult: [],
  },
  reducers: {
    RoomRoleList(state, {
      payload: roomRoleList,
    }) {
      return {
        ...state,
        roomRoleList,
      };
    },
    MyRoleList(state, {
      payload: myRoleList,
    }) {
      return {
        ...state,
        myRoleList,
      };
    },
    CurrentRole(state, {
      payload,
    }) {
      return {
        ...state,
        currentRole: Object.assign({}, state.currentRole, payload),
      };
    },
    UserSearchResult(state, {
      payload: userSearchResult,
    }) {
      return {
        ...state,
        userSearchResult,
      };
    },
  }, // end reducers
  effects: {
    // 获取当前所有房间角色列表
    * getAllRole({
      payload,
    }, {
      select,
      call,
      put,
    }) {
      const {
        liveid,
      } = yield select(state => state.chatRoom.currentRoom);
      if (!liveid) {
        return;
      }
      const list = yield call(allRoleMembers, {
        liveid,
      });
      let res = [];
      if (list && list.code === 0 && list.roleListItem.length > 0) {
        list.roleListItem.map((item) => {
          res = [...res, ...item.RoleItem.map((r) => {
            const temp = r;
            temp.roleName = item.RoleName;
            temp.roleId = item.RoleId;
            return temp;
          })];
          return item;
        });
        yield put({
          type: 'RoomRoleList',
          payload: res,
        });
      }
    },
    // 添加一个角色用户
    * addRoleMember({
      payload,
    }, {
      select,
      call,
      put,
    }) {
      const {
        liveid: liveId,
      } = yield select(state => state.chatRoom.currentRoom);
      const params = Object.assign({}, payload, {
        liveId
      });
      const res = yield call(addRoleMember, params);
      let msg = res.message || '操作失败，稍后重试';
      if (res && res.code === 0) {
        msg = '角色添加成功';
        yield put({
          type: 'getAllRole',
        });
      }
      openNotification({
        description: msg,
      });
    },
    // 移除角色
    * removeMember({
      payload,
    }, {
      select,
      call,
      put,
    }) {
      const {
        liveid: liveId,
      } = yield select(state => state.chatRoom.currentRoom);
      const params = {
        roleid: payload.roleid,
        liveId,
        uid: payload.uid,
      };
      const res = yield call(removeRoleMember, params);
      if (res.code === 0) {
        const data = yield select(state => state.role.roomRoleList);
        const list = data.filter(item => item.UserId !== payload.uid);
        yield put({
          type: 'RoomRoleList',
          payload: list,
        });
      }
      openNotification({
        description: res.message || '移除角色失败，稍后重试',
      });
    },
    // 根据用户名搜索
    * searchUser({
      payload,
    }, {
      call,
      put,
    }) {
      const res = yield call(searchUser, {
        searchname: payload,
      });
      if (res && res.data.length > 0) {
        yield put({
          type: 'UserSearchResult',
          payload: [...res.data],
        });
      }
    },
    * resetCurrentRole(s, {
      put,
    }) {
      yield put({
        type: 'CurrentRole',
        payload: {
          roleid: '',
          rolename: '请选择角色'
        },
      });
    },
    * getAllMyRoles(s, {
      select,
      put,
      call,
    }) {
      const {
        liveid,
      } = yield select(state => state.chatRoom.currentRoom);
      const {
        userId: uid
      } = yield select(state => state.user.userInfo);
      const res = yield call(myRoles, {
        liveid,
        uid,
      });
      if (res && res.code === 0) {
        yield put({
          type: 'MyRoleList',
          payload: res.data,
        });
      }
    },
  }, // end effects
};
