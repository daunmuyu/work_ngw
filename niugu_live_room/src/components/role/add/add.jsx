// 添加角色
import React from 'react';
import { connect } from 'dva';
import { Radio, AutoComplete, Button, Input } from 'antd';
import { openNotification } from 'utils/tool.js';
import './add.scss';

// const Option = AutoComplete.Option;
let searchTimeId = 0;
const RadioGroup = Radio.Group;

class Add extends React.Component {
  state = {
    roleId: 3,
    userName: '',
    selectedUser: null,
    dataSource: [],
    addDisabled: true,
    wx: '',
    mobile: '',
    wxh: '',
    file: ''
  };

  onChange = (e) => {
    this.setState({
      roleId: e.target.value,
      wx: '',
      mobile: '',
      userName: ''
    });
  };

  render() {
    return (
      <div className="role-add-wrap">
        <h3>添加角色</h3>
        <div className="input-wrap clear">
          <div className="name f-left">角色：</div>
          <div className="item f-left">
            <RadioGroup onChange={this.onChange} value={this.state.roleId}>
              <Radio value={3}>主持人</Radio>
              <Radio value={4}>助理</Radio>
              <Radio value={5}>私信助理</Radio>
              <Radio value={7}>微信助理</Radio>
              <Radio value={8}>客服助理</Radio>
            </RadioGroup>
          </div>
        </div>
        <div>
          {this.state.roleId !== 7 && (
            <div className="input-wrap clear">
              <div className="name f-left">用户：</div>
              <div className="item f-left">
                <AutoComplete
                  dataSource={this.state.dataSource}
                  style={{ width: 200 }}
                  onSelect={this.handleInputSelect}
                  onChange={this.handleInputChange}
                  placeholder="根据用户昵称搜索"
                  allowClear
                />
              </div>
            </div>
          )}
          {(this.state.roleId !== 3 && this.state.roleId !== 8) && (
            <div className="input-wrap clear">
              <div className="name f-left">微信：</div>
              <div className="item f-left">
                <Input
                  placeholder="请输入微信号"
                  style={{ width: 200 }}
                  value={this.state.wx}
                  onChange={this.wxChange}
                />
              </div>
            </div>
          )}
          {(this.state.roleId === 4 || this.state.roleId === 5) && (
            <div className="input-wrap clear">
              <div className="name f-left">电话：</div>
              <div className="item f-left">
                <Input
                  placeholder="请输入电话号码"
                  style={{ width: 200 }}
                  value={this.state.mobile}
                  onChange={this.mobileChange}
                />
              </div>
            </div>
          )}
          {(this.state.roleId === 7) && (
            <div className="input-wrap clear">
              <div className="name f-left">分享页微信号：</div>
              <div className="item f-left">
                <Input
                  placeholder="请输入分享页微信号"
                  style={{ width: 200 }}
                  value={this.state.wxh}
                  onChange={(e) => {
                    this.setState({
                      wxh: e.target.value
                    });
                  }}
                />
              </div>
            </div>
          )}
          {(this.state.roleId === 7) && (
            <div className="input-wrap clear">
              <div className="name f-left">分享页二维码：</div>
              <div className="item f-left">
                <Input
                  style={{ width: 200 }}
                  type="file" onChange={(e) => {
                    e.preventDefault();
                    const reader = new FileReader();
                    const file = e.target.files[0];
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                      this.setState({
                        file,
                      });
                    };
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="input-wrap">
          <Button
            className="input-btn-add"
            type="primary"
            onClick={this.handleAdd}
          >
            添加
          </Button>
        </div>
      </div>
    );
  }

  wxChange = (e) => {
    this.setState({
      wx: e.target.value
    });
  };
  mobileChange = (e) => {
    this.setState({
      mobile: e.target.value
    });
  };
  handleInputChange = (value) => {
    if (this.foldingFlag) {
      this.foldingFlag = false;
    } else if (!this.foldingFlag && value) {
      this.setState({
        userName: value
      });
      this.searchUser(value);
    }
    if (!value) {
      this.setState({
        dataSource: []
      });
    }
  };

  handleInputSelect = (value) => {
    this.foldingFlag = true;
    this.setState({
      dataSource: [],
      userName: value
    });
  };

  searchUser = (name) => {
    if (searchTimeId) {
      clearTimeout(searchTimeId);
    }
    searchTimeId = setTimeout(() => {
      this.props.dispatch({
        type: 'role/searchUser',
        payload: name
      });
      this.setDataSource();
    }, 500);
  };

  setDataSource = () => {
    setTimeout(() => {
      const dataSource = this.props.userSearchResult.map((item) => {
        return item.username;
      });
      this.setState({
        dataSource
      });
    }, 500);
  };

  handleAdd = () => {
    const uname = this.state.userName;
    const wx = this.state.wx;
    const mobile = this.state.mobile;
    const fileInput = this.state.file;
    const wxh = this.state.wxh;
    if (!uname && this.state.roleId !== 7) {
      openNotification({
        description: '请输入用户昵称！'
      });
      return;
    }
    const params = {
      uname,
      RoleId: this.state.roleId,
      mservice: 0,
      wx,
      mobile,
      fileInput,
      wxShare: wxh
    };
    // 判断是否是客服
    if (params.RoleId === 5) {
      params.RoleId = 4;
      params.mservice = 1;
    }
    this.props.dispatch({
      type: 'role/addRoleMember',
      payload: params
    });
  };
}

function mapStateToProps(state) {
  return {
    userSearchResult: state.role.userSearchResult
  };
}

export default connect(mapStateToProps)(Add);
