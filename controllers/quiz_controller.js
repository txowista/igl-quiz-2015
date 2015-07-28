var models = require('../models/models.js');
exports.load= function(req,res,next,quizId){
  models.Quiz.findById(quizId).then(
      function(quiz){
        if(quiz){
          req.quiz=quiz;
          next();
        }else{
          next(new Error('No existe quizId=' + quizId));
        }
      }
  ).catch(function(error){next(error);});
};
//GET /author
exports.author = function(req, res){
    res.render('author', {autor: 'Igor Gonzalez',errors:[]})
};
exports.index = function(req, res){
    if(req.query.search) {
        var filtro = (req.query.search || '').replace(" ", "%");
        models.Quiz.findAll({where:["pregunta like ?", '%'+filtro+'%'],order:'pregunta ASC'}).then(function(quizes){
            res.render('quizes/index', {quizes: quizes});
        }).catch(function(error) { next(error);});

    } else {

        models.Quiz.findAll().then(function(quizes){
            res.render('quizes/index', {quizes: quizes,errors:[]});
        }).catch(function(error) { next(error);});
    }
};
//GET /quizes/question
exports.show=function(req, res) {
      res.render('quizes/show', {quiz: req.quiz,errors:[]});
  };

//GET /quizes/answer
exports.answer=function(req, res){
  var resultado = 'Incorrecto';
   if (req.query.respuesta === req.quiz.respuesta) {
     resultado='Correcto';
    }
  res.render('quizes/answer', {quiz:req.quiz,respuesta: resultado,errors:[]});
};
exports.new=function(req,res){
    var quiz=models.Quiz.build(//crea objeto quiz
        {pregunta:"Pregunta",respuesta:"Respuesta"}
    );
    res.render('quizes/new', {quiz:quiz,errors:[]});

};
exports.create=function(req,res){
    var quiz=models.Quiz.build(req.body.quiz);
    quiz
        .validate()
        .then(
        function (err) {
            if (err) {
                res.render('quizes/new', {quiz: quiz, errors: err.errors});
            } else {
                quiz //save:guarda en DB
                    .save({fields: ["pregunta", "respuesta"]})
                    .then(function () {
                        res.direct('/quizes')
                    })
            }
      }
);
};
exports.edit = function (req,res){
    var quiz= req.quiz;
    res.render('quizes/edit',{quiz:quiz,errors:[]});
};

exports.update = function(req, res) {
    req.quiz.pregunta  = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;

    req.quiz
        .validate()
        .then(
        function(err){
            if (err) {
                res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
            } else {
                req.quiz     // save: guarda campos pregunta y respuesta en DB
                    .save( {fields: ["pregunta", "respuesta"]})
                    .then( function(){ res.redirect('/quizes');});
            }     // Redirecci�n HTTP a lista de preguntas (URL relativo)
        }
    );
};
exports.destroy = function(req, res) {
    req.quiz.destroy().then(function(){
        res.redirect('/quizes');
    }).catch(function(error){next(error)});
};

