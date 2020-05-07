// 成员列表
// 用户列表，禁言列表，黑名单列表

import React from 'react';
import {
  Tabs,
  Icon,
  Spin,
} from 'antd';
import {
  connect,
} from 'dva';
import UserItem from '../user-item/user-item.jsx';
import './member-tab.scss';

const TabPane = Tabs.TabPane;

class MemberTab extends React.Component {
  componentDidUpdate() {
    // this.getRoomMembers();
  }
  render() {
    return (
      <Spin spinning={this.props.memberLoading}>
        <Tabs defaultActiveKey="1" size="small" className="member-tab-wrap">
          <TabPane tab={<span><Icon type="user" />用户</span>} key="1">
            {
              this.renderMemberList()
            }
          </TabPane>
          <TabPane tab={<span><Icon type="minus-circle-o" />禁言</span>} key="2">
            {this.renderForbidList()}
          </TabPane>
          <TabPane tab={<span><Icon type="close-circle-o" />黑名单</span>} key="3">
            {this.renderBlackList()}
          </TabPane>
        </Tabs>
      </Spin>
    );
  }

  renderMemberList() {
    const {
      members,
      forbidList,
      blackList,
    } = this.props;
    const disableUser = [];
    forbidList.forEach((item) => {
      disableUser.push(item.nick);
    });
    blackList.forEach((item) => {
      disableUser.push(item.nick);
    });
    const list = members.filter((item) => {
      return disableUser.indexOf(item.nick) < 0;
    });
    const result = [];
    const users = [];
    list.forEach((item) => {
      if (result.indexOf(item.nick) < 0) {
        result.push(item.nick);
        users.push(item);
      }
    });

    return users.map((item, index) => {
      return (<UserItem info={item} key={index}/>);
    });
  }
  renderForbidList = () => {
    const {
      forbidList,
    } = this.props;
    if (!forbidList || forbidList.length <= 0) {
      return (<div className="user-item">没有更多记录</div>);
    }
    return forbidList.map((item, index) => {
      return (<UserItem info={item} type="forbid" key={index}/>);
    });
  }
  renderBlackList = () => {
    // return (<div className="user-item">没有更多记录</div>);
    const {
      blackList,
    } = this.props;
    if (!blackList || blackList.length <= 0) {
      return (<div className="user-item">没有更多记录</div>);
    }
    return blackList.map((item, index) => {
      return (<UserItem info={item} type="black" key={index}/>);
    });
  }
  // getRoomMembers() {
  // this.props.chatRoomInstance.getChatroomMembers({
  //   guest: false,
  //   limit: 100,
  //   done: (err, obj) => {
  //     if (!err) {
  //       console.log('members = ', err, obj);
  //     }
  //   },
  // });
  // }
} // end class

function mapStateToProps(state) {
  return {
    members: state.im.members,
    memberLoading: state.im.memberLoading,
    chatRoomInstance: state.im.chatRoomInstance,
    forbidList: state.im.forbidList,
    blackList: state.im.blackList,
  };
}

export default connect(mapStateToProps)(MemberTab);
