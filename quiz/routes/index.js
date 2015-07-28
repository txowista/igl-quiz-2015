var express = require('express');
var router = express.Router();
var quizController= require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
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
module.exports = router;