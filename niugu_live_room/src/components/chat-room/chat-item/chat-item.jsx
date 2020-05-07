// 单个消息
/**
userIcons
7-普通用户, 8-徒弟, 9-主播,10-管理员, 11-主持人, 12-助理
 */
import React from 'react';
import {
  connect,
} from 'dva';
// import {
//   Checkbox,
// } from 'antd';
import {
  timeFormat,
  faceToImg,
} from 'utils/tool.js';
import './chat-item.scss';
import ChatBar from '../chat-ops/chat-ops.jsx';

class ChatItem extends React.Component {
  render() {
    return (
      <div className={this.setClassName()}>
        {
          this.renderCheckBox()
        }
        <div className="header clear">
          <i className={`user-icons i${this.props.info.userFlag}`}/>
          <span className="name">{this.renderName()}</span>
          {this.props.info.auditSign === '2' && <img className="audit" src="./img/audit.png" alt=""/>}
          <span className="send-time">{this.renderTime()}</span>
          <span className="audit"/>
          <div className="chat-ops f-right">
            <ChatBar info={this.props.info}/>
          </div>
        </div>
        {
          this.renderContent()
        }
      </div>
    );
  }

  setClassName = () => {
    if (this.isAnchor()) {
      return `chat-item msg-type${this.props.currentRoom.livetype || ''} item-type${this.props.info.content.type || ''}`;
    }
    return 'chat-item';
  }

  renderName = () => {
    const {
      info
    } = this.props;
    switch (info.userFlag) {
      case 7:
        return info.userName;
      case 8:
        return info.userName;
      case 9:
        return '主播';
      case 10:
        return '管理员';
      case 11:
        return '主持人';
      case 12:
        return '助理';
      default:
        return info.userName;
    }
  }

  isAnchor() {
    const {
      userInfo,
      currentRoom,
    } = this.props;
    return +currentRoom.userid === +userInfo.userId;
  }

  renderCheckBox = () => {
    if (!this.isAnchor()) {
      return '';
    }
    return (
      <div className="select">
        <input data-msgid={this.props.info.id} type="checkbox" className="chat-checkbox pointer"/>
      </div>
    );
  }

  renderTime = () => {
    const {
      sendTime,
    } = this.props.info;
    const time = (+sendTime) * 1000;
    if (new Date().toDateString() === new Date(time).toDateString()) {
      return timeFormat(time, 'hh:mm');
    }
    return timeFormat(time, 'MM-dd hh:mm');
  }

  renderContent = () => {
    const {
      info,
    } = this.props;
    if (info.type) {
      return this.renderRecommendStock(info);
    }
    let cnt;
    if (info.content.type === 2) {
      cnt = `<img src="${info.content.src}"/>`;
    } else {
      cnt = faceToImg(this.props.info.content.content);
    }
    if (info.sourceContent && !info.Type) {
      const scnt = faceToImg(info.sourceContent);
      return (
        <div>
          <div className="chat-msg" style={this.backAndTextColor(info.content)} dangerouslySetInnerHTML={{ __html: `回复@${info.sourceUserName}：${cnt}` }} />
          <div className="chat-ref" dangerouslySetInnerHTML={{ __html: `${info.sourceUserName}：${scnt}` }} />
        </div>);
    }
    return (<div className="chat-msg" style={this.backAndTextColor(info.content)} dangerouslySetInnerHTML={{ __html: cnt }} />);
  }

  backAndTextColor = (info) => {
    console.log(info);
    let styleOthers;
    if (info.fontColor && info.fontColor !== '0') {
      styleOthers = {color: info.fontColor};
    }
    if (info.fontSize && info.fontSize !== '0') {
      styleOthers = {
        fontSize: info.fontSize / 2,
        ...styleOthers,
      };
    }
    if (info.fontWeight && info.fontWeight !== '0') {
      styleOthers = {
        fontWeight: 'bold',
        ...styleOthers,
      };
    }
    return styleOthers;
  }

  renderRecommendStock = (info) => {
    const priceStr = info.quantification.priceRange.map((item) => {
      return `${item.key}：${item.value}  `;
    }).join('    ');
    return (
      <div className="chat-msg stock">
        <span>{info.quantification.stockName}({info.quantification.stockCode})</span>
        <span>{info.quantification.nowprice}</span>
        <span>{priceStr}</span>
      </div>
    );
  }
} // end class

function mapStateToProps(state) {
  return {
    currentRoom: state.chatRoom.currentRoom,
    userInfo: state.user.userInfo,
  };
}

export default connect(mapStateToProps)(ChatItem);
