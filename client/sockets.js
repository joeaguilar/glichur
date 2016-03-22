
    var socket = io();
    var queue = [];
    var globalArray;   

      socket.emit('glitch', params);
      queue = [];
      var m = document.querySelector('#m');
      socket.emit('chat message', m.value );
      m.value = '';
      return false;
    });

    socket.on('glitched', function(glitchedData){
      var canvas = document.querySelector('#ultros');
      var ctx = canvas.getContext('2d');
      var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var idCache = imgData.data;
      globalArray = new Uint8ClampedArray(glitchedData.imgArray);
      for (var i = 0, l = idCache.length; i < l; ++i) {
        idCache[i] = globalArray[i];
      }
      console.log(glitchedData.imgArray, imgData.data);
      ctx.putImageData(imgData, 0, 0);
      document.querySelector('#loader').classList.add('hidden');

    })

    // http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e
    socket.on('glitched', function(data) {
      var uint8Arr = new Uint8Array(data.buffer);
      var binary = '';
      for ( var i = 0, l = uint8Arr.length; i < l; ++i ) {
        binary += String.fromCharCode(uint8Arr[i]);
      }
      var base64String = window.btoa(binary);

      var img = new Image();
      img.onload = function() {
        var canvas = document.querySelector('#ultros');
        var ctx  = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0);
      }
      img.src = 'data:image/png;base64,' + base64String;
      document.querySelector('#loader').classList.add('hidden');
    });


    socket.on('not glitched', function() {

      document.querySelector('#loader').classList.add('hidden');
    })

    socket.on('connected', function(user) {
      var li = document.createElement('li');
      li.innerText = user +  " connected";
      document.querySelector('#messages').appendChild(li);
    });

    socket.on('chat message', function(msg) {
      var li = document.createElement('li');
      li.innerText = msg;
      document.querySelector('#messages').appendChild(li);
    });

    socket.on('error', function(err) {
      var li = document.createElement('li');
      li.innerText = err;
      li.classList.add('error');
      document.querySelector('#messages').appendChild(li);
    })

    socket.on('user typing', function () {
      
    })