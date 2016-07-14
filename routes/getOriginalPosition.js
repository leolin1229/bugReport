var express = require('express');
var sourceMap = require('source-map');
var request = require('request');

var router = express.Router();

/* parse source map. */
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		var row = +req.query.row || -1;
		var col = +req.query.col || -1;
		var source_map_src = (req.query.source_map_src && decodeURIComponent(req.query.source_map_src)) || '';

		if (row > 0 && col > 0 && source_map_src) {
			request(source_map_src, function (error, response, body) {
			    if (!error && response.statusCode == 200) {
			    	try {
			    		JSON.parse(body);
			    		var consumer = new sourceMap.SourceMapConsumer(body);
			    		var result = consumer.originalPositionFor({ line: row, column: col });

			    		res.status(200).send(JSON.stringify({rtn: 0, message: result}));
			    	} catch (e) {
			    		res.status(200).send(JSON.stringify({rtn: -1, message: 'the contents of *.map file is not json format!'}));
			    	}
			    } else {
			    	res.status(200).send(JSON.stringify({rtn: response.statusCode, message: response.statusMessage}));
			    }
			});
		} else {
			res.status(200).send(JSON.stringify({rtn: -1, message: 'params are not valid!'}));
		}
	} else {
		res.status(200).send(JSON.stringify({rtn: 11, message: 'please login!'}));
	}
});

module.exports = router;