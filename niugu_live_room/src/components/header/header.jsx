import React, {
  Component
} from 'react';
import {
  connect
} from 'dva';
import NavMenu from '../nav-menu/nav-menu.jsx';
import './header.scss';


class Header extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className="top-header-wrap container clear">
        <div className="slogan f-left">
          牛人直播间
        </div>
        <NavMenu/>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    user: state.user
  };
})(Header);
