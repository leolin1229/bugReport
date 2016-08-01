# bugReport [![Build Status](https://travis-ci.org/leolin1229/bugReport.svg?branch=master)](https://travis-ci.org/leolin1229/bugReport) [![Coverage Status](https://coveralls.io/repos/github/leolin1229/bugReport/badge.svg?branch=master)](https://coveralls.io/github/leolin1229/bugReport?branch=master) [![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)]()

## 前端错误上报解决方案

![](http://ww2.sinaimg.cn/large/0060lm7Tgw1f4lwnay1g9j30e80e8q4i.jpg)

## 特点

1. 基于nodejs全栈开发；
2. 集合主动上报与被动监测错误；
3. 客户端JS文件体积小，gzip后约1.6KB；
4. 配套可视化日志管理系统；
5. 提供sourcemap支持。

## 安装

1. [mongodb](https://www.mongodb.com/cn) v3.2+
2. [nodejs](https://nodejs.org/) v4.4.2+
3. [pm2](https://github.com/Unitech/pm2) latest
4. nginx/Apache等，推荐nginx作为反向代理服务器

## Demo

![](http://ww2.sinaimg.cn/large/0060lm7Tgw1f5um60f0ilj31hc0u0te0.jpg)

## 运行

### 服务端

1. 创建mongodb数据库

 默认表名是`bug`，可在`./models/db.js`修改。

 开启mongo客户端命令行模式，执行：

 1) 创建名为bug的数据库

 ```bash
 use bug
 ```

 2) 插入超级管理员账号（用户名：admin，密码：111111）【注意：只有完成该步骤数据库才是创建成功】

 ```bash
 db.accounts.insert({
    "salt": "6de1a85f69db9bf65b016fc3bf6d6cecc3b64cc2e6741ea332afb6e115d1b53d",
    "hash": "447e6dcedb8ab3a0c1c16536b3eff8907745d38b5fc0a22db4fd19042dc8a7ae9d2e3d97ef984400ee1aa381ad08f62137273f178abfa5983b5d810dbd934c5ae2da38c8a8a4f40f699e91b9f16d1a80471f479aae59f373b09dcb25dcc2f88319246951d68c10d2dc8e505554ba11cdbed53ebf6a247bb81fd9f5da334c7ddf9133f23a5946c5331a933198ff393fc50bc464e4c8adf68bee44006fb7f23361ec345a65c2dbe0dbd9dbe83c257957f2cd65f7c4f4710d1e4398a579ea635b1c840961cf088a38c651fdf40bfd4d6b4e8aa667ba9e30403285fc2c8d8ad038d1e2cc78021759a104bf6565adfcc08c2a8703c1d6f2b837e3bb1fe6b34e75c2eed88ef6bdfb3d3cd859e85aac146baa7339fb5cf8f90f3613b11b6eb4fbafe47e6f65db718b98ec0a5594b8ca457501d96d7858474fbc26b689f5ae9e7352026e125c2a52029505e6dbbc42ca2b3bf9df168af6d9e2415728a7551829527dbbc840f08591af4f265dcfeba4c24984db7e5fd6aaa97a926f5069d971b457dc1df45070f1599121958115f20e8c17a1188fa87bb60301e7ec9085d8a12714ae5a2c46937b7a0d8122331d2914454d3276be5b31b8398c257498ebc018c5c8f1bd7863242ceebd028a99a7307312cda608b1f71280e62a2545db77959fb585090ab6e19389077ed6f5a1aaa1f100b414bc5b1f7cfb20a1272966076b53899661ce20",
    "username": "admin",
    "ip": "127.0.0.1",
    "create_time": 1465206116175,
    "type": 1
 })
 ```

 3) 插入log有效期配置表

 用于[定时清log脚本](https://github.com/leolin1229/crontab4bugReport)读取有效期时间配置。
 ```bash
 db.settings.insert({
    "id": 1,
    "expired_time": 86400,
    "edit_user": "admin",
    "edit_time": 1465206116175
 })
 ```

 4) 修改用户权限
 
 进入mongodb的accounts表，修改对应文档数据的type字段即可（type=1，超级管理员；type=2，普通管理员）。

2. 安装npm模块依赖

 ```bash
 npm install
 ```

3. 创建nodejs守护进程

 ```bash
 pm2 start pm2.release.config.json
 ```

4. 访问 [http://127.0.0.1:3000/](http://127.0.0.1:3000/) 即可进入错误上报管理系统查看log，部署到外网时可使用nginx反向代理端口方法，测试环境建议配域名host访问。

5. 可选择运行[定时清log脚本](https://github.com/leolin1229/crontab4bugReport)。

### 客户端JS(支持IE8+)

客户端js源码位于`./public/src/my_modules/bugReport/index.js`，生成后文件位于`./public/javascripts/bug.js`，该js符合UMD规范，可使用`<script>`引入也可做成模块require引入。

#### API

该模块暴露了两个方法：

1. 初始化 init(Object)

 **【该初始化方法必须在其他方法之前调用一次，并且需要独立引用，不能和待监测代码处在同一代码块，见用法例子】**

 参数名 | 类型 | 备注
 ------|--------|-----------
 url | String | 上报接口地址（默认[http://127.0.0.1:3000/report](http://127.0.0.1:3000/report)，建议修改成域名）
 random | Number | 上报概率，1~0 之间数值，1为100%上报（默认 1）
 ignore | Array | 需要忽略错误的正则数组（默认[/Script error/i]）
 onReport | Function | 上报完成回调
 onError | Function | 网络错误回调
 onTimeout | Function | 请求超时回调
 debug | Boolean | 是否开发环境，true - 开发环境不上报，false - 生产环境上报（默认）

2. 主动上报 report(Object)

 参数名 | 类型 | 备注
 ------|--------|--------
 msg | String | 错误信息
 src | String | 错误文件名
 col | Number | js错误行数
 row | Number | js错误列数

 该方法当产生XMLHttpRequest对象无法捕获的错误时会有返回一个对象，有如下属性：

 属性名 | 类型 | 备注
 ------|--------|--------
 code | Number | 错误码（-1：不支持CORS；-2：没有调用初始化函数）
 msg | String | 错误信息

#### 用法

**以script全局引入为例：**

```html
<script type="text/javascript" src="http://your.website.com/javascripts/bug.js"></script>
<script type="text/javascript">
	// 不能和待监测代码处在同一代码块
	(function(window) {
		var bugReport = window.bugReport;

		bugReport.init({
			url: 'http://your.website.com/report',
			random: 0.5,
			ignore: [/Script error/i, /Type error/i],
			onReport: function () { console.log('bingo!'); },
			debug: false
		});
	})(window);
</script>
<script type="text/javascript">
	// 主动上报
	try {
		console.log(a); // a未定义
	} catch (err) {
		var res = bugReport.report({
			msg: String(err),
			col: 13
		});
	}

	// 被动上报
	console.log(b); // b未定义，自动上报到服务器
</script>
```

#### 说明

1. 主动上报需要手动调用report方法，一般用在try catch块和ajax/jsonp的回调函数里；
2. 被动上报可监听所有window.onerror能捕获的错误(语法错误、运行时错误)；
3. 支持根据map文件查询原文件错误信息，要求map文件和js文件**必须同级目录**，**建议开发时使用未压缩版的js以方便压缩后定位**，如jQuery/Zepto的未压缩版。

## Changlog
#### v1.0.8(2016-07-31)
- 优化：客户端JS中对xhr对象进行缓存，避免频繁创建对象
- 添加：客户端JS增加网络错误和请求超时回调函数
- 添加：客户端JS的report方法的返回值
- 修复：XSS问题
- 添加：单元测试

#### v1.0.5(2016-07-07)
- 优化：客户端概率上报判断逻辑

#### v1.0.4(2016-06-24)

- 优化：去掉可视化管理系统用于显示时间的moment依赖模块
- 优化：隐藏客户端JS的一个绑定事件接口

#### v1.0.3(2016-06-17)

- 修复：可视化管理系统里关键字搜索包含正则特殊字符时结果不正确问题

#### v1.0.2(2016-06-07)

- 修复：客户端JS在IE下无法获取错误信息问题
- 修复：map文件不是json格式时服务器报502问题

#### v1.0.1(2016-06-06)

- 添加：增加超级管理员数据，方便添加普通管理员

#### v1.0.0(2016-06-05)

- 初始化项目

## License

[MIT](https://github.com/leolin1229/bugReport/blob/master/LICENSE).