var express = require('express');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var router = express.Router();
var quizController= require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz',errors:[] });
});
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer',quizController.answer);
//router.get('/author', function(req, res) {
//   res.render('author');
//});
router.param('quizId',quizController.load);
router.get('/author',                      quizController.author);
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/search',               quizController.index);
router.get('/quizes/new',                  quizController.new);
router.post('/quizes/create',              quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   quizController.edit);
router.put('/quizes/:quizId(\\d+)',  urlencodedParser,      quizController.update);
router.delete('/quizes/:quizId(\\d+)',     quizController.destroy);
module.exports = router;
