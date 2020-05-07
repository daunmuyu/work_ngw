// 推荐股票
import React from 'react';
import {
  connect,
} from 'dva';

import {
  Icon,
  // Popover,
  // Tooltip,
  Spin,
} from 'antd';
import {
  openNotification,
} from 'utils/tool.js';

import './recommend-stock.scss';

class RecommendStock extends React.Component {
  state = {
    visible: false,
  }
  render() {
    return (<span/>);
    // const {
    //   userInfo,
    //   currentRoom,
    // } = this.props;
    // if (+currentRoom.userid !== +userInfo.userId) {
    //   return <span/>;
    // }
    // return (
    //   <div className="recommend-stock">
    //     <Popover
    //       trigger="click"
    //       title="推荐股票"
    //       content={this.renderStockList()}
    //       visible={this.state.visible}
    //       onVisibleChange={this.handleVisibleChange}
    //     >
    //       <Tooltip placement="bottom" title="推荐股票">
    //         <Icon type="line-chart" className="pointer" />
    //       </Tooltip>
    //     </Popover>
    //   </div>
    // );
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }

  handleVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'user/recommendStockList',
        payload: {}
      });
    }
    this.setState({
      visible
    });
  }

  renderStockList = () => {
    return (
      <div className="stock-list">
        <Spin spinning={this.props.recommendStockLoading}>
          {
            this.renderItem()
          }
        </Spin>
      </div>
    );
  }

  renderItem = () => {
    if (this.props.recommendStocks.length <= 0) {
      return (<div>没有股票</div>);
    }
    return this.props.recommendStocks.map((item) => {
      return (
        <div className="stock-item pointer clear" onClick={() => this.handleStockItemClick(item)}>
          <span className="f-left">{item.StockName}</span>
          <span className="f-right"><Icon type="plus" /></span>
        </div>
      );
    });
  }

  handleStockItemClick = (item) => {
    if (!+this.props.currentRoom.liveswitch) {
      openNotification({
        description: '当前直播间尚未开始直播!',
      });
      return;
    }
    this.props.dispatch({
      type: 'im/sendMessage',
      payload: {
        content: '',
        roleID: '',
        ItemId: item.ItemId,
      },
    });
    this.hide();
  }

}

function mapStateToProps(state) {
  return {
    recommendStocks: state.user.recommendStocks,
    recommendStockLoading: state.user.recommendStockLoading,
    currentRoom: state.chatRoom.currentRoom,
    userInfo: state.user.userInfo,
  };
}

export default connect(mapStateToProps)(RecommendStock);
