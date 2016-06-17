var express = require('express');
var router = express.Router();
var Log = require('../models/log_model.js');

var map = ['message', 'refer_url', 'source_file', 'resolution', 'user_agent', 'ip', 'from'];

function search (options) {
	options = options || {};

    var pageSize = options.pageSize || 1;                   // 一页多少条
    var currentPage = options.currentPage || 1;                // 当前第几页
    var sort = {'create_time': -1};     // 排序（按登录时间倒序）
    var condition = {};  // 条件
    var fields = {'_id': 0, '__v': 0};  // 不读取的字段
    var skipnum = (currentPage - 1) * pageSize;   // 跳过数

    // 有日期
    if (options.from && options.to) {
        if (options.from <= options.to) {
            condition['create_time'] = {'$gte': options.from, '$lte': options.to};
        } else {
            (typeof options.success == 'function') && options.success({data: [], total: 0});
            return ;
        }
    }

    // 有关键字
    if (typeof options.field == 'number' && !Number.isNaN(options.field) && options.field < map.length  && options.keyword) {
    	condition[map[options.field]] = new RegExp(options.keyword.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'i');
    }

    Log.find(condition, fields).skip(skipnum).limit(pageSize).sort(sort).exec(function (err, res) {
        if (err) {
            (typeof options.fail == 'function') && options.fail(err);
        } else {
            Log.count(condition).exec(function (error, result) {
                if (error) {
                    (typeof options.fail == 'function') && options.fail(err);
                } else {
                    (typeof options.success == 'function') && options.success({data: res, total: result});
                }
            });
        }
    });
}

router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        search({
            // 关键字查询条目id, 服务器必须跟前端对应['message', 'refer_url', 'source_file', 'resolution', 'user_id', 'user_agent', 'ip']
            field: +req.query.field,
            keyword: (req.query.keyword ? decodeURIComponent(req.query.keyword) : ''),
            from: +req.query.from, // 开始时间戳
            to: +req.query.to, // 截止时间戳
            pageSize: +req.query.limit, // 一页条数
            currentPage: +req.query.page, // 第几页
            success: function (result) {
                res.status(200).send(JSON.stringify({'rtn': 0, 'data': result.data, 'total': result.total}));
            },
            fail: function (error) {
                console.error("search Error:" + error);
                res.status(200).send(JSON.stringify({'rtn': -1}));
            }
        });
    } else {
        res.status(200).send(JSON.stringify({'rtn': 11, message: 'please login first!'}));
    }
});

module.exports = router;