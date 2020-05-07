// 房间控制开关
import React from 'react';
import {
  connect,
} from 'dva';
import {
  Button,
  Icon,
  Spin,
  Tooltip,
} from 'antd';
import {
  openNotification,
} from 'utils/tool.js';
import './switch.scss';

class Switch extends React.Component {
  render() {
    return (
      <Spin spinning={this.props.liveSwitchLoading}>
        <div className="switch-wrap clear">
          <div className="live-status f-left">
            {this.renderLiveStatus()}
          </div>
          <div className="room-name f-left">
            {this.props.currentRoom.livetitle}
          </div>
          {
            this.renderSwitch()
          }
        </div>
      </Spin>
    );
  }

  renderSwitch = () => {
    if (!this.isAnchor()) {
      return (<span/>);
    }
    if (+this.props.currentRoom.IsVideo) {
      return (
        <Button className="btn-switch stop" type="f-right" onClick={() => this.handleVideoSwitch(0)}>
          <Icon type="pause-circle" />
          停止视频直播
        </Button>
      );
    }
    if (+this.props.currentRoom.liveswitch) {
      return (
        <Button className="btn-switch stop" type="f-right" onClick={() => this.handleLiveSwitch(0)}>
          <Icon type="pause-circle" />
          停止文字直播
        </Button>
      );
    }
    return (
      <Button className="btn-switch" type="danger f-right" onClick={() => this.handleLiveSwitch(1)}>
        <Icon type="play-circle-o" />
        开启文字直播
      </Button>
    );
  }
  isAnchor() {
    const {
      userId,
    } = this.props.userInfo;
    const {
      userid: anchorId
    } = this.props.currentRoom;
    return +userId === +anchorId;
  }

  handleLiveSwitch = (play) => {
    if (!this.isAnchor()) {
      openNotification({
        description: '您不是主播，不能执行该动作!',
      });
      return;
    }
    this.props.dispatch({
      type: 'chatRoom/liveSwitch',
      payload: Object.assign({}, this.props.currentRoom, {
        liveswitch: play,
      }),
    });
    return;
  }
  handleVideoSwitch = (play = 0) => {
    if (!this.isAnchor()) {
      openNotification({
        description: '您不是主播，不能执行该动作!',
      });
      return;
    }
    this.props.dispatch({
      type: 'chatRoom/videoSwitch',
      payload: Object.assign({}, this.props.currentRoom, {
        IsVideo: play,
      }),
    });
  }

  renderLiveStatus = () => {
    const {
      IsVideo: isVideo,
    } = this.props.currentRoom;
    if (+isVideo) {
      return (<Tooltip title="视频直播中"><span className="video-live"/></Tooltip>);
    }
    return '';
  }

}

function mapStateToProps(state) {
  return {
    userInfo: state.user.userInfo,
    currentRoom: state.chatRoom.currentRoom,
    liveSwitchLoading: state.chatRoom.liveSwitchLoading,
  };
}

export default connect(mapStateToProps)(Switch);
