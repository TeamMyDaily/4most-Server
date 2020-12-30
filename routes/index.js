var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/evaluation', require('./evaluation'));
router.use('/review', require('./review'));
router.use('/keywords', require('./keywords'));
router.use('/tasks', require('./tasks'));
router.use('/users', require('./users'));

module.exports = router;
