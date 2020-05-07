/**
 * 房间列表
 */
import React from 'react';
import {
  connect,
} from 'dva';
import {
  Icon,
  Spin,
} from 'antd';

import './room-list.scss';

class RoomList extends React.Component {
  render() {
    return (
      <div className="room-list">
        <Spin spinning={this.props.loading}>
          { this.renderList() }
        </Spin>
      </div>
    );
  }
  renderList = () => {
    return this.props.myRooms.map((item, index) => {
      return (
        <div
          className={this.setSelectedClass(item)}
          role="button"
          onClick={() => this.handleItemClick(item)}
          key={index}
        >
          <Icon type="team" />
          <span className="name">{item.livetitle}</span>
        </div>
      );
    });
  }

  setSelectedClass = (item) => {
    let clsName = 'item ';
    if (this.props.currentRoom.liveid === item.liveid) {
      clsName += ' active';
    }
    clsName += ` switch${item.liveswitch}`;
    clsName += ` video${item.IsVideo}`;
    return clsName;
  }

  handleItemClick = (payload) => {
    this.props.dispatch({
      type: 'chatRoom/selectedRoom',
      payload,
    });
    this.props.dispatch({
      type: 'exercises/show',
      payload: {
        usertoken: this.props.userInfo.userToken,
        liveid: payload.liveid
      }
    });
    this.props.dispatch({
      type: 'tactics/show',
      payload: {
        usertoken: this.props.userInfo.userToken,
        liveid: payload.liveid
      }
    });
    this.props.dispatch({
      type: 'strategy/show',
      payload: {
        usertoken: this.props.userInfo.userToken,
        liveid: payload.liveid
      }
    });
    this.props.dispatch({
      type: 'chatRoom/getList',
      payload
    });
  }
}

function mapStateToProps(state) {
  return {
    myRooms: state.chatRoom.myRooms,
    loading: state.chatRoom.myRoomsLoading,
    currentRoom: state.chatRoom.currentRoom,
    userInfo: state.user.userInfo
  };
}

export default connect(mapStateToProps)(RoomList);
