# bugReport
前端错误监控

## 安装

1. [mongodb](https://www.mongodb.com/cn) v3.2+
2. [nodejs](https://nodejs.org/) v4.4.2+
3. [pm2](https://github.com/Unitech/pm2) latest
4. nginx/Apache等服务器软件，推荐nginx作为反向代理服务器

## Demo

![](http://ww4.sinaimg.cn/large/0060lm7Tgw1f4kpuxytx1j31kw0zkn6p.jpg)

## 运行

### 服务端

1. 创建mongodb数据库

 默认表名是**bug**，可在`vi ./models/db.js`修改
 ```bash
 use bug
 ```

2. 创建nodejs守护进程

 ```bash
 pm2 start pm2.release.config.json
 ```

3. 访问 http://127.0.0.1:3000 即可进入错误上报管理系统查看log，部署到外网时可使用nginx反向代理端口方法。

### 客户端JS(支持IE8+)

客户端js位置`vi ./public/javascripts/bug.js`，该js符合UMD规范，可使用`<script>`引入也可做成模块require引入。

#### 参数

该模块暴露了两个方法：

##### 初始化 init(object)

**【该初始化方法必须在其他方法之前调用一次！】**

参数名 | 类型 | 备注
------|--------|-----------
url | String | 上报接口地址（默认http://127.0.0.1:3000/report）
random | Number | 上报概率，1~0 之间数值，1为100%上报（默认 1）
ignore | Array | 需要忽略错误的正则数组（默认[/Script error/i]）
onReport | Function | 上报完成后回调
debug | Boolean | 是否开发环境，true - 开发环境不上报，false - 生产环境上报（默认）

##### 主动上报 report(object)

参数名 | 类型 | 备注
------|--------|-----------
msg | String | 错误信息
src | String | 错误文件名
col | Number | js错误行数
row | Number | js错误列数

#### 用法

**以script全局引入为例：**

```html
<script type="text/javascript" src="http://your.website.com/javascripts/bug.js"></script>
```

**主动上报**

``` javascript
(function(window) {
	var bugReport = window.bugReport;

	bugReport.init({
		url: 'http://your.website.com/report',
		random: 0.5,
		ignore: [/Script error/i, /Type error/i],
		onReport: function () { console.log('bingo!'); },
		debug: false
	});

	try {
		console.log(a); // a未定义
	} catch (err) {
		bugReport.report({
			msg: String(err),
			col: 13
		});
	}
})(window);
```

**被动上报**

``` javascript
(function(window) {
	var bugReport = window.bugReport;

	bugReport.init({
		url: 'http://your.website.com/report',
		random: 0.5,
		ignore: [/Script error/i, /Type error/i],
		onReport: function () { console.log('bingo!'); }
	});

	console.log(a); // a未定义，自动上报到服务器
})(window);
```

#### 说明

1. 主动上报需要手动调用report方法，一般用在try catch块和ajax/jsonp的回调函数里；
2. 被动上报可监听所有window.onerror能捕获的错误(语法错误、运行时错误)；
3. 支持根据map文件查询原文件错误信息，要求map文件和js文件必须同级目录，**建议开发时使用未压缩版的js以方便压缩后定位**，如jQuery/Zepto的未压缩版。

## Changlog

#### v1.0.0（2016-06-05）

- 初始化项目

## License

[MIT](https://github.com/leolin1229/bugReport/blob/master/LICENSE).