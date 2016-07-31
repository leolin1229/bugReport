var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Log = require('../models/log_model.js');

function htmlEncode (str) {
    var s = '';
    if (str == null || typeof(str) == 'undefined' || str.length == 0) return '';
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "'");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
}

// 修复IE8发送XDomainRequest时content-type为空的bug
router.use('/', function (req, res, next) {
    if (!req.headers['content-type']) {
    	req.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    next();
});

router.use('/', bodyParser.urlencoded({ extended: false }));

router.post('/', function(req, res, next) {
	var log = new Log({
		ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
		user_agent: req.headers['user-agent'] || '',
		user_id: req.body.user_id || '',
		create_time: Date.now(),
		resolution: req.body.resolution || '',
		message: htmlEncode(req.body.msg) || '',
		col_num: htmlEncode(req.body.col) || -1,
		row_num: htmlEncode(req.body.row) || -1,
		source_file: htmlEncode(req.body.src) || '',
		refer_url: req.headers['referer'] || req.body.referer || '',
		from: htmlEncode(req.body.from) || ''
	});

	var handler = function (err) {
		res.set({
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'text/plain'
		});
	    if (err) {
	    	res.send(JSON.stringify({rtn: -1, msg: String(err)}));
	    } else {
	    	res.send(JSON.stringify({rtn: 0}));
	    }
	};

	log.save(function (error) {
	    if (req.query.test) {
	    	setTimeout(function () {
	    	    handler(error);
	    	}, 4000);
	    } else {
	    	handler(error);
	    }
	});
});

module.exports = router;