var http = require('http');
var express = require('express');
// var app = require('express')();
var app = express();
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

// uncomment after placing your favicon in /assets/images/
app.use(favicon(__dirname + '/assets/images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/')));


app.get('/', function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

var port = normalizePort(process.env.PORT || '1221');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
// module.exports = app;

