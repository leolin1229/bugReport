var express = require('express');
var router = express.Router();

/* GET users info. */
router.get('/', function(req, res, next) {
	if (req.isAuthenticated()) {
		res.status(200).send(JSON.stringify({rtn: 0, data: req.user}));
	} else {
		res.status(200).send(JSON.stringify({rtn: 11, message: 'please login!'}));
	}
});

module.exports = router;