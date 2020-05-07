/**
 * 角色控制
 */
import React from 'react';
import {
  connect
} from 'dva';
import AddView from 'components/role/add/add.jsx';
import ListView from 'components/role/list/list.jsx';
import './role.scss';

class RoleView extends React.Component {
  render() {
    return (
      <div className="bg-white role-view">
        <h2>角色控制</h2>
        <AddView/>
        <ListView/>
      </div>
    );
  }
  init = () => {

  }
}

export default connect()(RoleView);
