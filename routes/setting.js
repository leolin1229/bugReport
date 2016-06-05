var express = require('express');
var router = express.Router();
var Setting = require('../models/setting_model.js');

router.get('/get', function(req, res, next) {
	if (req.isAuthenticated()) {
		Setting.find({}, {'_id': 0, '__v': 0}).exec(function (error, result) {
		    if (error) {
		        res.status(200).send(JSON.stringify({rtn: -1, message: 'get setting erroror:' + String(error)}));
		    } else {
		        res.status(200).send(JSON.stringify({rtn: 0, data: result}));
		    }
		});
	} else {
		res.status(200).send(JSON.stringify({rtn: 11, message: 'please login!'}));
	}
});

router.post('/update', function (req, res, next) {
    if (req.isAuthenticated()) {
        var expired = +req.body.expired;
        if (expired < 86400 || expired > 2592000) {
            res.status(200).send(JSON.stringify({rtn: -1, message: 'expired time must >= 86400 && <= 2592000!'}));
        } else {
            var user = req.user;

            // 需要超级管理员权限
            if (user.type != 1) {
                res.status(200).send(JSON.stringify({rtn: -1, message: 'you must be super admin!'}));   
            } else {
                if (!req.body.expired) {
                    res.status(200).send(JSON.stringify({rtn: -1, message: 'param[expired] invalid!'}));
                } else {
                    Setting.update({id: 1}, {$set: {
                        id: 1,
                        expired_time: expired,
                        edit_user: user.username,
                        edit_time: Date.now()
                    }}, {upsert: true}, function (error, result) {
                        if (error) {
                            res.status(200).send(JSON.stringify({rtn: -1, message: 'update setting erroror:' + String(error)}));
                        } else {
                            res.status(200).send(JSON.stringify({rtn: 0}));
                        }
                    });
                }
            }
        }
    } else {
    	res.status(200).send(JSON.stringify({rtn: 11, message: 'please login!'}));
    }
});

module.exports = router;
