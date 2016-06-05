var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/log4vstar');

var Config = mongoose.model('config', {
	expire_time: Number, // 过期时间戳
	edit_time: Number // 该记录修改时间
});

router.post('/', function(req, res, next) {
});

module.exports = router;