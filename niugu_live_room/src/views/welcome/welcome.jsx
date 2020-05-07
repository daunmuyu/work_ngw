import React from 'react';
import {
  connect
} from 'dva';
import {
  Button, Table, Popconfirm, Input
} from 'antd';

import './welcome.scss';

class RoleView extends React.Component {
  state = {
    col: [{
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render(text, record, index) {
        return <span>{index + 1}</span>;
      }
    }, {
      title: '内容',
      dataIndex: 'customContent',
      key: 'customContent'
    }, {
      title: '状态',
      dataIndex: 'deleteSign',
      key: 'deleteSign',
      render(text) {
        return <span>{text === 0 ? '使用中' : '停用'}</span>;
      }
    }, {
      title: '停用',
      dataIndex: 'option',
      key: 'option',
      render: (text, record) => (
        <Button type="primary" onClick={() => this.handleStop(record)}>{record.deleteSign === 0 ? '停用' : '启用'}</Button>
      )
    }, {
      title: '删除',
      dataIndex: 'inTime',
      key: 'inTime',
      render: (text, record) => (
        <Popconfirm placement="top" title="删除该欢迎语?" onConfirm={() => this.handleDelete(record)}>
          <Button type="danger">删除</Button>
        </Popconfirm>
      ),
    }],
  }
  componentWillMount() {
    const { currentRoom, userInfo } = this.props;
    if (currentRoom.VideoChatRoom) {
      this.props.dispatch({
        type: 'welcome/get',
        payload: {
          usertoken: userInfo.userToken,
          roomid: currentRoom.VideoChatRoom,
        }
      });
    }
  }
  onChange = (e) => {
    this.setState({
      content: e.target.value,
    });
  }
  render() {
    const { welcome } = this.props;
    return (
      <div className="bg-white role-view">
        <h2>老师助理欢迎语设置</h2>
        <div className="input-wrap clear">
          <Input.TextArea className="text" onChange={this.onChange} value={this.state.content}/>
          <Button className="btn-add" type="primary" onClick={this.handleAdd}>添加</Button>
        </div>
        <Table columns={this.state.col} dataSource={welcome.list} />
      </div>
    );
  }
  handleAdd = () => {
    if (!this.state.content) return;
    this.props.dispatch({
      type: 'welcome/update',
      payload: {
        customContent: this.state.content,
        id: 0,
        liveid: this.props.currentRoom.liveid
      },
    });
  }
  handleDelete = (item) => {
    this.props.dispatch({
      type: 'welcome/update',
      payload: {
        ...item,
        state: 2
      },
    });
  }
  handleStop = (item) => {
    this.props.dispatch({
      type: 'welcome/update',
      payload: {
        ...item,
        state: item.deleteSign === 0 ? 1 : 0
      },
    });
  }
}

const mapWelcomeToProps = (state) => {
  return {
    welcome: state.welcome,
    userInfo: state.user.userInfo,
    currentRoom: state.chatRoom.currentRoom
  };
};
export default connect(mapWelcomeToProps)(RoleView);
