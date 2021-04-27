var express = require('express');// เรียกใช้ Express
var router = express.Router();
var hash = require('pbkdf2-password')();
var session = require('express-session');
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'u_user',
    host: 'localhost',
    database: 'app_database',
    password: 'u_password',
    port: 5432,
})


var users = [];

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)


  const getUsers = (request, response) => {
   pool.query('SELECT * FROM "user";', (error, results) => {
    if (error) {
     throw error
    }
        //response.status(200).json(results.rows)
       console.log(results.rows)
   })
  }
const getUsersCheck = (email, password,response) => {
    pool.query(`SELECT * FROM "user" WHERE email = '${email}';`, (error, results) => {
        if (error) {
            throw error
        }
        //response.status(200).json(results.rows)
        console.log(results.rows)
        users = results.rows;
        console.log(users);
        //response.status(200).json(results.rows)
    })
}
  const bodyParser = require('body-parser')
  const app = express()
  const port = 3002

  app.use(bodyParser.json())
  app.use(
      bodyParser.urlencoded({
       extended: true,
      })
  )

  app.listen(port, () => {
   console.log(`App running on port ${port}.`)
  })

  router.get('/query', function (req, res) {
  getUsers()
  });

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
  //res.redirect('/login');
});

function authenticate(name, pass, fn) {
 if (!module.parent) console.log('authenticating %s:%s', name, pass);
 var user = users[name];
 // query the db for the given username
 if (!user) return fn(new Error('cannot find user'));
 // apply the same algorithm to the POSTed password, applying
 // the hash against the pass / salt, if there is a match we
 // found the user
 hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
  if (err) return fn(err);
  if (hash === user.hash) return fn(null, user)
  fn(new Error('invalid password'));
 });
}

function restrict(req, res, next) {
 if (req.session.user) {
  next();
 } else {
  req.session.error = 'Access denied!';
  res.redirect('/login');
 }
}
router.get('/create', function(req, res){
        res.render('auth/create', {
            title: "Create data", //page title
            action: "/api/create-data", //post action for the form
            fields: [
                {name:'book_name',type:'text',property:'required'},   //first field for the form
                {name:'author',type:'text',property:'required'}  , //another field for the form
                {name:'page',type:'text',property:'required'},
                {name:'price',type:'text',property:'required'},
            ]
        });
    //res.render('auth/create',);
});
router.get('/change/:id', function(req, res){
    res.render('auth/create', {
        title: "Update data", //page title
        action: "/api/updata-data/"+req.params.id, //post action for the form
        fields: [
            {name:'book_name',type:'text',value:'',property:'required'},   //first field for the form
            {name:'author',type:'text',value:'',property:'required'}  , //another field for the form
            {name:'page',type:'text',value:'',property:'required'},
            {name:'price',type:'text',value:'',property:'required'},
        ]
    });

    //res.render('auth/create',);


});
router.get('/home', function(req, res){
    var mascots =[];
        pool.query('SELECT * FROM "book";', (error, results) => {
        if (error) {
            throw error
        }
        //res.status(200).json(results.rows)
        console.log(results.rows);
        mascots=results.rows;
            res.render('auth/home',{
                mascots: mascots
            });
    })
});
router.get('/login', function(req, res){
    res.render('auth/create', {
        title: "login", //page title
        action: "/login", //post action for the form
        fields: [
            {name:'email',type:'text',property:'required'},   //first field for the form
            {name:'password',type:'password',property:'required'}  , //another field for the form
        ]
    });
});
router.get('/register', function(req, res){
 res.render('auth/register');
});
router.get('/logout', function(req, res){
 // destroy the user's session to log them out
 // will be re-created next request
 req.session.destroy(function(){
  res.redirect('/');
 });
});
router.post('/login', function(req, res){
 //authenticate(req.body.email, req.body.password, function(err, user){\
    console.log(req.body.email);
    //console.log(req.body.password);
    getUsersCheck(req.body.email,req.body.password,res)
        //console.log(res.status(200))
  // if () {
  //  req.session.regenerate(function(){
  //   res.redirect('back');
  //  });
      res.redirect('/home');
   // } else {
   //    res.redirect('/login');
   //}
 // });
});
router.get('/restricted', restrict, function(req, res){
 res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});
module.exports = router;
