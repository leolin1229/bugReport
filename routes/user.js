var express = require('express');
var passport = require('passport');
var Account = require('../models/account_model.js');
var router = express.Router();
var app = express();

router.get('/', function (req, res) {
	// 测试环境
	if (app.get('env') === 'development') {
		res.render('user', { user : req.user });
	} else {
		if (!req.isAuthenticated()) {
			res.redirect('/login');
		} else {
			res.render('user', { user : req.user });
		}
	}
});

module.exports = router;