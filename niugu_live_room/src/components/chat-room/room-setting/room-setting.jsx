/**
 * 房间信息设置
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs, Tooltip, Button, Modal, Form, Input } from 'antd';

import './room-setting.scss';

const FormItem = Form.Item;

const TabPane = Tabs.TabPane;

class RoomSetting extends React.Component {
  state = {
    key: {
      theme: parseInt(Math.random() * 10000, 10),
      notice: parseInt(Math.random() * 1000, 10),
      welcome: parseInt(Math.random() * 100, 10),
      advance: parseInt(Math.random() * 100, 10)
    },
    temp: {}
  };

  render() {
    const { currentRoom, chatRoomInfo } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <Tabs animated={false} className="room-setting">
        <TabPane tab="主题" key="1">
          <Tooltip title={currentRoom.livename} placement="bottom">
            {currentRoom.livename}
          </Tooltip>
          <Button
            type="dashed"
            icon="edit"
            onClick={() => this.showEditModal('theme', true)}
          >
            修改
          </Button>
          <Modal
            title="房间主题"
            maskClosable="false"
            key={this.state.key.theme}
            visible={this.props.editModal.theme}
            confirmLoading={this.props.editModal.themeLoading}
            onOk={this.handleThemeOK}
            onCancel={() => this.showEditModal('theme', false)}
            afterClose={() => this.modalAfterClose('theme')}
          >
            <Form>
              <FormItem>
                {getFieldDecorator('theme', {
                  initialValue: currentRoom.livename,
                  rules: [{ required: true, message: '请输入房间主题' }]
                })(<Input placeholder="请输入新主题" />)}
              </FormItem>
            </Form>
          </Modal>
        </TabPane>
        <TabPane tab="公告" key="2">
          <Tooltip title={chatRoomInfo.announcement} placement="bottom">
            <span className="notice">
              {chatRoomInfo.announcement || '暂无公告'}
            </span>
          </Tooltip>
          <Button
            type="dashed"
            icon="edit"
            onClick={() => this.showEditModal('notice', true)}
          >
            修改
          </Button>
          <Modal
            title="房间公告"
            key={this.state.key.notice}
            maskClosable="false"
            visible={this.props.editModal.notice}
            confirmLoading={this.props.editModal.noticeLoading}
            onOk={this.handleNoticeOK}
            onCancel={() => this.showEditModal('notice', false)}
            afterClose={() => this.modalAfterClose('notice')}
          >
            <Form>
              <FormItem>
                {getFieldDecorator('notice', {
                  initialValue: chatRoomInfo.announcement,
                  rules: [{ required: true, message: '请输入房间公告' }]
                })(<Input type="textarea" placeholder="请输入房间公告" />)}
              </FormItem>
            </Form>
          </Modal>
        </TabPane>
        <TabPane tab="欢迎语" key="3">
          <Tooltip title={this.getWelcomeTip()} placement="bottom">
            {this.getWelcomeTip()}
          </Tooltip>
          <Button
            type="dashed"
            icon="edit"
            onClick={() => this.showEditModal('welcome', true)}
          >
            修改
          </Button>
          <Modal
            title="欢迎语"
            key={this.state.key.welcome}
            maskClosable="false"
            visible={this.props.editModal.welcome}
            confirmLoading={this.props.editModal.welcomeLoading}
            onOk={this.handleWelcomeOK}
            onCancel={() => this.showEditModal('welcome', false)}
            afterClose={() => this.modalAfterClose('welcome')}
          >
            <Form>
              <FormItem>
                {getFieldDecorator('welcome', {
                  initialValue: this.getWelcomeTip(),
                  rules: [{ required: true, message: '请输入欢迎语' }]
                })(<Input type="textarea" placeholder="请输入欢迎语" />)}
              </FormItem>
            </Form>
          </Modal>
        </TabPane>
        <TabPane tab="直播预告" key="4">
          <div>{this.renderAdvanceList()}</div>
          <Modal
            title="直播预告"
            key={this.state.key.advance}
            maskClosable="false"
            visible={this.props.editModal.advance}
            confirmLoading={this.props.editModal.advanceLoading}
            onOk={this.handleAdvanceOK}
            onCancel={() => this.showEditModal('advance', false)}
            afterClose={() => this.modalAfterClose('advance')}
          >
            <Form>
              <FormItem label="讲师" {...formItemLayout}>
                {getFieldDecorator('advance.name', {
                  initialValue: this.getAdvanceTip().name,
                  rules: [{ required: true, message: '请输入讲师' }]
                })(<Input type="text" placeholder="请输入讲师" />)}
              </FormItem>
              <FormItem label="主题" {...formItemLayout}>
                {getFieldDecorator('advance.title', {
                  initialValue: this.getAdvanceTip().title,
                  rules: [{ required: true, message: '请输入主题' }]
                })(<Input type="textarea" placeholder="请输入主题" />)}
              </FormItem>
              <FormItem label="时间" {...formItemLayout}>
                {getFieldDecorator('advance.liveTime', {
                  initialValue: this.getAdvanceTip().liveTime,
                  rules: [{ required: true, message: '请输入直播时间' }]
                })(<Input type="text" placeholder="请输入直播时间" />)}
              </FormItem>
              <FormItem label="图片" {...formItemLayout}>
                {getFieldDecorator('advance.imgUrl', {
                  initialValue: this.getAdvanceTip().imgUrl,
                  rules: [{ required: false, message: '请输入预告图片地址' }]
                })(<Input type="text" placeholder="请输入预告图片地址" />)}
              </FormItem>
            </Form>
          </Modal>
        </TabPane>
      </Tabs>
    );
  }
  getAdvanceTip = () => {
    return this.state.temp;
  }
  renderAdvanceList = () => {
    const { noticeList } = this.props.currentRoom;
    return (
      <div>
        <Button icon="edit" onClick={() => this.showEditModal('advance', true)}>增加</Button>
        {noticeList ? noticeList.map((i) => {
          return (<div className="mg-10">
            <span className="pd-16">讲师：{i.name}</span>
            <span className="pd-16">主题：{i.title}</span>
            <span className="pd-16">时间：{i.liveTime}</span>
            {i.imgUrl ? <img src={i.imgUrl} alt="预告图" className="advanceImg pd-16"/> : ''}
            <Button size="small" type="primary" onClick={() => this.showEditModal('advance', true, i)}>修改</Button>
            <Button size="small" type="danger" onClick={() => this.deleteAdvance(i)}>删除</Button>
          </div>);
        }) : ''}
      </div>
    );
  };
  deleteAdvance = (i) => {
    this.props.dispatch({
      type: 'chatRoom/deleteAdvance',
      payload: {id: i.Id}
    });
  }
  handleAdvanceOK = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const payload = {
        ...values.advance,
        liveId: this.props.currentRoom.liveid,
        Id: this.state.temp.Id
      };
      this.props.dispatch({
        type: 'chatRoom/addAdvance',
        payload
      });
    });
  }
  modalAfterClose = (type) => {
    const key = parseInt(Math.random() * 10000, 10);
    const data = Object.assign({}, this.state.key, {
      [type]: key
    });
    this.setState({
      key: data
    });
  };
  showEditModal = (type, visible, temp) => {
    const key = parseInt(Math.random() * 10000, 10);
    const data = Object.assign({}, this.state.key, {
      [type]: key
    });
    if (temp) {
      this.setState({
        key: data,
        temp
      });
    } else {
      this.setState({
        key: data,
        temp: {}
      });
    }
    this.props.dispatch({
      type: 'chatRoom/RoomSetting',
      payload: {
        [type]: visible
      }
    });
  };
  handleThemeOK = () => {
    const { dispatch, currentRoom } = this.props;
    this.props.form.validateFields((err, values) => {
      dispatch({
        type: 'chatRoom/updateLiveTheme',
        payload: {
          liveid: currentRoom.liveid,
          livename: values.theme,
          usertoken: this.props.userInfo.userToken
        }
      });
    });
  };
  handleNoticeOK = () => {
    const { VideoChatRoom: roomId } = this.props.currentRoom;
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: 'chatRoom/updateNotice',
        payload: {
          roomId,
          notice: values.notice,
          usertoken: this.props.userInfo.userToken
        }
      });
    });
  };

  handleWelcomeOK = () => {
    const { VideoChatRoom: roomId } = this.props.currentRoom;
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: 'chatRoom/updateWelcomeTip',
        payload: {
          roomId,
          welcome: values.welcome,
          usertoken: this.props.userInfo.userToken
        }
      });
    });
  };

  // 获取欢迎语
  getWelcomeTip = () => {
    if (
      !this.props.chatRoomInfo.customJSON ||
      !this.props.chatRoomInfo.customJSON.welcome
    ) {
      return '暂无欢迎语';
    }
    const {
      customJSON: { welcome: { contentFormat } }
    } = this.props.chatRoomInfo;
    if (contentFormat && contentFormat.length > 0) {
      return contentFormat[0].content || '';
    }
    return '暂无欢迎语';
  };
}

function mapStateToProps(state) {
  return {
    userInfo: state.user.userInfo,
    currentRoom: state.chatRoom.currentRoom,
    editModal: state.chatRoom.roomSettingEdit,
    chatRoomInfo: state.im.chatRoomInfo
  };
}

const WrappedNormalForm = Form.create()(RoomSetting);
export default connect(mapStateToProps)(WrappedNormalForm);
