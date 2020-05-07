import React from 'react';
import { connect } from 'dva';
import { Button, Table, Input, InputNumber, Form, Modal, Row, Col, Switch, Alert, Pagination } from 'antd';

import './tactics.scss';

const FormItem = Form.Item;
// const { TextArea } = Input;

class tacticsView extends React.Component {
  state = {
    visible: false,
    price: '',
    checked: true,
    callId: '',
    direction: true,
    pageSize: 10,
    isPush: true,
    col: [
      {
        title: '单号',
        dataIndex: 'callId',
        key: 'callId',
        sorter: (a, b) => a.callId - b.callId
      },
      {
        title: '直播间ID',
        dataIndex: 'liveId',
        key: 'liveId'
      },
      {
        title: '主播ID',
        dataIndex: 'userId',
        key: 'userId'
      },
      {
        title: '股票代码',
        dataIndex: 'stockName',
        key: 'stockName'
      },
      {
        title: '方向',
        dataIndex: 'directionName',
        key: 'directionName'
      },
      {
        title: '仓位',
        dataIndex: 'position',
        key: 'position'
      },
      {
        title: '添加时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '平仓时间',
        dataIndex: 'sellingTime',
        key: 'sellingTime'
      },
      {
        title: '开仓价',
        dataIndex: 'openingPrice',
        key: 'openingPrice'
      },
      {
        title: '平仓价',
        dataIndex: 'exitPrice',
        key: 'exitPrice'
      },
      {
        title: '止盈',
        dataIndex: 'targetProfitPrice',
        key: 'targetProfitPrice'
      },
      {
        title: '止损',
        dataIndex: 'stopLossPrice',
        key: 'stopLossPrice'
      },
      {
        title: '盈亏',
        dataIndex: 'profitAndLoss',
        key: 'profitAndLoss'
      },
      {
        title: '买入理由',
        dataIndex: 'reason',
        key: 'reason',
        width: '10%'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render(text) {
          return <span>{text === 0 ? '未平仓' : '已平仓'}</span>;
        }
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        render: (text, record) => (
          <div>
            <a
              onClick={() => {
                this.props.dispatch({
                  type: 'tactics/delcall',
                  payload: record
                });
              }}
              className="link"
            >删除</a>
            {record.status === 0 ? (<a
              className="link"
              onClick={() => {
                this.setState({
                  visible: true,
                  callId: record.callId,
                  price: ''
                });
              }}
            >平仓</a>) : ''}
          </div>
        )
      }
    ]
  };
  componentWillMount() {
    this.getList();
  }
  render() {
    const { tactics } = this.props;
    const { getFieldDecorator, resetFields } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    const formItemModal = {
      labelCol: { span: 5 },
      wrapperCol: { span: 10 }
    };
    return (
      <div className="bg-white role-view">
        <h2>港美股策略管理</h2>
        <div className="input-wrap clear">
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label="显示条数">
              <Input />
            </FormItem>
            <FormItem>
              <Button type="primary">确定</Button>
            </FormItem>
            <FormItem style={{ marginLeft: 120 }}>
              <Button
                type="primary"
                onClick={() => {
                  resetFields();
                  this.props.dispatch({
                    type: 'tactics/updateData',
                    payload: {
                      visible: true
                    }
                  });
                }}
              >
                发策略
              </Button>
            </FormItem>
          </Form>
        </div>
        <Modal
          title="设置平仓价"
          visible={this.state.visible}
          // onOk={this.handleClosedPosition}
          onOk={() => {
            this.props.dispatch({
              type: 'tactics/stop',
              payload: {
                callId: this.state.callId,
                isPush: this.state.checked ? 1 : 0,
                price: this.state.price,
                usertoken: this.props.userInfo.userToken,
                liveId: this.props.currentRoom.liveid
              }
            });
            this.setState({
              visible: false
            });
          }}
          onCancel={() => {
            this.setState({
              visible: false
            });
          }}
        >
          <Form>
            <FormItem {...formItemModal} label="平仓价格">
              <Input placeholder="平仓价格" value={this.state.price} onChange={(e) => { this.setState({ price: e.target.value }); }}/>
            </FormItem>
            <FormItem {...formItemModal} label="是否推送" >
              <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked onChange={(checked) => { this.setState({ checked }); }}/>
              {/* {getFieldDecorator('closeIsPush', {
                initialValue: true,
                rules: [{ required: false, message: '是否推送' }],
                valuePropName: 'checked'
              })(<Switch checkedChildren="是" unCheckedChildren="否" />)} */}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="发布策略"
          visible={tactics.visible}
          onOk={this.handleAdd}
          onCancel={() => {
            this.props.dispatch({
              type: 'tactics/updateData',
              payload: {
                visible: false
              }
            });
          }}
        >
          <Form>
            <Row>
              <Col span={24}>
                <FormItem>
                  <Alert style={{color: 'red'}} message="策略发出，交流区策略将不可修改，请确认后操作" type="warning" showIcon="false" />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="股票代码">
                  {getFieldDecorator('stockName', {
                    rules: [{ required: true, message: '请输入股票代码' }]
                  })(<Input placeholder="股票代码" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="开仓价格">
                  {getFieldDecorator('openingPrice', {
                    rules: [{ required: true, message: '请输入开仓价格' }]
                  })(<Input placeholder="开仓价格" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="止盈">
                  {getFieldDecorator('targetProfitPrice', {
                    rules: [{ required: true, message: '请输入止盈' }]
                  })(<InputNumber placeholder="止盈" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="止损">
                  {getFieldDecorator('stopLossPrice', {
                    rules: [{ required: true, message: '请输入止损' }]
                  })(<InputNumber placeholder="止损" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="仓位">
                  {getFieldDecorator('position', {
                    rules: [{ required: true, message: '请输入仓位' }]
                  })(<InputNumber
                    placeholder="仓位" min={0}
                    max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')}
                  />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label="买入理由">
                  {getFieldDecorator('reason', {
                    rules: [{ required: true, message: '请输入买入理由', initialValue: '' }]
                  })(<Input rows={4} placeholder="买入理由" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="方向">
                  {getFieldDecorator('direction', {
                    initialValue: true,
                    rules: [{ required: false, message: '请选择方向' }],
                    valuePropName: 'checked'
                  })(
                    <Switch checkedChildren="做多" unCheckedChildren="做空" />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="是否推送">
                  {getFieldDecorator('isPush', {
                    initialValue: true,
                    rules: [{ required: false, message: '是否推送' }],
                    valuePropName: 'checked'
                  })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Table columns={this.state.col} dataSource={tactics.list} />
        <Pagination onChange={(current) => { this.getList(current); }} total={tactics.listLength * this.state.pageSize} pageSize={this.state.pageSize} />
      </div>
    );
  }
  getList(current) {
    const { currentRoom } = this.props;
    if (currentRoom.VideoChatRoom) {
      this.props.dispatch({
        type: 'tactics/get',
        payload: {
          liveid: currentRoom.liveid,
          pageIndex: current || 1,
          pageSize: this.state.pageSize
        }
      });
    }
  }
  handleAdd = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const payload = {
        ...values,
        direction: values.direction ? 1 : 2,
        isPush: values.isPush ? 1 : 0,
        liveId: this.props.currentRoom.liveid,
        roomId: this.props.currentRoom.VideoChatRoom,
        userid: this.props.currentRoom.userid,
        userToken: this.props.userInfo.userToken
      };
      this.props.dispatch({
        type: 'tactics/addcall',
        payload
      });
    });
  };
  // 设置平仓价格加推送开关
  // handleClosedPosition = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     console.log(values);
  //     if (err) return;
  //     console.log(`Received${values}`);
  //     const payload = {
  //       ...values,
  //       price: this.state.price,
  //       isPush: values.closeIsPush ? 1 : 0,
  //       callId: this.state.callId,
  //       usertoken: this.props.userInfo.userToken,
  //       liveId: this.props.currentRoom.liveid,
  //     };
  //     this.props.dispatch({
  //       type: 'tactics/stop',
  //       payload,
  //     });
  //     this.setState({
  //       visible: false
  //     });
  //   });
  // }
  handleDelete = (item) => {
    this.props.dispatch({
      type: 'welcome/update',
      payload: {
        ...item,
        state: 2
      }
    });
  };
  handleStop = (item) => {
    this.props.dispatch({
      type: 'welcome/update',
      payload: {
        ...item,
        state: item.deleteSign === 0 ? 1 : 0
      }
    });
  };
}

const mapTacticsToProps = (state) => {
  return {
    tactics: state.tactics,
    userInfo: state.user.userInfo,
    currentRoom: state.chatRoom.currentRoom
  };
};

export default connect(mapTacticsToProps)(Form.create()(tacticsView));
