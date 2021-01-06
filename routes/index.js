var express = require('express');
var router = express.Router();
const authUtils = require('../middlewares/authUtil');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.use('/reports', authUtils.checkToken, require('./reports'));
router.use('/reports', require('./reports'));
//router.use('/reviews', authUtils.checkToken, require('./reviews'));
router.use('/reviews', require('./reviews'));
router.use('/keywords', require('./keywords'));
router.use('/tasks', require('./tasks'));
router.use('/users', require('./users'));
router.use('/goals', require('./goals'));

module.exports = router;
