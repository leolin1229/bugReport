var bugReport = require('../public/src/my_modules/bugReport/index.js');

describe('主动上报成功测试', function() {
	it('主动上报成功', function(done) {
		var flag = 0;

		bugReport.init({
			onReport: function () {
			    flag = 1;
			    expect(flag).to.be.equal(1);
			    done();
			},
			onError: function () {
			    flag = 2;
			    expect(flag).to.be.equal(1);
			    done();
			}
		});

		bugReport.report({
		    msg: '123',
		    col: 13,
		    row: 11
		});
	});

	it('主动上报成功 try-catch', function(done) {
		var flag = 0;

		bugReport.init({
			onReport: function () {
			    flag = 1;
			    expect(flag).to.be.equal(1);
			    done();
			},
			onError: function () {
			    flag = 2;
			    expect(flag).to.be.equal(1);
			    done();
			}
		});

		try {
			console.log(a);
		} catch (e) {
			bugReport.report({
			    msg: e,
			    col: 13,
			    row: 11
			});
		};
	});
});