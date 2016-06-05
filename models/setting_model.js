var mongoose = require('./db.js');
var Schema = mongoose.Schema;

var settingSchema = new Schema({
	expired_time: Number,
	edit_time: Number,
	edit_user: String,
	id: Number // 标识
});

module.exports = mongoose.model('Setting', settingSchema);