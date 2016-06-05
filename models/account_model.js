var mongoose = require('./db.js');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var accountSchema = new Schema({
	ip: String,
	username: String,
	password: String,
	create_time: Number, // log创建时间
	type: Number // 1-超级管理员，2-普通管理员
});

accountSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', accountSchema);