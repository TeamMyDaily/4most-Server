var express = require('express');
var router = express.Router();
const authUtils = require('../middlewares/authUtil');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/reports', authUtils.checkToken, require('./reports'));
router.use('/reviews', authUtils.checkToken, require('./reviews'));
router.use('/keywords', authUtils.checkToken, require('./keywords'));
router.use('/tasks', authUtils.checkToken, require('./tasks'));
router.use('/users', require('./users'));
router.use('/goals', authUtils.checkToken, require('./goals'));

module.exports = router;
