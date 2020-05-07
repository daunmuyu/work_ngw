/**
 * 聊天室
 */
import React from 'react';
import {
  connect
} from 'dva';
import {
  Spin,
} from 'antd';
import ChatHeader from 'components/chat-room/header/header.jsx';
import ChatList from 'components/chat-room/chat-list/chat-list.jsx';
import SendView from 'components/chat-room/send/send.jsx';

class ChatRoom extends React.Component {
  render() {
    return (
      <div>
        <Spin spinning={this.props.initIMLoading} size="large" tip="加载中">
          <div>
            <ChatHeader/>
          </div>
          <ChatList/>
          <SendView/>
        </Spin>
      </div>
    );
  }
  init = () => {

  }
}

function mapStateToProps(state) {
  return {
    initIMLoading: state.im.initIMLoading,
  };
}

export default connect(mapStateToProps)(ChatRoom);
