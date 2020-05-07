// 表情插件
import React from 'react';
import {
  connect,
} from 'dva';
import {
  Icon,
  Popover,
} from 'antd';

import './emoji.scss';

const EMOJI_FLAG = ['1f60a', '1f60c', '1f60f', '1f601', '1f604',
  '1f609', '1f612', '1f614', '1f616', '1f618', '1f621', '1f628',
  '1f630', '1f631', '1f633', '1f637', '1f603', '1f61e', '1f620',
  '1f61c', '1f60d', '1f613', '1f61d', '1f62d', '1f602', '1f622',
  '1f61a', '1f623', '1f632', '1f62a', '263a', '1f4aa', '1f44a',
  '1f44d', '1f44e', '1f44f', '1f64f', '1f446', '1f447', '261d',
  '270c', '1f44c', '270b', '270a', '1f440', '1f444', '1f35a',
  '1f382', '1f37b', '2615', '1f451', '1f494', '1f339', '1f4a3',
  '1f004', '1f437', '1f3b5', '2600', '1f319', '1f525', '1f47b',
  '1f489', '1f4a9', '1f47c', '1f52b', '1f3c6', '26bd', '1f680'
];

const getCaretPosition = (oField) => {
  let iCaretPos = 0;
  const doc = oField.ownerDocument || oField.document;
  const win = doc.defaultView || doc.parentWindow;
  let sel;
  if (typeof win.getSelection !== 'undefined') {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      const range = win.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(oField);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      iCaretPos = preCaretRange.toString().length;
    }
  } else {
    sel = doc.selection;
    if (sel && sel.type !== 'Control') {
      const textRange = sel.createRange();
      const preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(oField);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      iCaretPos = preCaretTextRange.text.length;
    }
  }
  return (iCaretPos);
};

class Emoji extends React.Component {
  constructor(arg) {
    super(arg);
    this.state = {
      visible: false,
    };
  }
  componentDidMount() {
    this.msgDom = document.querySelector('#chatMsg');
    // this.initEditorRange();
  }
  render() {
    return (
      <div className="emoji-wrap">
        <Popover
          trigger="click"
          content={this.renderEmojis()}
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Icon type="smile-o" className="pointer"/>
        </Popover>
      </div>
    );
  }

  renderEmojis = () => {
    return (
      <div className="emoji-list">
        {
          EMOJI_FLAG.map((item, index) => {
            return (<div onClick={() => { this.handleEmojieClicked(index, item); }} key={index} className="emoji-item"><img alt="1" src={`./img/emoji/${index + 1}.png`}/></div>);
          })
        }
      </div>
    );
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }

  handleVisibleChange = (visible) => {
    this.setState({
      visible
    });
  }

  handleEmojieClicked = (index, flag) => {
    this.msgDom.innerHTML += `<img class="emoji-img" data-tag="${flag}" src="./img/emoji/${index + 1}.png"/>`;
    this.hide();
  }


  insertEmoji = (index) => {
    const dom = this.msgDom;
    const pos = getCaretPosition(dom);
    const arr = dom.innerHTML.match(/<img[^>]+>|[\s\S]/g);
    arr.splice(pos, 0, `<img class="emoji-img" src="./img/emoji/${index + 1}.png"/>`);
    dom.innerHTML = arr.join('');
    this.hide();
  }
  /**
   * 初始化编辑区的光标
   */
  initEditorRange() {
    this.msgDom.onfocus = () => {
      window.setTimeout(() => {
        let sel;
        let range;
        if (window.getSelection && document.createRange) {
          range = document.createRange();
          range.selectNodeContents(this.msgDom);
          range.collapse(true);
          range.setEnd(this.msgDom, this.msgDom.childNodes.length);
          range.setStart(this.msgDom, this.msgDom.childNodes.length);
          sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (document.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(this.msgDom);
          range.collapse(true);
          range.select();
        }
      }, 1);
    };
  }
}

export default connect()(Emoji);
