// 当前房间可用角色
import React from 'react';
import {
  connect,
} from 'dva';
import {
  Menu,
  Dropdown,
  // Icon,
} from 'antd';
import './my-roles.scss';

class MyRoles extends React.Component {
  state = {
    currentRoleName: '选择角色'
  }
  render() {
    return (
      <div className="my-role-list">
        {this.renderDropdown()}
      </div>);
  }

  renderDropdown = () => {
    if (this.props.myRoleList.length > 0) {
      const menu = this.renderMenu();
      return (
        <Dropdown.Button overlay={menu}>
          {this.props.currentRole.rolename}
        </Dropdown.Button>
      );
    }
    return '';
  }

  renderMenu = () => {
    return (
      <Menu onClick={this.handleMenuItemClick}>
        <Menu.Item key="0">不使用角色</Menu.Item>
        {
          this.props.myRoleList.map((item) => {
            return (
              <Menu.Item key={item.roleid}>{item.rolename}</Menu.Item>
            );
          })
        }
      </Menu>
    );
  }

  handleMenuItemClick = (data) => {
    if (+data.key === 0) {
      this.props.dispatch({
        type: 'role/resetCurrentRole',
      });
    } else {
      const selected = this.props.myRoleList.filter(item => +item.roleid === +data.key);
      if (selected && selected.length > 0) {
        this.props.dispatch({
          type: 'role/CurrentRole',
          payload: selected[0],
        });
      } else {
        this.props.dispatch({
          type: 'role/resetCurrentRole',
        });
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    myRoleList: state.role.myRoleList,
    currentRole: state.role.currentRole,
  };
}

export default connect(mapStateToProps)(MyRoles);
