var bugReport = require('../public/src/my_modules/bugReport/index.js');

describe('xss测试', function() {
	it('输入html标签', function(done) {
		var flag = 0;

		bugReport.init({
			onReport: function () {
			    flag = 1;
			    expect(flag).to.be.equal(1);
			    done();
			}
		});

		bugReport.report({
		    msg: '<script type="text/javascript">alert(111);</script>',
		    col: 13,
		    row: 11
		});
	});
});