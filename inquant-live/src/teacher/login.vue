<template>
	<div class="login">
		<div class="tips" v-show="isLoading"></div>
		<div class="login_msg">
			<!-- <div class="closebtn" @click="closebtn">
			</div> -->
			<div class="login_cont">
				<div class="login_tips">
					账号登录
				</div>
				<div class="login_phone">
					<span class="phoneimg"></span> <input type="text" v-model="username"  value="" placeholder="手机号">
				</div>
				<div class="login_pwd">
					<span class="pwdimg"></span> <input type="password" v-model="userpwd" value="" placeholder="密码">
				</div>
				<div class="login_btn" @click="gotoLogin">
					登录
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	adminLogin,
} from '../live/api';

const regPhone = /^1[3|4|5|7|8][0-9]{9}$/;

export default {
	data() {
		return {
			username: '',
			userpwd: '',
			isLoading: false,
		}
	},
	methods: {
		closebtn() {
			// this.$store.commit('setLoginShow', false);
		},
		gotoLogin() {
			console.log('登录');
			if (regPhone.test(this.username.replace(/(^\s*)|(\s*$)/g, ''))) {
				if (this.userpwd.length > 0) {
					this.isLoading = true;
					adminLogin({
						loginType: '1',
						identify: this.username,
						verifyInfo: this.userpwd
					}).then((res) => {
						this.isLoading = false;
						if (res.error_no === 0) {
							window.Bus.$emit('login', {data: res, callBack: () => {
								this.$router.push({ path: '/home/0' });
							}})
							console.log(this)
						} else {
							this.$Message.warning(res.error_info);
						}
					});
				} else {
					this.$Message.warning('请输入密码');
				}
			} else {
				this.$Message.warning('请输入正确的手机号');
			}
		},
	},
	// watch: {
	// 	username(value) {
	// 		this.username = value.substring(0, 11);
	// 	}
	// },
}
</script>

<style scoped lang="scss">
.login {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 100;
	text-align: center;
	margin: auto;
	.tips{
		position: fixed;
		left:0;
		right:0;
		top:0;
		bottom:0;
		width: 30px;
		height: 30px;
		z-index: 101;
		text-align: center;
		margin:auto;
		background-image: url(../images/loading.gif);
		background-repeat: no-repeat;
		background-size: contain;
	}
	& .login_msg {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 380px;
		height: 398px;
		z-index: 101;
		text-align: center;
		margin: auto;
		padding-top: 12px;
		& .login_cont {
			width: 368px;
			height: 384px;
			background: #fff;
			& .login_tips {
				width: 100%;
				height: 130px;
				background: rgb(253, 93, 86);
				line-height: 130px;
				font-size: 24px;
				color: #fff;
			}
			& .login_phone {
				position: relative;
				margin: 0 auto;
				width: 340px;
				height: 53px;
				border-bottom: 1px solid rgb(232, 232, 232);
				& .phoneimg {
					position: absolute;
					left: 6px;
					top: 20px;
					display: block;
					width: 14px;
					height: 22px;
					background-image: url(../images/phoneimg.png);
					background-repeat: no-repeat;
					background-size: contain;
				}
				& input {
					position: absolute;
					left: 50px;
					top: 20px;
					font-size: 16px;
					width: 250px;
					border-style: none;
					outline: none;
				}
			}
			& .login_pwd {
				position: relative;
				margin: 0 auto;
				width: 340px;
				height: 53px;
				border-bottom: 1px solid rgb(232, 232, 232);
				& .pwdimg {
					position: absolute;
					left: 6px;
					top: 20px;
					display: block;
					width: 14px;
					height: 22px;
					background-image: url(../images/pwdimg.png);
					background-repeat: no-repeat;
					background-size: contain;
				}
				& input {
					position: absolute;
					left: 50px;
					top: 20px;
					font-size: 16px;
					width: 250px;
					border-style: none;
					outline: none;
				}
			}
			& .login_goto {
				margin: 0 auto;
				margin-top: 13.5px;
				width: 340px;
				margin-bottom: 30px;
				& a {
					font-size: 12px;
					color: rgb(69, 140, 245);
					text-decoration: none;
				}
			}
			& .login_btn {
				width: 340px;
				height: 40px;
				line-height: 40px;
				font-size: 16px;
				text-align: center;
				background: rgb(253, 93, 86);
				color: #fff;
				margin: 0 auto;
				cursor: pointer;
			}
		}
		& .closebtn {
			position: absolute;
			top: 0;
			right: 0;
			width: 24px;
			height: 24px;
			background-image: url(../images/yugaocolse.png);
			background-repeat: no-repeat;
			background-size: contain;
			cursor: pointer;
		}
	}
}
</style>
