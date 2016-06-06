var express = require('express');
var passport = require('passport');
var Account = require('../models/account_model.js');
var router = express.Router();
var app = express();

router.get('/', function (req, res) {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	} else {
		res.render('index', { user : req.user });
	}
});

router.get('/register', function(req, res) {
	// 彩蛋
	if (req.isAuthenticated()) {
		res.render('register', {});
	} else {
		res.redirect('/login');
	}
});

router.post('/register', function(req, res) {
	var username = req.body.username.trim();
	var password = req.body.password.trim();

	if (!username || !password) {
		res.status(200).send(JSON.stringify({rtn: -1, message: 'username or password invalid!'}));
	} else {
		if (req.isAuthenticated()) {
			// 只有超级管理员才能注册普通管理员
			if (req.user.type == 1) {
				Account.find({username: username}).exec(function (err, resp) {
				    if (err) {
				        console.error('db error:' + String(err));
				        res.status(200).send(JSON.stringify({rtn: -1, message: 'register error' + String(err)}));
				    } else {
				        if (!resp.length) {
				        	Account.register(new Account({
				        		username : username,
				        		ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
				        		create_time: Date.now(),
				        		type: 2
				        	}), password, function(error, account) {
				        	    if (account){
				        	    	res.status(200).send(JSON.stringify({rtn: 0}));
				        	    } else {
				        	    	res.status(200).send(JSON.stringify({rtn: -1, message: 'register error:' + String(error)}));
				        	    }
				        	});
				        } else {
				        	res.status(200).send(JSON.stringify({rtn: -1, message: 'the username had existed!'}));
				        }
				    }
				});
			} else {
				res.status(200).send(JSON.stringify({rtn: -1, message: 'you must be super admin!'}));
			}
		} else {
			res.status(200).send(JSON.stringify({rtn: 11, message: 'please login!'}));
		}
	}
});

router.get('/login', function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
		res.render('login', { user : req.user });
	}
});

router.post('/login', passport.authenticate('local', {session: true, successRedirect: '/', failureRedirect: '/login'}), function(req, res) {
    res.status(200).end();
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;