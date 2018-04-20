var express = require('express'),
    bodyParser = require('body-parser');
var router = express.Router();
var registerUser = require('./registerUser')

/* GET home page. */
router.use(bodyParser.urlencoded({ extended: true }));
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
router.post('/login',function(req, res, next) {
    registerUser.login(req,res)
})
*/

module.exports = router;
