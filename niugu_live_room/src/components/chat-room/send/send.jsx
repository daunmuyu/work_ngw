// 发送消息组件
import React from 'react';
import {
  connect
} from 'dva';
import {
  Button,
  // Icon,
  Switch,
  Modal,
} from 'antd';
import NIM from 'nim';
import {
  openNotification,
} from 'utils/tool.js';
import {
  appKey,
} from 'service/IMHelper.js';
import SelectMessage from 'components/select-message/select-message.jsx';
import RoleList from '../my-roles/my-roles.jsx';
import ForbidAll from '../forbid-all/forbid-all.jsx';
import './send.scss';


import SendBox from '../send-box/send-box.jsx';

// const imInstance = {};

class Send extends React.Component {
  state = {
    // imInstance: {},
  }
  componentDidUpdate() {
    setTimeout(() => {
      this.getInstance();
    }, 1500);
  }

  onconnect = (data) => {
    const temp = data;
    if (data && data.chatroom) {
      this.props.dispatch({
        type: 'im/setChatRoomInfo',
        payload: temp.chatroom,
      });
      this.props.dispatch({
        type: 'im/getChatroomMembers',
        payload: null,
      });
    }
    this.getChatRoomMembers();
  }
  onerror = () => {
    Modal.warning({
      title: '提示',
      content: '直播间聊天室链接错误',
      okText: '重新进入',
      onOk: this.pageReload,
      onCancel: this.pageReload,
    });
  }
  onwillreconnect = () => {
  }
  ondisconnect = (data) => {
    switch (data.code) {
      case 'kicked':
        this.showkickoutTip(data);
        break;
      default:
    }
  }
  onmsgs = (data) => {
    this.handleMemberStatus(data);
    const list = this.convertToMsgObj(data);
    if (list && list.length > 0) {
      this.props.dispatch({
        type: 'im/HasNewMsg',
        payload: true,
      });
      this.props.dispatch({
        type: 'im/AddChatHistory',
        payload: list,
      });
    }
  }
  render() {
    return (
      <div className="send-wrap bg-white">
        <div className="header-bar clear">
          <SelectMessage/>
          {this.renderReply()}
          <div className="f-right">
            只看主播&nbsp;<Switch onChange={this.handleSwitchChanged} size="small"/>
          </div>
          <ForbidAll/>
          <div className="f-right">
            <RoleList/>
          </div>
        </div>
        <SendBox/>
      </div>
    );
  }
  getInstance() {
    if (!this.props.userInfo.userId) {
      return;
    }
    try {
      const instance = this.initIM();
      this.props.dispatch({
        type: 'im/ChatRoomInstance',
        payload: instance,
      });
    } catch (e) {
      openNotification({
        title: '消息',
        description: '进入直播间失败，请尝试刷新整个页面',
        duration: 10
      });
    }
  }
  initIM() {
    const im = NIM.getInstance({
      appKey,
      account: this.props.userInfo.userId,
      token: this.props.userInfo.chatToken,
      chatroomId: this.props.currentRoom.VideoChatRoom,
      chatroomAddresses: this.props.chatRoomAddr,
      onconnect: this.onconnect,
      onerror: this.onerror,
      onwillreconnect: this.onwillreconnect,
      ondisconnect: this.ondisconnect,
      onmsgs: this.onmsgs,
    });
    return im;
  }
  // 获取直播间用户
  getChatRoomMembers() {
    const {
      chatRoomInstance,
      dispatch,
    } = this.props;
    const uniqeByKeys = this.uniqeByKeys;

    chatRoomInstance.getChatroomMembers({
      guest: false,
      limit: 200,
      done: (error, data) => {
        if (!error && data && data.members.length > 0) {
          dispatch({
            type: 'im/setMembers',
            payload: uniqeByKeys(data.members, ['account']),
          });
        }
      },
    });
  }

  obj2keys = (obj, keys) => {
    let n = keys.length;
    const key = [];
    while (n > -1) {
      n -= 1;
      key.push(obj[keys[n]]);
    }
    return key.join('|');
  }

  uniqeByKeys = (array, keys) => {
    const arr = [];
    const hash = {};
    for (let i = 0, j = array.length; i < j; i += 1) {
      const k = this.obj2keys(array[i], keys);
      if (!(k in hash)) {
        hash[k] = true;
        arr.push(array[i]);
      }
    }
    return arr;
  }

  pageReload = () => {
    window.location.reload();
  }
  // 转换消息对象
  convertToMsgObj = (list) => {
    const {
      userId,
    } = this.props.userInfo;
    const {
      VideoChatRoom: chatroomId,
    } = this.props.currentRoom;
    return list.filter(item => item.status === 'success' && item.type === 'custom' && +item.chatroomId === +chatroomId).map((item) => {
      const temp = JSON.parse(item.custom);
      temp.content = {
        content: '',
      };
      if (temp.contentFormat && temp.contentFormat.length > 0) {
        temp.content = temp.contentFormat[0];
      }
      if (+userId === +temp.userId) {
        temp.isAnchor = true;
      } else {
        temp.isAnchor = false;
      }
      temp.userFlag = +temp.userIcons[0];
      return temp;
    });
  }

  handleSwitchChanged = (val) => {
    this.props.dispatch({
      type: 'im/anchorChatList',
      payload: val,
    });
  }
  // 渲染回复
  renderReply = () => {
    if (this.props.byReply && this.props.byReply.userId) {
      return (
        <div className="reply f-left">
          回复<span className="name">@{this.props.byReply.userName}</span>
          <Button onClick={this.handleDelReply} className="del-reply" icon="close-circle" shape="circle"/>
        </div>);
    }
    return '';
  }
  // 删除被回复人
  handleDelReply = () => {
    this.props.dispatch({
      type: 'im/DelByReply',
    });
  }
  // 用户加入房间
  handleMemberStatus = (data) => {
    const {
      VideoChatRoom: roomId,
    } = this.props.currentRoom;
    const list = data.filter(item => item.type === 'notification' && (item.flow === 'in' || item.flow === 'out') && item.chatroomId === roomId);
    if (list && list.length > 0) {
      this.memberJoinORLeave(list);
    }
  }
  memberJoinORLeave = (list) => {
    let i = 0;
    const j = list.length;
    const {
      members
    } = this.props;
    const {
      userId,
    } = this.props.userInfo;
    for (; i < j; i += 1) {
      const item = list[i];
      const temp = members.find(m => m.account === item.attach.from);
      if (!temp && item.flow === 'in') {
        this.props.dispatch({
          type: 'im/MembersJoin',
          payload: [{
            account: item.attach.from,
            avatar: 'https://img.niuguwang.com/avatar/default_avatar.png',
            nick: item.attach.fromNick,
          }],
        });
      } else if (item.flow === 'out' && +item.attach.from !== +userId) {
        console.log('不知道要干啥');
      }
    }
  }
  // 显示被踢出提示
  showkickoutTip = (data) => {
    Modal.warning({
      title: '警告',
      content: data.message,
      okText: '重新进入',
      onOk: this.pageReload,
      onCancel: this.pageReload,
    });
  }

} // end class

function mapStateToProps(state) {
  return {
    currentRoom: state.chatRoom.currentRoom,
    userInfo: state.user.userInfo,
    chatRoomAddr: state.im.chatRoomAddr,
    chatRoomInfo: state.im.chatRoomInstance,
    chatRoomInstance: state.im.chatRoomInstance,
    byReply: state.im.byReply,
    members: state.im.members,
  };
}

export default connect(mapStateToProps)(Send);
