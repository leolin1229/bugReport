var mongoose = require('./db.js');
var Schema = mongoose.Schema;

var logSchema = new Schema({
	ip: String,
	user_agent: String,
	create_time: Number, // log创建时间
	resolution: String, // 分辨率
	message: String,
	col_num: Number,
	row_num: Number,
	source_file: String, // 错误文件url
	refer_url: String,
	from: String
});

module.exports = mongoose.model('Log', logSchema);