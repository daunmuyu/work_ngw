// 选择消息
import React from 'react';
import {
  connect,
} from 'dva';
import {
  openNotification,
} from 'utils/tool.js';
import {
  Button,
} from 'antd';
import './select-message.scss';

const ButtonGroup = Button.Group;

class SelectMessage extends React.Component {
  render() {
    const {
      userInfo,
      currentRoom,
    } = this.props;
    if (+currentRoom.userid !== +userInfo.userId) {
      return <span/>;
    }
    return (
      <div className="select-message-wrap">
        <span>封面消息设置：</span>
        <ButtonGroup>
          <Button onClick={this.handleSelected} type="primary">确认选择</Button>
          <Button onClick={this.handleClearAll}>清除所选</Button>
        </ButtonGroup>
      </div>
    );
  }

  handleSelected = () => {
    const list = this.findAllDoms();
    const selected = [];
    for (let j = list.length; j > 0; j -= 1) {
      if (list[j - 1].checked) {
        selected.push(list[j - 1].getAttribute('data-msgid'));
      }
    }
    const len = selected.length;
    if (len < 4 || len > 10) {
      openNotification({
        description: `推荐消息4~10为宜，当前选中:${len}条`,
      });
      return;
    }
    this.props.dispatch({
      type: 'bussiness/updateSelectedMsg',
      payload: {
        msgId: selected.join(','),
        liveid: this.props.currentRoom.liveid,
      },
    });
  }

  handleClearAll = () => {
    const list = this.findAllDoms();
    for (let j = list.length; j > 0; j -= 1) {
      list[j - 1].checked = false;
    }
  }

  findAllDoms = () => {
    return document.querySelectorAll('.select .chat-checkbox');
  }
}

function mapStateToProps(state) {
  return {
    currentRoom: state.chatRoom.currentRoom,
    userInfo: state.user.userInfo,
  };
}

export default connect(mapStateToProps)(SelectMessage);
