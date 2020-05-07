// 消息列表
import React from 'react';
import {
  connect,
} from 'dva';
import ChatItem from '../chat-item/chat-item.jsx';
import './chat-list.scss';

class ChatList extends React.Component {
  constructor(params) {
    super(params);
    this.isFirst = true;
  }
  componentDidMount() {
    this.chatListDom = document.getElementById('chatHistory');
  }
  componentDidUpdate = () => {
    this.autoScrollBottom();
    setTimeout(() => {
      this.autoScrollBottom();
    }, 400);
  }
  render() {
    return (
      <div className="chat-list-wrap">
        <div className="chat-list bg-white" id="chatHistory">
          {
            this.renderMore()
          }
          {
            this.renderList()
          }
        </div>
        {this.renderNewTip()}
      </div>
    );
  }

  renderList = () => {
    const {
      chatHistoryList,
      onlyAnchorChat,
    } = this.props;
    if (chatHistoryList.length <= 0) {
      return (<div className="no-data">没有更多消息</div>);
    }
    return chatHistoryList.filter((item) => {
      if (onlyAnchorChat) {
        return item.isAnchor;
      }
      return true;
    }).map((item, index) => {
      return (<ChatItem info={item} key={index}/>);
    });
  }

  renderMore = () => {
    if (this.props.chatHistoryList.length) {
      return (
        <div onClick={this.handleLoadMore} className="load-more pointer">加载更多</div>
      );
    }
    return '';
  }

  autoScrollBottom = () => {
    // 向上有滚动，不需要滚动到底部
    const dis = this.caleDistance();
    if (dis) {
      return;
    }
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const chatListDom = document.querySelector('#chatHistory');
    if (chatListDom) {
      chatListDom.scrollTop = chatListDom.scrollHeight;
    }
  }
  handleLoadMore = () => {
    this.props.dispatch({
      type: 'im/NeedScrollBottom',
      payload: false,
    });
    this.props.dispatch({
      type: 'im/getChatHistory',
      payload: {
        id: this.props.chatHistoryList[0].id,
        direction: -1,
        order: -1,
      },
    });
  }

  caleDistance() {
    if (this.props.chatHistoryList.length > 0 && this.isFirst) {
      this.isFirst = false;
      return false;
    }
    // 处理切换直播间时的情况
    if (this.props.chatHistoryList.length === 20 && this.chatListDom.scrollTop === 0) {
      return false;
    }
    return (this.chatListDom.scrollHeight - this.chatListDom.scrollTop - 760) > 200;
  }

  renderNewTip() {
    if (this.props.hasNewMsg && this.caleDistance()) {
      return (
        <div className="has-new pointer" onClick={this.hideNewTip}>
          <span>
          查看新消息
          </span>
        </div>);
    }
    return '';
  }

  hideNewTip = () => {
    this.props.dispatch({
      type: 'im/HasNewMsg',
      payload: false,
    });
    this.scrollToBottom();
  }

}

function mapStateToProps(state) {
  return {
    currentRoom: state.chatRoom.currentRoom,
    chatHistoryList: state.im.chatHistoryList,
    onlyAnchorChat: state.im.onlyAnchorChat,
    hasNewMsg: state.im.hasNewMsg,
  };
}

export default connect(mapStateToProps)(ChatList);
