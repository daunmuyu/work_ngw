// 消息框
import React from 'react';
import {
  connect,
} from 'dva';
import {
  Button,
  Icon,
  Radio,
} from 'antd';
import {
  messageToData,
  openNotification,
} from 'utils/tool.js';
import Emoji from 'components/emoji/emoji.jsx';
import RecommendStock from 'components/recommend-stock/recommend-stock.jsx';
import './send-box.scss';

const RadioGroup = Radio.Group;

class SendBox extends React.Component {
  state = {
    value: 2,
    color: 0,
    size: 0,
    bold: 0,
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'im/InputMsgDom',
      payload: this.inputMsg,
    });
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  onChangeSize = (e) => {
    this.setState({
      size: e.target.value,
    });
  }

  onChangeColor = (e) => {
    console.log(e);
    this.setState({
      color: e.target.value,
    });
  }

  onChangeBold = (e) => {
    this.setState({
      bold: e.target.value,
    });
  }

  render() {
    return (
      <div className="send-box-wrap clear">
        <div className="fontType">
          <RadioGroup onChange={this.onChangeColor} value={this.state.color}>
            <b>字体颜色：</b>
            <Radio value={0}>默认</Radio>
            <Radio value={'#ec5a58'}>红</Radio>
            <Radio value={'#458cf5'}>蓝</Radio>
            <Radio value={'#ff8f23'}>橙</Radio>
            <Radio value={'#b247cf'}>紫</Radio>
          </RadioGroup>
          <RadioGroup onChange={this.onChangeSize} value={this.state.size}>
            <b>字体大小：</b>
            <Radio value={0}>默认</Radio>
            <Radio value={28}>28</Radio>
            <Radio value={36}>36</Radio>
            <Radio value={42}>42</Radio>
            <Radio value={48}>48</Radio>
          </RadioGroup>
          <RadioGroup onChange={this.onChangeBold} value={this.state.bold}>
            <b>字体粗细：</b>
            <Radio value={0}>默认</Radio>
            <Radio value={1}>加粗</Radio>
          </RadioGroup>
        </div>
        <div id="chatMsg" ref={(d) => { this.inputMsg = d; }} contentEditable="true" className="text-wrap ant-input"/>
        <div className="clear">
          <div className="f-left picture">
            <form id="fileForm" encType="multipart/form-data" method="post" ref={(f) => { this.fileForm = f; }}>
              <input type="hidden" name="isMarket" value={this.state.value}/>
              <input onChange={this.handleFileChange} name="Content" className="msg-file" type="file" ref={(i) => { this.inputFile = i; }}/>
            </form>
            <Emoji/>
            <Icon onClick={this.handleChooseImg} type="picture" className="pointer" />
            {this.renderUploadFileTip()}
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio value={2}>非营销图片</Radio>
              <Radio value={3}>营销图片</Radio>
            </RadioGroup>
            <RecommendStock/>
          </div>
          <div className="btn-wrap f-right">
            <Button loading={this.props.sendMessageLoading} onClick={this.handleBtnSendClick} className="btn-send" type="primary" size="large">发送</Button>
          </div>
        </div>
      </div>
    );
  }

  handleBtnSendClick = () => {
    const content = messageToData(this.inputMsg.innerHTML);
    if (!+this.props.currentRoom.liveswitch && !+this.props.currentRoom.IsVideo) {
      openNotification({
        description: '当前直播间尚未开始直播!',
      });
      return;
    }
    if (this.msgLength() <= 0) {
      return;
    }
    this.props.dispatch({
      type: 'im/sendMessage',
      payload: {
        content,
        fontSize: this.state.size,
        fontColor: this.state.color,
        fontWeight: this.state.bold,
        roleID: this.props.currentRole.roleid,
      },
    });
    this.setState({
      color: 0,
      size: 0,
      bold: 0,
    });
  }

  msgLength() {
    const content = this.inputMsg.innerHTML;
    const text = content.replace(/&nbsp;/g, ' ').replace(/<\/?[^>]+?>/g, '').trim();
    let len = text.length;
    const res = content.match(/<img[^>]+?>/g);
    len += !res ? 0 : res.length;

    return len;
  }

  handleChooseImg = () => {
    this.inputFile.click();
  }

  handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      this.props.dispatch({
        type: 'im/CurrentUpladFile',
        payload: files[0].name
      });
    }
    const data = new FormData(document.querySelector('#fileForm'));
    this.props.dispatch({
      type: 'im/sendFile',
      payload: data,
    });
  }

  renderUploadFileTip = () => {
    if (!this.props.currentUpladFile) {
      return '';
    }
    return (
      <span className="upload-file-tip">
        <Icon type="loading" />&nbsp;{this.props.currentUpladFile}&nbsp;发送中
      </span>
    );
  }

}

function mapStateToProps(state) {
  return {
    sendMessageLoading: state.im.sendMessageLoading,
    userInfo: state.user.userInfo,
    currentRoom: state.chatRoom.currentRoom,
    currentRole: state.role.currentRole,
    currentUpladFile: state.im.currentUpladFile,
  };
}

export default connect(mapStateToProps)(SendBox);
