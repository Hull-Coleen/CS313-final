require('dotenv').config();
var dateFormat = require('dateformat');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const url = require('url');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session');
const pg = require('pg-promise')({});
var conString = process.env.DATABASE_URL || process.env.LOCAL_URL;
const db = pg(conString);
const { getSalt, getHash} = require('./util');
const app = express();

var sess = {
    secret: process.env.COOKIE,
    cookie: {}
  }
  
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
  
  app.use(session(sess))
// accept json
 var bodyParser = require('body-parser') 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logRequest);
app.get('/', (req,res)=> {
    res.render('pages/index', {title: "home"})
});
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.post('/createUser', createUser);
app.post('/signin',getUser);
app.post('/logout', handleLogout);
app.get('/getPulse', verifyLogin, getPulse);
app.get('/getExercise', verifyLogin, getExercise);
app.get('/getWeight', verifyLogin, getWeight);
app.get('/insert', verifyLogin, insertData);

// If a user is currently stored on the session, removes it
function handleLogout(request, response) {
	var result = {success: false};

	// We should do better error checking here to make sure the parameters are present
	if (request.session.userId) {
		request.session.destroy();
		result = {success: true};
	}

	response.json(result);
}

function getPulse(req, res) {
     var id = req.session.userId;
    console.log(id);
    console.log(req.session.userId);
    // query database
    db.any('SELECT pulse, day_of_input FROM health WHERE person_id = $1 ORDER BY day_of_input DESC', [id]) // returns promise
      .then((results)=> {
        console.log(results)
        res.status(200)
           .json({success:true, pulse: results})
           console.log(results)
           //.json(results)
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({success:"Person does not exist."})
      })
}
function getExercise(req, res) {
	
     var id = req.session.userId;
    // query database
    db.any('SELECT exercise, exercise_time, day_of_input FROM health WHERE person_id = $1 ORDER BY day_of_input DESC' , [id]) // returns promise
      .then((results)=> {
        res.status(200)
           .json({success:true, health: results})
           console.log(results)
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({success:"Person does not exist."})
      })
}
function getWeight(req, res) {


    var id = req.session.userId;
    // query database
    db.any('SELECT weight, day_of_input FROM health WHERE person_id = $1 ORDER BY day_of_input DESC', [id]) // returns promise
      .then((results)=> {
        res.status(200)
           .json({success: true, weight: results})
           console.log(results)
           //.json(results)
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({success: false})
      })
}

function getUser(req, res) {

   var username = req.body.username;
   var pass = req.body.password;
   console.log(username);
   db.one('SELECT password, name, id FROM person WHERE user_name = $1', [username])
   .then(result => {
       console.log(pass + "id  " + result.id +"pass " + result.password)
    if(bcrypt.compareSync(pass, result.password)) {
        
        req.session.userId = result.id;
        req.session.name = result.name;
       // document.getElementById('#greeting').innerText = result.name;
        console.log(req.session.userId);
        res.json({success: true, name: result.name})
    } else {
        res.status(401)
            .json({success: false})
    }
   }).catch(err =>{
       console.log(err);
       res.status(401)
            .json({success: false})

   })
}

function insertData(req, res) {
	
	var url_parts = url.parse(req.url, true);
    var exercise = (url_parts.query.exercise);
	var time = (url_parts.query.time);
	var weight = (url_parts.query.weight);
	var pulse = (url_parts.query.pulse);
	var date = (url_parts.query.date);
    var id = req.session.userId;
    console.log("insert function" + req.session.userId);
    // query database
	
    const query = db.one('INSERT INTO health (person_id, exercise, exercise_time, weight, pulse, day_of_input) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', 
	[id, exercise, time, weight, pulse, date]) // returns promise
      .then((query)=> {
        console.log("insert function" + query)
        res.status(200)
           .json(query)
           req.session.userId = query;
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({success: false})
      })
}

function createUser(req, res) {

    var name = req.body.name;
    var username = req.body.username;
    var pass = req.body.password;
    let hash = bcrypt.hashSync(pass, 10);
    
    const query = db.one('INSERT INTO person (name, password, user_name) VALUES ($1, $2, $3) RETURNING id',
    [name, hash, username])
    .then(id => {
        req.session.userId = id.id;
        res.json({success: true})
        
    }).catch(err => {
        console.log(err);
    })
    
}

function logRequest(req, res, next) {
    console.log("Received a request for: " + req.url);
    next();

}
function verifyLogin(req, res, next) { 
    console.log("verify" + req.session.userId)
    if(req.session.userId) {
        next();
    } else {
     console.log(req.session.userId)
        res.status(401)
           .json({success:false})
    }
 }