import React from 'react';
import {
  connect
} from 'dva';
import {
  Button, Table, Input, Pagination,
} from 'antd';

import './intraday.scss';

class RoleView extends React.Component {
  state = {
    pageSize: 5,
    current: 1,
    col: [{
      title: '时间',
      dataIndex: 'createtime',
      key: 'createtime',
    }, {
      title: '老师',
      dataIndex: 'username',
      key: 'username'
    }, {
      title: '大盘解析',
      dataIndex: 'analysis',
      key: 'analysis',
    }, {
      title: '热点透视',
      dataIndex: 'prespective',
      key: 'prespective',
    }, {
      title: '大盘风险提醒',
      dataIndex: 'warning',
      key: 'warning',
    }],
  }
  componentWillMount() {
    this.getList();
  }
  onChangeAnalysis = (e) => {
    this.setState({
      analysis: e.target.value,
    });
  }
  onChangePrespective = (e) => {
    this.setState({
      prespective: e.target.value,
    });
  }
  onChangeWarning = (e) => {
    this.setState({
      warning: e.target.value,
    });
  }
  render() {
    const { intraday } = this.props;
    console.log(intraday);
    return (
      <div className="bg-white intraday-view">
        <h2>盘中播报</h2>
        <div className="input-wrap clear">
          <Input.TextArea placeholder="大盘解析" className="text" onChange={this.onChangeAnalysis} value={this.state.analysis}/>
        </div>
        <div className="input-wrap clear">
          <Input.TextArea placeholder="热点透视" className="text" onChange={this.onChangePrespective} value={this.state.prespective}/>
        </div>
        <div className="input-wrap clear">
          <Input.TextArea placeholder="大盘风险提醒" className="text" onChange={this.onChangeWarning} value={this.state.warning}/>
          <Button className="btn-add" type="primary" onClick={this.handleAdd}>添加</Button>
        </div>
        <Table rowKey={record => record.id} columns={this.state.col} dataSource={intraday.list.data} />
        <Pagination onChange={(current) => { this.getList(current); }} total={intraday.list.pagecount * this.state.pageSize} pageSize={this.state.pageSize} />
      </div>
    );
  }
  getList = (pageindex = 1) => {
    console.log(pageindex);
    const { currentRoom, userInfo } = this.props;
    if (currentRoom.VideoChatRoom) {
      this.props.dispatch({
        type: 'intraday/get',
        payload: {
          usertoken: userInfo.userToken,
          roomid: currentRoom.VideoChatRoom,
          pageindex,
          pagesize: this.state.pageSize,
        }
      });
    }
  }
  handleAdd = () => {
    this.props.dispatch({
      type: 'intraday/update',
      payload: {
        analysis: this.state.analysis,
        prespective: this.state.prespective,
        warning: this.state.warning,
      },
    });
    // this.getList();
    this.setState({
      analysis: '',
      prespective: '',
      warning: '',
    });
  }
}

const mapIntradayToProps = (state) => {
  return {
    intraday: state.intraday,
    userInfo: state.user.userInfo,
    currentRoom: state.chatRoom.currentRoom
  };
};
export default connect(mapIntradayToProps)(RoleView);
