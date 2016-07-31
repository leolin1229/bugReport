;(function (global) {
	var objToString = Object.prototype.toString;

	var IEVersion = global.navigator.userAgent.match(/msie\s(\d+)/i),
		IEVersion = (IEVersion && IEVersion.length > 0 && IEVersion[1]),
		islteIE9 = (!!IEVersion && IEVersion <= 9);

	var xhr = null;
	var isInit = false;
	var noop = function () {};

	function createCORSRequest (options) {
		if (xhr) {
			xhr.open(options.method, options.url, true);
			return ;
		}

	    xhr = global.XMLHttpRequest ? new global.XMLHttpRequest() : global.XDomainRequest ? new global.XDomainRequest() : null;

	    if (xhr) {
	    	xhr.open(options.method, options.url, true);
	    }
	}

	function concatParams (obj) {
		var arr = [];
	    for (var k in obj) {
	    	if (obj[k]) arr.push(k + '=' + encodeURIComponent(obj[k]));
	    }

	    return arr.join('&');
	}

	// 补全分辨率和referer参数
	function fixParams (params) {
	    islteIE9 && (params['referer'] = global.location.href);
	    params['resolution'] = global.screen.width + '*' + global.screen.height;
	    params['from'] = global.document.referrer;
	    
	    return params;
	}

	var config = {
		url: 'http://127.0.0.1:3000/report', // 上报接口地址
		random: 1, // 上报概率，1~0 之间数值，1为100%上报（默认 1）
		onReport: noop, // 上报完成回调
		onError: noop, // 网络错误回调
		onTimeout: noop, // 请求超时回调
		ignore: [/Script error/i], // 忽略上报的错误（元素为正则类型）
		debug: false // 是否开发环境，true - 开发环境不上报，false - 生产环境上报（默认）
	};

	// xhr不能捕获的错误会有返回值：
	// -1：不支持CORS
	// -2：没有调用初始化函数
	var xhr2 = function (options) {
		if (objToString.call(options).toLowerCase() == '[object object]') {
	    	if (!isInit) {
	    		return {code: -2, msg: 'please call [init] function first.'};
	    	}

	    	options.method = (options.method &&  options.method.toLowerCase()) || 'post';
	    	// var xhr = createCORSRequest(options);
	    	createCORSRequest(options);

	    	if (!xhr) {
	    		return {code: -1, msg: 'CORS is not supported.'};
	    	}

	    	xhr.onload = function (res) {
	    	    if (config && typeof config.onReport == 'function') config.onReport();
	    	};

	    	xhr.onerror = function (res) {
	    		if (config && typeof config.onError == 'function') config.onError(xhr);
	    	};

	    	xhr.ontimeout = function () {
	    	    if (config && typeof config.onTimeout == 'function') config.onTimeout(xhr);
	    	};

	    	options.method == 'post' && xhr.setRequestHeader && xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');

	    	xhr.timeout = options.timeout || 3000;

	    	setTimeout(function () {
	    		options.data = fixParams(options.data);
	    	    xhr.send(concatParams(options.data) || null);
	    	});
	    }
	}

	var bindEvent = function (cb) {
    	if (config.debug) return ;

    	cb = cb || noop;

    	var checkIgnoreMsg = function (msg) {
    	    for (var i = 0, len = config.ignore.length; i < len; i++) {
    	    	if (config.ignore[i].test(msg)) return true;
    	    }
    	    return false;
    	};

        global.onerror = function (msg, src, row, col, error) {
        	// 缺少src不上报
            if (checkIgnoreMsg(msg) || !src) {
            	return true;
            }

            var evt = global.event || null;

            setTimeout(function () {
                var data = {};
                // IE11跟IE10以下的浏览器event对象不一样
                data.col = col || (evt && evt.errorCharacter || evt.colno) || 0;
                data.row = row || (evt && evt.errorLine || evt.lineno) || 0;
                data.src = src;

                if (!!error && !!error.stack) {
                	// 添加堆栈信息，Safari没有error这个参数
                	data.msg = error.stack.toString();
                } else if (!!arguments.callee) {
                	// 尝试通过callee获取堆栈信息
                	var ext = [];
                	var f = arguments.callee.caller, c = 3;
                	// 只取三层堆栈信息
                	while (f && --c) {
                		ext.push(f.toString());
                		if (f === f.caller) {
                			// 出现环
                			break;
                		}
                		f = f.caller;
                	};
                	ext = ext.join(',');
                	data.msg = ext || (evt && evt.errorMessage || evt.message) || '';
                }
                evt = null;
                // 上报
                if (Math.random() < config.random) cb(data);
            });

            return true;
        };
	};

	var bugReport = {
		init: function (options) {
			isInit = true;

			if (objToString.call(options).toLowerCase() == '[object object]') {
				for (var k in options) {
					if (options[k]) config[k] = options[k];
				}
			}

			bindEvent(function (data) {
			    bugReport.report(data);
			});
		},
		report: function (data) {
			if (config.debug) return {code: -2, msg: 'please close debug mode.'};

			if (!(objToString.call(data).toLowerCase() == '[object object]')) {
				data = {};
			}

		    return xhr2({
		    	url: config.url,
		    	method: 'POST',
		    	data: data
		    });
		}
	};

	if (typeof exports == 'object') {
        module.exports = bugReport;
    } else if (typeof define == 'function' && define.amd) {
        define([], function() { return bugReport; });
    } else {
        global['bugReport'] = bugReport;
    }
})(window);