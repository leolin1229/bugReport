var express = require('express');
var router = express.Router();
var Log = require('../models/log_model.js');

function getByPager (options) {
	options = options || {};

    var pageSize = options.pageSize || 1;                   // 一页多少条
    var currentPage = options.currentPage || 1;                // 当前第几页
    var sort = {'create_time': -1};     // 排序（按登录时间倒序）
    var condition = {};                 // 条件
    var fields = {'_id': 0, '__v': 0};  // 读取的字段
    var skipnum = (currentPage - 1) * pageSize;   // 跳过数
    
    Log.find(condition, fields).skip(skipnum).limit(pageSize).sort(sort).exec(function (err, res) {
        if (err) {
            (typeof options.fail == 'function') && options.fail(err);
        } else {
        	Log.count(condition).exec(function (error, result) {
        	    if (error) {
        	    	(typeof options.fail == 'function') && options.fail(error);
        	    } else {
        	    	(typeof options.success == 'function') && options.success({data: res, total: result});
        	    }
        	});
        }
    });
}

router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		getByPager({
			pageSize: +req.query.limit,
			currentPage: +req.query.page,
			success: function (result) {
			    res.status(200).send(JSON.stringify({'rtn': 0, 'data': result.data, 'total': result.total}));
			},
			fail: function (error) {
		    	console.error("getByPager Error:" + error);
		     	res.status(200).send(JSON.stringify({'rtn': -1, 'message': String(error)}));
			}
		});
	} else {
		res.status(200).send(JSON.stringify({'rtn': 11, 'message': 'please login!'}));
	}
});

module.exports = router;