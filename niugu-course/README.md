# HN_COURSE

> 牛股课程页

**技术栈**

* webpack2.0
* es6
* scss
* postcss

**项目配置项**
``` bash
# 项目初始化
yarn
npm install
# 项目启动
yarn start / yarn run dev
npm start / npm run dev

# 项目发布
yarn run build
npm run build
```

**项目部署**

- 测试: svn://192.168.6.166/webfiles/h5.niuguwang.com/course
- 线上: svn://10.169.104.105/webfiles/h5.niuguwang.com/course
- 测试: svn://192.168.6.166/webfiles/h5.stockhn.com/course
- 线上: svn://10.169.104.105/webfiles/h5.stockhn.com/course

**命名规范**

- 文件名：
单词用‘-’隔开，如：customer-service
**(文件名中严禁出现大写字字母和下划线)**

- 变量名：
使用小驼峰命名，如：customerService

**公共地址**

* 直播间
```
h5.stockhn.com/public/live/index.html h5.niuguwang.com/public/live/index.html

参数
applive 是否是嵌入页（>1是 否则不是嵌入页）
isH5 是否是H5页面（>0是 否则不是H5页面）
liveid 直播id
cid 课程id
sid 统计id
```
* 支付
```
h5.stockhn.com/public/pay/index.html h5.niuguwang.com/public/pay/index.html

参数
courseid 课程id
```

* 登录
```
h5.stockhn.com/public/login/index.html h5.niuguwang.com/public/login/index.html

参数
无
```

* 录播
```
h5.stockhn.com/public/video-detail/index.html h5.niuguwang.com/public/video-detail/index.html

参数
vid 视频id
```

* 内参
```
https://h5.stockhn.com/huodong/base/list/sole-list.html

参数
usertoken 用户令牌
courseid 课程id
```


# 项目发布日志

> 每次发布记得写发布日志，最新的写在最上面
*	2018-03-10
	*	内容：涨停先知
		
		其他备注： src/pages/course-limit ( develop )
		
	*	线上地址: 	https://h5.niuguwang.com/course/course-limit/index.html
	*	测试地址: 	https://h5.niuguwang.com/course/course-limit/index.html

*	2018-02-10
	*	内容：短线掘金、猎庄追击、列表
		
		其他备注： src/pages/closing-line ( develop )
		
	*	线上地址: 	https://h5.stockhn.com/course/closing-line/index.html

*	2018-02-10
	*	内容：短线掘金、猎庄追击、列表
		
		其他备注： src/pages/course-chase ( develop )
		其他备注： src/pages/course-nugget ( develop )
		
	*	线上地址: 	https://h5.stockhn.com/course/course-chase/index.html
	*	线上地址: 	https://h5.stockhn.com/course/course-nugget/index.html




*	2018-01-10
	*	内容：策略金榜
		
		其他备注： src/pages/strategy ( develop )
		
	*	线上地址: 	https://h5.niuguwang.com/course/strategy/index.html
	

#   这样适合安装公司内部的git服务器上的项目
npm install git+https://git@git.niuguwang.com:Project/ng-bridge.git
#   或者以ssh的方式
npm install git+ssh://git@git.niuguwang.com:Project/ng-bridge.git



