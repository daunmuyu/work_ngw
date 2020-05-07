/**
 * 量化股票池
 */
import React from 'react';
import {
  connect
} from 'dva';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Table, Button, List} from 'antd';
import './index.scss';

const { Column } = Table;

class RoleView extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'stockPool/liveauth'
    });
  }
  onCopys = () => {
  }
  render() {
    return (
      <div className="bg-white role-view">
        <h2>{this.props.stockPool.title}</h2>
        <p>{this.props.stockPool.pushtitle}</p>
        <hr className="line"/>
        <p className="riskcontent">{this.props.stockPool.riskcontent}</p>
        <Table dataSource={this.props.stockPool.data}>
          <Column
            title="入选时间"
            dataIndex="selectTime"
            key="selectTime"
          />
          <Column
            title="股票代码"
            dataIndex="stockcode"
            key="stockcode"
          />
          <Column
            title="股票名称"
            dataIndex="stockname"
            key="stockname"
          />
        </Table>
        <p className="tmps">话术模板</p>
        <div className="tempbox">
          <p>{this.props.stockPool.selectdate}</p>
          <p>{this.props.stockPool.stocktip}</p>
          <List
            dataSource={this.props.stockPool.data}
            renderItem={(item, idx) => (<List.Item key={idx}>{item.stockcode} &nbsp; &nbsp; {item.stockname}</List.Item>)}
          />
          <p className="riskcontent">{this.props.stockPool.riskcontent}</p>
          <div>
            <CopyToClipboard text={this.props.stockPool.strageyContent} onCopy={this.onCopys}>
              <Button data-clipboard-target="#bar" type="primary" onClick={this.copyClick}>复制</Button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  }
  copyClick = () => {

  }
}


const mapStockToProps = (state) => {
  return {
    stockPool: {
      ...state.stockPool,
    },
  };
};

export default connect(mapStockToProps)(RoleView);
