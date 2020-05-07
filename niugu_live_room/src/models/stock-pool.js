// 量化股票池
import {
  liveauth,
} from 'service/stock-pool.js';
// import {
//   openNotification,
// } from 'utils/tool.js';

export default {
  namespace: 'stockPool',
  state: {
    // 量化股票池
    data: [],
    pushtitle: '',
    riskcontent: '',
    selectdate: '',
    stocktip: '',
    title: '',
    strageyContent: '',
  },
  reducers: {
    StockData(state, {
      payload: stockData,
    }) {
      return {
        ...state,
        ...stockData,
      };
    },
  },
  effects: {
    * liveauth({ payload }, { put, call, select }) {
      const { liveid } = yield select(state => state.chatRoom.currentRoom);
      const res = yield call(liveauth, {
        liveid,
      });
      yield put({
        type: 'StockData',
        payload: res,
      });
    }
  }
};
