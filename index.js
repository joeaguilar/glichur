// var http = require('http').Server(app);
// var express = require('express');
var app = require('express')();
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var io = require('socket.io')(http);
var frameDir = __dirname + '/frames/';
var movieMajick = require('./lib/moviemajick');

// fs.mkdir(frameDir, function () {
  
// })


// io.on('connection', function (socket) {
//   io.emit('connected');
//   io.emit('reset');

//   var projectName = "";
//   var frameNo = 0;


//   socket.on('bootstrap', function(config) {
//     projectName = config.name;
//   })

//   socket.on('render', function(pngbuffer) {
//     var base64Data = pngbuffer.replace(/^data:image\/png;base64/, "");
//     var filename = frameDir + projectName + "/" + movieMajick.sequenceFrames(frameNo) + ".png";
//     fs.writeFile(filename, base64Data, 'base64', function() {
//       if (err) {
//         socket.emit('error', {error: err.message});
//         return;
//       };
//       io.emit('ready', function() {
//         ++frameNo;
//       })
//     })
//   });


// })

// var logger = require('morgan');

// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;


// var routes = require('./routes/index');
// var users = require('./routes/users');
// var admin = require('./routes/admin');
// var blog = require('./routes/blog');
// var portfolio = require('./routes/portfolio');

// var SessionStore = require('express-mysql-session');

// Keep these configs here so they can be different
/*
var sessionStore = new SessionStore({
  host     : 'localhost',
  // port  : 1331,
  user     : 'root',
  password : '',
  database : 'fcdeen',
  checkExpirationInterval: 900000,
  expiration: 86400000

});
*/
// This is also possible
// var sessionsStore = new SessionStore({}, require('./database/db'));


// var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/assets/images/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(require('express-session')({
//   key: "session-cookie-name",
//   secret: "mkdolmioshio",
//   store: sessionStore,
//   resave: false,
//   saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static(path.join(__dirname, 'views')));

// app.use('/', routes);
// app.use('/users', users);
// app.use('/admin', admin);
// app.use('/blog', blog);
// app.use('/portfolio', portfolio);



app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;

