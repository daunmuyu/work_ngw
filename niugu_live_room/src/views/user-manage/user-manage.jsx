import React from 'react';
import { connect } from 'dva';
import { Tabs, Table } from 'antd';

const TabPane = Tabs.TabPane;

class UserManage extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'usermanage/initNew'
    });
  }
  render() {
    const { usermanage } = this.props;
    return (
      <div className="user-page">
        <Tabs defaultActiveKey="1" onChange={this.tabChange}>
          <TabPane tab="当日新增用户" key="1">
            <Table rowSelection={this.rowSelection} columns={usermanage.newCol} onChange={this.newPageChange} dataSource={usermanage.newData} pagination={usermanage.page}/>
          </TabPane>
          <TabPane tab="临近到期用户" key="2">
            <Table rowSelection={this.rowSelection} columns={usermanage.soonCol} onChange={this.soonPageChange} dataSource={usermanage.soonData} pagination={usermanage.page}/>
          </TabPane>
          <TabPane tab="付费用户" key="3">
            <Table rowSelection={this.rowSelection} columns={usermanage.buyCol} dataSource={usermanage.buyData} onChange={this.buyPageChange} pagination={usermanage.page}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
  rowSelection = {
    type: 'checkbox',
    onChange() {
    }
  }
  tabChange = (key) => {
    switch (key) {
      case '1':
        this.props.dispatch({type: 'usermanage/initNew'});
        break;
      case '2':
        this.props.dispatch({type: 'usermanage/initSoon'});
        break;
      case '3':
        this.props.dispatch({type: 'usermanage/initBuy'});
        break;
      default:
    }
  }
  newPageChange = (page) => {
    this.props.dispatch({
      type: 'usermanage/updatePage',
      payload: page
    });
    this.props.dispatch({
      type: 'usermanage/initNew',
      payload: page
    });
  }
  soonPageChange = (page) => {
    this.props.dispatch({
      type: 'usermanage/updatePage',
      payload: page
    });
    this.props.dispatch({
      type: 'usermanage/initSoon',
      payload: page
    });
  }
  buyPageChange = (page) => {
    this.props.dispatch({
      type: 'usermanage/updatePage',
      payload: page
    });
    this.props.dispatch({
      type: 'usermanage/initBuy',
      payload: page
    });
  }
}

const mapManageToProps = (state) => {
  return {
    usermanage: state.usermanage
  };
};

export default connect(mapManageToProps)(UserManage);
