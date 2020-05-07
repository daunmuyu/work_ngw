import React from 'react';
import { connect } from 'dva';
import { Button, Table, Popconfirm, Input, Form, Pagination } from 'antd';

import './exercises.scss';

class RoleView extends React.Component {
  state = {
    pageSize: 20,
    col: [{
      title: '选入时间',
      dataIndex: 'addtime',
      key: 'addtime'
    }, {
      title: '股票名称',
      dataIndex: 'stockName',
      key: 'stockName'
    }, {
      title: '股票代码',
      dataIndex: 'stockCode',
      key: 'stockCode'
    }, {
      title: '选入原因',
      dataIndex: 'reason',
      key: 'reason'
    }, {
      title: '状态',
      dataIndex: 'market',
      key: 'market',
      render(text) {
        return <span>{text === 0 ? '已移除' : '选入'}</span>;
      }
    }, {
      title: '编辑',
      dataIndex: 'inTime',
      key: 'inTime',
      render: (text, record) => (
        <Popconfirm placement="top" title="移除该习题册?" onConfirm={() => this.handleDelete(record)}>
          <Button type="danger">移除</Button>
        </Popconfirm>
      ),
    }],
  }
  componentWillMount() {
    this.getList();
  }
  onChange = (e) => {
    this.setState({
      content: e.target.value,
    });
  }
  onChangeCode = (e) => {
    this.setState({
      stockCode: e.target.value,
    });
  }
  render() {
    const { exercises } = this.props;
    // const { getFieldDecorator, resetFields } = this.props.form;
    return (
      <div className="bg-white role-view">
        <h2>习题册管理</h2>
        <div className="input-wrap clear">
          <Form>
            <Input className="code" placeholder="股票代码" onChange={this.onChangeCode} value={this.state.stockCode}/>
            <Input.TextArea className="text" placeholder="选入理由100个字以内即可" onChange={this.onChange} value={this.state.content}/>
            <Button className="btn-add" type="primary" onClick={this.handleAdd}>添加</Button>
          </Form>
        </div>
        <Table columns={this.state.col} dataSource={exercises.list} />
        <Pagination onChange={(current) => { this.getList(current); }} total={exercises.listLength * this.state.pageSize} pageSize={this.state.pageSize} />
      </div>
    );
  }
  getList(current) {
    const { currentRoom } = this.props;
    if (currentRoom.VideoChatRoom) {
      this.props.dispatch({
        type: 'exercises/get',
        payload: {
          liveid: currentRoom.liveid,
          page: current || 1,
          pageSize: this.state.pageSize
        }
      });
    }
  }
  handleAdd = (e) => {
    e.preventDefault();
    if (!(this.state.content && this.state.stockCode)) return;
    this.props.dispatch({
      type: 'exercises/addcall',
      payload: {
        liveid: this.props.currentRoom.liveid,
        stockCode: this.state.stockCode,
        reason: this.state.content
      },
    });
  }
  handleDelete = (item) => {
    console.log(item);
    this.props.dispatch({
      type: 'exercises/delcall',
      payload: {
        ...item,
        state: 2
      },
    });
  }
  handleStop = (item) => {
    this.props.dispatch({
      type: 'exercises/update',
      payload: {
        ...item,
        state: item.deleteSign === 0 ? 1 : 0
      },
    });
  }
}

const mapexercisesToProps = (state) => {
  return {
    exercises: state.exercises,
    userInfo: state.user.userInfo,
    currentRoom: state.chatRoom.currentRoom
  };
};
export default connect(mapexercisesToProps)(Form.create()(RoleView));
