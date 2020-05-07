// 登陆框
import React from 'react';
import {
  connect,
} from 'dva';
import {
  Form,
  Icon,
  Input,
  Button,
  Alert,
} from 'antd';
import './login.scss';

const FormItem = Form.Item;

class Login extends React.Component {
  render() {
    const {
      getFieldDecorator,
    } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          <h2>登录</h2>
        </FormItem>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入手机号/用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="手机号/用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入登录密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="登陆密码" />
          )}
        </FormItem>
        <FormItem>
          <Button type="danger" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </FormItem>
        {
          this.renderInfo()
        }
      </Form>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.login(values);
      }
    });
  }
  login(payload) {
    this.props.dispatch({
      type: 'user/login',
      payload,
    });
  }
  loading(payload = false) {
    this.props.dispatch({
      type: 'login/loginLoading',
      payload,
    });
  }
  // 显示提示框
  showTip(tip) {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'login/tip',
      payload: tip
    });
    setTimeout(() => {
      dispatch({
        type: 'login/tip',
        payload: {
          display: false,
        }
      });
    }, 3000);
  }
  // 渲染提示框
  renderInfo = () => {
    if (!this.props.tip.display) {
      return ('');
    }
    setTimeout(() => {
      this.props.dispatch({
        type: 'login/tip',
        payload: {
          display: false,
        }
      });
    }, 3000);
    const {
      content,
      type
    } = this.props.tip;
    return (
      <Alert
        description={content}
        type={type}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    tip: state.login.tip,
  };
}


const WrappedNormalLoginForm = Form.create()(Login);
export default connect(mapStateToProps)(WrappedNormalLoginForm);
