var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Log = require('../models/log_model.js');

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
		message: req.body.msg || '',
		col_num: req.body.col || -1,
		row_num: req.body.row || -1,
		source_file: req.body.src || '',
		refer_url: req.headers['referer'] || req.body.referer || '',
		from: req.body.from || ''
	});

	log.save(function (err) {
		res.set({
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'text/plain'
		});
	    if (err) {
	    	res.send(JSON.stringify({rtn: -1, msg: String(err)}));
	    } else {
	    	res.send(JSON.stringify({rtn: 0}));
	    }
	});
});

module.exports = router;