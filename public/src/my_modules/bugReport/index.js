;(function (global) {
	var objToString = Object.prototype.toString;
	var IEVersion = global.navigator.userAgent.match(/msie\s(\d+)/i),
		IEVersion = (IEVersion && IEVersion.length > 0 && IEVersion[1]),
		islteIE9 = (!!IEVersion && IEVersion <= 9);

	function createCORSRequest (options) {
	    var xhr = new global.XMLHttpRequest();
	    if ('withCredentials' in xhr) {
	    	xhr.open(options.method, options.url, true);
	    } else if (global.XDomainRequest) {
	    	xhr = new global.XDomainRequest();
	    	xhr.open(options.method, options.url, true);
	    } else {
	    	xhr = null;
	    }

	    return xhr;
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
		onReport: function () {}, // 上报完成后回调
		ignore: [/Script error/i], // 忽略错误
		debug: false // 是否开发环境，true - 开发环境不上报，false - 生产环境上报（默认）
	};

	var xhr2 = function (options) {
	    if (objToString.call(options).toLowerCase() == '[object object]') {
	    	if (!options.url) throw new Error('xhr needs param [url]!');

	    	options.method = (options.method &&  options.method.toLowerCase()) || 'post';
	    	var xhr = createCORSRequest(options);

	    	if (!xhr) {
	    		global.console && console.error('CORS not supported');
	    		return ;
	    	}

	    	xhr.onload = function (res) {
	    	    if (config && typeof config.onReport == 'function') config.onReport();
	    	};

	    	xhr.onerror = function (res) {
	    	    global.console && console.error(xhr);
	    	};

	    	xhr.ontimeout = function () {
	    	    global.console && console.error('report timeout');
	    	};

	    	options.method == 'post' && xhr.setRequestHeader && xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');

	    	xhr.timeout = options.timeout || 3000;

	    	setTimeout(function () {
	    		options.data = fixParams(options.data);
	    	    xhr.send(concatParams(options.data) || null);
	    	}, 0);
	    }
	}

	var bugReport = {
		init: function (options) {
			if (objToString.call(options).toLowerCase() == '[object object]') {
				for (var k in options) {
					if (options[k]) config[k] = options[k];
				}
			}
			bugReport.bind();
		},
		report: function (data) {
			if (config.debug) return ;

			if (!(objToString.call(data).toLowerCase() == '[object object]')) {
				data = {};
			}

		    xhr2({
		    	url: config.url,
		    	method: 'POST',
		    	data: data
		    });
		},
		bind: function () {
			if (config.debug) return ;

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

		        setTimeout(function () {
		            var data = {};
		            // 某些浏览器不支持col
		            col = col || (global.event && global.event.errorCharacter) || 0;

		            data.src = src;
		            data.row = row;
		            data.col = col;
		            if (!!error && !!error.stack) {
		            	// 如果有堆栈信息，Safari没有error这个参数
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
		            	data.msg = error.stack.toString();
		            }
		            // 上报啦
		            var date = new Date();
		            var seconds = date.getSeconds() + 1; // 1 - 60
		            var bingo = parseInt(60 * config.random); // 0 - 60
		            if (1 <= seconds && seconds <= bingo) bugReport.report(data);
		        }, 0);

		        return true;
		    };
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