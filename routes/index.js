var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/reports', require('./reports'));
router.use('/reviews', require('./reviews'));
router.use('/keywords', require('./keywords'));
router.use('/tasks', require('./tasks'));
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));

module.exports = router;
