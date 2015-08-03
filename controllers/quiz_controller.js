var models = require('../models/models.js');
exports.load= function(req,res,next,quizId){
  models.Quiz.findById(quizId)
      .find({
          where:{id: Number(quizId)},
          include:[{models:models.Comment}]
      }).then(
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
// GET /quizes
exports.index = function(req, res) {
    var filtro = '%';
    var filtro_tema = '%';
    if (req.query.search){
        v_busqueda = '%' + req.query.search.replace(/\s/g,"%")  + '%';
    };
    if (req.query.search_tema){
        v_busqueda_tema = '%' + req.query.search_tema.replace(/\s/g,"%")  + '%';
    };

    models.Quiz.findAll({where:["upper(pregunta) like upper(?) and upper(tema) like upper(?)", filtro, filtro_tema],order:'pregunta ASC'}).then(function(quizes) {
        res.render('quizes/index',{quizes: quizes, errors: []});
    }).catch(function(error){next(error);})

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
        {pregunta:"Pregunta",respuesta:"Respuesta",tema:"Tema"}
    );
    res.render('quizes/new', {quiz:quiz,errors:[]});

};
exports.create=function(req,res){
    var quiz=models.Quiz.build(req.body.quiz);
    console.log (quiz);
    quiz
        .validate()
        .then(
        function (err) {
            if (err) {
                res.render('quizes/new', {quiz: quiz, errors: err.errors});
            } else {
                quiz //save:guarda en DB
                    .save({fields: ["pregunta", "respuesta", "tema"]})
                    .then(function () {
                        res.redirect('/quizes')
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
/*    res.setHeader('Content-Type', 'text/plain');
    res.write('you put:\n');
    res.end(JSON.stringify(req.body, null, 2));*/
    req.quiz.pregunta  = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
    req.quiz
        .validate()
        .then(
        function(err){
            if (err) {
                res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
            } else {
                req.quiz     // save: guarda campos pregunta y respuesta en DB
                    .save( {fields: ["pregunta", "respuesta","tema"]})
                    .then( function(){ res.redirect('/quizes');});
            }     // Redirección HTTP a lista de preguntas (URL relativo)
        }
    );
};
exports.destroy = function(req, res) {
    req.quiz.destroy().then(function(){
        res.redirect('/quizes');
    }).catch(function(error){next(error)});
};
