import React from 'react';
import {connect} from 'dva';

class List extends React.Component {
  render() {
    return (
      <div>
        <h2>product List
        </h2>
      </div>
    );
  }
  initData = () => {
  }
}

export default connect()(List);
