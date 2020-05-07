// 用户管理
import { openNotification } from 'utils/tool.js';
import { getNew, getBuy, getSoon } from 'service/usermanage.js';

const newCol = [{
  title: '用户',
  dataIndex: 'userName',
  key: 'userName'
}, {
  title: '首次进入时间',
  dataIndex: 'inTime',
  key: 'inTime'
}, {
  title: '观看时长',
  dataIndex: 'times',
  key: 'times',
  render(text) {
    return `${text}分`;
  }
}];

const buyCol = [{
  title: '用户',
  dataIndex: 'userName',
  key: 'userName'
}, {
  title: '购买时间',
  dataIndex: 'payTime',
  key: 'payTime'
}, {
  title: '购买周期',
  dataIndex: 'selCycle',
  key: 'selCycle'
}];

const soonCol = [{
  title: '用户',
  dataIndex: 'userName',
  key: 'userName'
}, {
  title: '购买时间',
  dataIndex: 'payTime',
  key: 'payTime'
}, {
  title: '到期时间',
  dataIndex: 'endTime',
  key: 'endTime'
}, {
  title: '剩余天数',
  dataIndex: 'toDay',
  key: 'toDay',
  render(text) {
    return `${text}天`;
  }
}];

export default {
  namespace: 'usermanage',
  state: {
    newCol,
    newData: [],
    page: {
      current: 1,
      pageSize: 20,
      total: ''
    },
    buyCol,
    buyData: [],
    soonCol,
    soonData: []
  },
  reducers: {
    updateNewData(state, { payload: newData }) {
      return { ...state, newData };
    },
    updateBuyData(state, { payload: buyData }) {
      return { ...state, buyData };
    },
    updateSoonData(state, { payload: soonData }) {
      return { ...state, soonData };
    },
    updatePage(state, { payload: page }) {
      return { ...state, page };
    }
  },
  effects: {
    * initNew(payload, { select, call, put }) {
      const { VideoChatRoom: liveID} = yield select(state => state.chatRoom.currentRoom);
      const userInfo = yield select(state => state.user.userInfo);
      const page = yield select(state => state.usermanage.page);
      if (!(userInfo && liveID)) return;
      const res = yield call(getNew, { usertoken: userInfo.userToken, liveID, currentpage: page.current });
      if (res.code === 0) {
        yield put({
          type: 'updateNewData',
          payload: res.NewUserList || []
        });
        yield put({
          type: 'updatePage',
          payload: {
            ...page,
            total: res.count || ''
          }
        });
      } else {
        openNotification({
          description: res.message || '操作失败，稍后重试',
        });
      }
    },
    * initSoon(payload, { select, call, put }) {
      const { userToken: usertoken } = yield select(state => state.user.userInfo);
      const page = yield select(state => state.usermanage.page);
      const res = yield call(getSoon, { usertoken, currentpage: page.current });
      if (res.code === 0) {
        yield put({
          type: 'updateSoonData',
          payload: res.SoonList || []
        });
        yield put({
          type: 'updatePage',
          payload: {
            ...page,
            total: res.count || ''
          }
        });
      } else {
        openNotification({
          description: res.message || '操作失败，稍后重试',
        });
      }
    },
    * initBuy(payload, { select, call, put }) {
      const page = yield select(state => state.usermanage.page);
      const { userToken: usertoken } = yield select(state => state.user.userInfo);
      const res = yield call(getBuy, { usertoken, selCycle: 0, currentpage: page.current});
      if (res.code === 0) {
        yield put({
          type: 'updateBuyData',
          payload: res.BuyList || []
        });
        yield put({
          type: 'updatePage',
          payload: {
            ...page,
            total: res.count || ''
          }
        });
      } else {
        openNotification({
          description: res.message || '操作失败，稍后重试',
        });
      }
    },
  }
};
