var bugReport = require('../public/src/my_modules/bugReport/index.js');

describe('主动上报错误测试', function() {
	it('没有调用初始化函数', function(done) {
		var res = bugReport.report({
		    msg: '123',
		    col: 13,
		    row: 11
		});

		expect(res.code).to.be.equal(-2);
		done();
	});

	it('网络错误', function(done) {
		bugReport.init({
			url: 'http://your.com/report',
			onError: function (xhr) {
			    expect(typeof xhr).to.be.equal('object');
			    done();
			}
		});

		bugReport.report({
		    msg: '123',
		    col: 13,
		    row: 11
		});
	});

	it('超时错误', function(done) {
		bugReport.init({
			url: 'http://localhost:3000/report?test=1',
			onTimeout: function (xhr) {
			    expect(typeof xhr).to.be.equal('object');
			    done();
			}
		});

		bugReport.report({
		    msg: '123',
		    col: 13,
		    row: 11
		});
	});
});