var fs = require("fs");
var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
var jsonfile = require('jsonfile');
var util = require('util');
var express = require('express');
var path = require('path');
var passport = require('passport');
var session =  require('express-session');
var FacebookStrategy  = require('passport-facebook').Strategy;
var cookieParser      =     require('cookie-parser');

eval(fs.readFileSync(__dirname + "/server/model.js")+'');

var app = express();
var port = 5000;
var profileAll;

app.use(express.static('view'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', swig.renderFile);
app.use(session({ secret: 'keyboard cat', key: 'sid'}));

app.get('/', function(req, res){
  res.render(path.join(__dirname + '/view/index.html'),obj);
});

app.get('/viewallblogs', function(req, res){
  BlogModel.selectAllBlog(req, res, function(obj) {
     res.json(obj);
  });
});

app.get('/viewcategories', function(req, res){
  CategoryModel.selectAllCetegories(req, res, function(obj) {
     res.json(obj);
  });
});

app.post('/viewoneblog', function(req, res){
  BlogModel.selectOneBlog(req.body.blog_id, res, function(obj){
      res.json(obj);
  });
});

app.get('/viewoverallblogs', function(req, res){
  BlogModel.selectOverallBlogs(req, res, function(obj) {
     res.json(obj);
  });
});

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy(
    {
      clientID: '676144459190221',
      clientSecret: 'bab6c4231d5fa4d3cb9d8e3945868767',
      callbackURL: 'http://localhost:5000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'name', 'gender',  'photos']
    },
    function(accessToken,refreshToken, profile, done){
        
        process.nextTick(function () {
           return done(null, profile);
        });
        
    }
));

app.post('/auth/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    // do something with req.user 
    res.send(req.user? 200 : 401);
  }
);

app.use(express.static('static'));
const server = app.listen(port, function(err){
    console.log("Application is Running on port " + port);
});

app.get('/checkLoggedIn', function(req, res){
  
});





app.get('/account', ensureAuthenticated, function(req, res){
    console.log(req.user);
  res.render('account', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['email', 'user_birthday', 'user_likes','user_photos'] }));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
   console.log(req.user);
   res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
/*
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('a user connected');
 
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
*/