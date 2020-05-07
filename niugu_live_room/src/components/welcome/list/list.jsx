// 角色列表

import React from 'react';
import {
  connect
} from 'dva';
import {
  Table,
  Button,
  Popconfirm,
} from 'antd';
import './list.scss';

// const columns = [{
//   title: '昵称',
//   dataIndex: 'UserName',
//   key: 'UserName'
// }, {
//   title: '角色',
//   dataIndex: 'roleName',
//   key: 'roleName',
// }, {
//   title: 'IM客服',
//   dataIndex: 'MService',
//   key: 'MService',
//   render: (text, record) => (
//     <span>{{1: '是', 0: '--'}[record.MService]}</span>
//   ),
// }, {
//   title: '操作',
//   key: 'action',
//   render: () => (
//     <Button>删除</Button>
//   ),
// }];


class List extends React.Component {
  state = {
    columns: [{
      title: '昵称',
      dataIndex: 'UserName',
      key: 'UserName'
    }, {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
    }, {
      title: 'IM助理',
      dataIndex: 'MService',
      key: 'MService',
      render: (text, record) => (
        <span>{{1: '是', 0: '--'}[record.MService]}</span>
      ),
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Popconfirm placement="topLeft" title="移除该用户?" onConfirm={() => this.handleRoleDelete(record)}>
          <Button>移除</Button>
        </Popconfirm>
      ),
    }]
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'role/getAllRole'
    });
  }

  render() {
    const {
      roomRoleList
    } = this.props;
    return (
      <div className="role-list-wrap">
        <h3>角色列表</h3>
        <Table columns={this.state.columns} dataSource={roomRoleList} />
      </div>
    );
  }
  handleRoleDelete = (item) => {
    this.props.dispatch({
      type: 'role/removeMember',
      payload: {
        roleid: item.roleId,
        uid: item.UserId,
      },
    });
  }

}

function mapStateToProps(state) {
  return {
    roomRoleList: state.role.roomRoleList,
  };
}

export default connect(mapStateToProps)(List);
