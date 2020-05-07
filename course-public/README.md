# COURSE-PUBLC

> 牛股课程页公共模块

**技术栈**

* webpack4.0
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
`

**命名规范**

- 文件名：
单词用‘-’隔开，如：customer-service
**(文件名中严禁出现大写字字母和下划线)**

- 变量名：
使用小驼峰命名，如：customerService
#   这样适合安装公司内部的git服务器上的项目
npm install git+http://gitlab.niuguwang.com:8088/Project/aStockBridge.git
#   或者以ssh的方式
npm install git+ssh://git@gitlab.niuguwang.com:Project/aStockBridge.git
