import { SET_ROOMID } from './type';

export default {
  state: {
    roomId: '',
    liveToken: '',
    isPublic: false,
    temName: '',
    liveInfo: {}
  },
  mutations: {
    [SET_ROOMID](state, payload) {
      state.roomId = payload;
    }
  },
  getters: {
    roomId({ roomId }) {
      return roomId;
    }
  }
}
