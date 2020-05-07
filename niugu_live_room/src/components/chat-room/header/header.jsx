import React from 'react';
import {
  connect,
} from 'dva';
import './header.scss';
import RoomSetting from '../room-setting/room-setting.jsx';
import Switch from '../switch/switch.jsx';

class Header extends React.Component {
  render() {
    return (
      <div className="chat-room-header clear bg-white">
        <div className="f-left">
          <RoomSetting/>
        </div>
        <div className="f-right">
          <Switch/>
        </div>
      </div>
    );
  }
}


export default connect()(Header);
