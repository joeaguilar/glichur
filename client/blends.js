
function blendsCode () {



  "use strict";




  function isLSB() {
      var b = new Uint8Array([255, 0]);
      return ((new Uint16Array(b, b.buffer))[0] === 255);
  }


  function colorObjectFromColorString(color) {
    var obj = {};
    obj.r = parseInt(color.slice(4,6), 16);
    obj.g = parseInt(color.slice(2,4), 16);
    obj.b = parseInt(color.slice(0,2), 16); 
    return obj;
  }


  function meanPixel(pixels) {
  if (pixels.length === 0) return new Uint8Array(4);
  if (pixels.length === 4) return pixels;
  var p = new Uint8Array(4);
  var r=0,g=0,b=0,a=0;
  for (var i = 0; i < pixels.length; i+=4){
    r+=pixels[i];
    g+=pixels[i + 1];
    b+=pixels[i + 2];
    a+=pixels[i + 3];
  }
  p[0] = (r / (pixels.length / 4)) >>> 0;
  p[1] = (g / (pixels.length / 4)) >>> 0;
  p[2] = (b / (pixels.length / 4)) >>> 0;
  p[3] = (a / (pixels.length / 4)) >>> 0;
  return p;
  }


  function extractBrightnessLSB(u32c) {
    var r,g,b,m; 
    r = (u32c &0xFF);
    g = (u32c >> 8) &0xFF;
    b = (u32c >> 16) &0xFF;
    m = r;
    (m < g) && (m = g);
    (m < b) && (m = b);
    return m;
  }


  function extractBrightnessMSB(u32c) {
    var r,g,b,m; 
    b = (u32c >>  8) &0xFF;
    g = (u32c >> 16) &0xFF;
    r = (u32c >> 24) &0xFF;
    m = r;
    (m < g) && (m = g);
    (m < b) && (m = b);
    return m;
  }






  var blends = blends || {};

  // blends.generic = function (chunk, dupBuffer, options) { }

  blends.copy = function (chunk, dupBuffer, opts) {
    for (var i = 0, l = chunk.length; i < l; ++i) {
      dupBuffer[i] = chunk[i];
      
    }
  };



  blends.crunch = function (chunk, dupBuffer, options) { 
    var skip = options.threshold || 50;
    var skippy = skip * 4;
    for (var i = 0, l = dupBuffer.length; i < l; i++) {
      if (i&skippy) {
        dupBuffer[i] = dupBuffer[i];
      } else {
        dupBuffer[i] = chunk[i];
      }
    }
  };


  blends.voijami = function ( chunk, dupBuffer, opts) {
    
    // type: voijami, class: slow

    var color1 = opts.color || {r:0,g:0,b:0};
    var color2 = opts.swing || {r:0, g:0, b:0};
    var threshold = parseInt(opts.threshold) || 40;
    var x = opts.height;
    var y = opts.width;


   
    function Voija () {
      this.chain = [];
      this.oldChain = [];
      this._ether = 100;

      Object.defineProperty(this, 'ether', {
        get: function() {
          this._ether = this._ether - 1;
          return this._ether;
        },
        set: function (value) {
          this._ether = this._ether + value;
        }
      });

    }


    Voija.prototype.spin = function () {
      if (this._ether > 10 && this.oldChain.length > 0) {
        this._ether--;
        return this.oldChain.shift();  
      } else {
        return -1;
      }
    }

    Voija.prototype.chagrox = function (sampleSize, chunk ,x, y) {
      var sampleSize = sampleSize || 10;
      var x = x || 0, y = y || 0;
      var cache = [];
      this._ether = sampleSize * sampleSize;

      for (var s = 0; s < sampleSize; s++) {
        for (var a = 0; a < sampleSize; a++) {
          var index = (s*sampleSize*4) + (a*4);
          var sIndex = (x*sampleSize*4) + (y*4);
          cache[index + 0] = chunk[sIndex + 0];
          cache[index + 1] = chunk[sIndex + 1];
          cache[index + 2] = chunk[sIndex + 2];
        }
      }

      this.chain = cache;
    };



    var shiiri = new Voija();

    for (var i = 0; i < x; i++) {


      for (var j = 0; j < y; j++) {

        var index = (i*y*4) + (j*4);
        if (shiiri.ether < 25 ) { shiiri.chagrox(shiiri.ether - 10, chunk, i, j); } 

        //   var cache1 = {r: chunk[index + 0], g: chunk[index + 1], b: chunk[index + 2]}
        //   var cache2 = {r: chunk[index + 4], g: chunk[index + 5], b: chunk[index + 6]}
        //   var cache3 = {r: chunk[index - 4] || color2.r, g: chunk[index - 3] || color2.g, b: chunk[index - 2] || color2.b }
        //   var cache4 = {r: chunk[index - 8] || color1.r, g: chunk[index - 7] || color1.g, b: chunk[index - 6] || color1.b }

        // chunk[index + 0] = (cache1.r + cache2.r + cache3.r + cache4.r) / 4;
        // chunk[index + 1] = (cache1.g + cache2.g + cache3.g + cache4.g) / 4;
        // chunk[index + 2] = (cache1.b + cache2.b + cache3.b + cache4.b) / 4;
        // chunk[index + 3] = 255;

        var n = [];
        dupBuffer[index + 0] = ( shiiri.ether < threshold && (n[0] = shiiri.spin()), n > -1   ) ? n[0] : chunk[index + 0];
        dupBuffer[index + 1] = ( shiiri.ether < threshold && (n[1] = shiiri.spin()), n > -1   ) ? n[1] : chunk[index + 1];
        dupBuffer[index + 2] = ( shiiri.ether < threshold && (n[2] = shiiri.spin()), n > -1   ) ? n[2] : chunk[index + 2];

      }

    }



  };



  blends.mastervoijami = function (chunk, dupBuffer, options) { 
    var h = options.height, w = options.width, x, y, i ,n;
    var xspace = options.xspace || 10, 
        yspace = options.yspace || 1,
        weight = options.weight || 5, 
        stroke = options.stroke || 5;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    for (var x = 0; x < h; x+=xspace) {
      for (var y = 0; y < w; y+=yspace) {
        var index = x * w + y; 
        var color = data[index];
        clone[ index ] = color;
        for (var i = 0; i < weight; i++) {
          for (var n = 0; n < stroke; n++) {
            clone[ index + (w * i) + n ] = color;             
          }
        }

      }
    }
  };


  blends.voijamileft = function (chunk, dupBuffer, options) { 
    var h = options.height, w = options.width;
    var skip = options.threshold || 4;
    var skippy = skip * 4;

    for (var i = 0; i < h; i++) {

      if ( i&skippy ) {
        continue;
      } 
      for (var j = 0; j < w; j++) {
      var index = (i*w+j)*4;
        dupBuffer[index+0] = chunk[index+0];
        dupBuffer[index+1] = chunk[index+1];
        dupBuffer[index+2] = chunk[index+2];
        dupBuffer[index+3] = chunk[index+3];
      }
   
    }
  };


  blends.voijamiup = function (chunk, dupBuffer, options) { 
    var h = options.height, w = options.width;
    var skip = options.threshold || 4;
    var skippy = skip * 4;

    for (var i = 0; i < w; i++) {

      if ( i&skippy ) {
        continue;
      } 
      for (var j = 0; j < h; j++) {
      var index = (j*w+i)*4;
        dupBuffer[index  ] = chunk[index  ];
        dupBuffer[index+1] = chunk[index+1];
        dupBuffer[index+2] = chunk[index+2];
        dupBuffer[index+3] = chunk[index+3];
      }
   
    }
  };


  blends.voijamisizzle = function (chunk, dupBuffer, options) { 
    var h = options.height, w = options.width;
    var skip = options.threshold || 4;
    var skippy = skip * 4;

    for (var i = 0; i < h; i++) {

      if ( i&skippy ) {
        continue;
      } 
      for (var j = 0; j < w; j++) {
      var index = (j*h+i)*4;
        dupBuffer[index  ] = chunk[index  ];
        dupBuffer[index+1] = chunk[index+1];
        dupBuffer[index+2] = chunk[index+2];
        dupBuffer[index+3] = chunk[index+3];
      }
   
    }
  };


  blends.fastervoijami = function (chunk, dupBuffer, opts, paramsArray) {

    // type: copy

    var x,y;
    var paramsArray = paramsArray || chunk;
    var skip = opts.threshold || 50;
    var h = opts.height, w = opts.width;
    var numEl = opts.numel || 4;


    var skippy = skip * numEl;


    for (var i = 0, l = chunk.length; i < l; i++) {
      if (i&skippy) {
        dupBuffer[i] = chunk[i];
      } else {
        if (i % 4 === 0)
          continue;
        dupBuffer[i] = 0;
      }
    }


  };


  blends.strangevoijamisizzle = function (chunk, dupBuffer, opts, paramsArray) {

    // type: copy
    var paramsArray = paramsArray || chunk;
    var h = opts.height, w = opts.width;
    var skip = opts.threshold || 4;

    var skippy = skip * 4;
    for (var i = 0; i < h; ++i) {

        if ( i&skippy ) {
          continue;
        } 
        for (var j = 0; j < w; ++j) {
          var index = (j*h +i)*4;
          dupBuffer[index  ] = chunk[index  ];
          dupBuffer[index+1] = chunk[index+1];
          dupBuffer[index+2] = chunk[index+2];
          dupBuffer[index+3] = 255;
        }
         
    }

  };





  blends.inversevoijami = function (chunk, dupBuffer,opts, paramsArray) {

    // type: copy

    var paramsArray = paramsArray || chunk;
    var h = opts.height, w = opts.width;
    var skip = opts.threshold || 4;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var skippy = skip;
    for (var i = 0; i < w; i++) {

        if ( (i&skippy) == 0 ) {
          continue;
        } 
        for (var j = 0; j < h; j++) {
          var index = j*w+i;
          clone[index] = data[index];
        }
         
    }

  };




  blends.strangevoijami = function (chunk, dupBuffer, opts, paramsArray) {

    // type: copy

    var paramsArray = paramsArray || chunk;
    var h = opts.height, w = opts.width;
    var skip = opts.threshold || 4;


    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var skippy = skip;
    for (var i = 0; i < w; i++) {

        if ( i&skippy ) {
          continue;
        } 
        for (var j = 0; j < h; j++) {
          var index = i*w+j;
          clone[index] = data[index];
        }
         
    }

  };




  blends.strangevoijamileft = function (chunk, dupBuffer, opts, paramsArray) {

    // type: copy

    var paramsArray = paramsArray || chunk;
    var h = opts.height, w = opts.width;
    var skip = opts.threshold || 4;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var skippy = skip;
    for (var i = 0; i < h; i++) {

        if ( i&skippy ) {
          continue;
        } 
        for (var j = 0; j < w; j++) {
          var index = i*w+j
          clone[index] = data[index];
        }
         
    }

  };


  blends.commin_etra = function (chunk, dupBuffer, options) { 
    var h = options.height, w = options.width, x, y;
    var xspace = options.xspace || 10, 
        yspace = options.yspace || 1, 
        weight = options.weight || 5,
        depth =  options.depth || 0.9;
    
    // Cheesy way to get around rewriting this function
    var data = new Uint32Array(dupBuffer.buffer);
    var clone = new Uint32Array(chunk.buffer);

    var vectors = [];
    var px = 0, py = 0, nx, ny;

    if (isLSB()) {  
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w + y; 
          var col = clone[index];
          var brite = extractBrightnessLSB(col);
          vectors.push([x, y, Math.abs(parseInt((depth*brite / 25),10)), col]);
        }
      }
    } else {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w + y; 
          var col = clone[index];
          var brite = extractBrightnessMSB(col);
          vectors.push([x, y, Math.abs(parseInt((depth*brite / 25),10)), col]);
        }
      }    
    }
    
    for (var v = 0, vl = vectors.length; v < vl; v++ ) {
      var vec = vectors[v];
      var x = vec[0], y = vec[1], z = vec[2], color = vec[3];
      var hz = parseInt(z/2, 10);
      nx = x + hz, ny = y ;
      createLine(px, py, nx, ny, color);
      px = nx;
      py = ny;

    }

    function createLine (startx, starty, endx, endy, color) {
      // var distances = [];
      var x1 = Number(startx);
      var x2 = Number(endx);
      var y1 = Number(starty);
      var y2 = Number(endy);

      var dx = Math.abs( x2 - x1 );
      var dy = Math.abs( y2 - y1 );
      var sx = (x1 < x2) ? 1 : -1;
      var sy = (y1 < y2) ? 1 : -1;
      var err = dx - dy;
      var count = 0;
      var index = x1 * w + y1
      data[ index ] = color;
      for (var i = 0; i < weight; i++) data[ index + (w * i) ] = color;
      // console.log(startx, starty, endx, endy, color, x1 * w + y1);
      // distances.push(new Coordinates(x1, y1));
      while(!((x1 == x2) && (y1 == y2)) ) {
        var e2 = err << 1;
        if (count > 100){
          break;
        }
        if (e2 > -dy) {
          err -= dy;
          x1 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y1 += sy;
        }
        count++;
        index = x1 * w * y1;
        for (var i = 0; i < weight; i++) data[ index + (w * i) ] = color;
        // clone[ cIndex ] = color;
      }
    }
  };


  blends.mendalpha = function (chunk, dupBuffer, opts) {

    // type: heal;
    // options : color;
    // var colR, colG, colB;
      // colR = 0xFF;
      // colG = 0xFF;
      // colB = 0xFF;  
    var color = colorObjectFromColorString(opts.color),
        colR = color.r || 0xFF,
        colG = color.g || 0xFF,
        colB = color.b || 0xFF;


    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var len = data.length;
    var isLittleEndian = isLSB();

    if (isLittleEndian) {
      for (var i = 0; i < len; i++) {
          var n = data[i];
          var a = (n >> 24) &0xff;
          
          if (a < 0xFF) {
            clone[i] =
                (0xFF << 24) |    // alpha
                (colB << 16) |    // blue
                (colG <<  8) |    // green
                 colR;            // red
          }       
      }
    } else {
      for (var i = 0; i < len; i++) {
          var n = data[i];
          var a = n&0xFF;
          
          if (a < 0xFF) {

          clone[i] =
              (colR << 24) |    // red
              (colG << 16) |    // green
              (colB <<  8) |    // blue
               0xFF;              // alpha
          }       
      }

    }

    // chunk.set(data);


  }


  /*
  // Disabled
  blends.imprint = function (chunk, dupBuffer, opts) {

    // type: alpha;
    // options : color;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var len = data.length;
    var isLittleEndian = isLSB();

    if (isLittleEndian) {
      for (var i = 0; i < len; i++) {
          var n = data[i];
          var r, g, b;
          r = (n >> 16) &0xff;
          g = (n >>  8) &0xff;
          b = (n &0xff);

          // var a = (n >> 24) &0xff;

          clone[i] =
              (0 << 24) |    // alpha
              (b << 16) |    // blue
              (g <<  8) |    // green
               r;            // red
      
      }
    } else {
      for (var i = 0; i < len; i++) {
          var n = data[i];
          var r, g, b;
          r = (n >> 16) &0xff;
          g = (n >>  8) &0xff;
          b = (n &0xff);

          clone[i] =
              (r << 24) |    // red
              (g << 16) |    // green
              (b <<  8) |    // blue
                0;              // alpha    
      }

    }
    
  }
  */


  // ======================================
  // Gradient Blends


  blends.blend_source_add = function (chunk, dupBuffer, options) {
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }
        clamped[index  ] = chunk[index  ] + Math.round(avgRed   / sl);
        clamped[index+1] = chunk[index+1] + Math.round(avgBlue  / sl);
        clamped[index+2] = chunk[index+2] + Math.round(avgGreen / sl);
      }
    }
  }



  blends.blend_source_subtract = function (chunk, dupBuffer, options) {
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
   
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }
        clamped[index  ] = chunk[index  ] - Math.round(avgRed   / sl);
        clamped[index+1] = chunk[index+1] - Math.round(avgBlue  / sl);
        clamped[index+2] = chunk[index+2] - Math.round(avgGreen / sl);
      }
    }
  }



  // blend_sample_add
  blends.digifire = function (chunk, dupBuffer, options) {
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
     
        var sl = 9;
        var side = 3;
        var halfside = 1;
   
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }
        clamped[index  ] = dupBuffer[index  ] + Math.round(avgRed   / sl);
        clamped[index+1] = dupBuffer[index+1] + Math.round(avgBlue  / sl);
        clamped[index+2] = dupBuffer[index+2] + Math.round(avgGreen / sl);
      }
    }
  }


  // blend_sample_subtract
  blends.digiice = function (chunk, dupBuffer, options) {
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
    
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }
        clamped[index  ] = dupBuffer[index  ] - Math.round(avgRed   / sl);
        clamped[index+1] = dupBuffer[index+1] - Math.round(avgBlue  / sl);
        clamped[index+2] = dupBuffer[index+2] - Math.round(avgGreen / sl);
      }
    }
  }



  // log_blend_source_add
  blends.contrast_point = function (chunk, dupBuffer, options) {
    var clamped = new Uint8ClampedArray(dupBuffer.buffer), log255 = Math.log(255), n,m,o;
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }

        n = dupBuffer[index+0] + (avgRed   / sl);
        m = dupBuffer[index+1] + (avgBlue  / sl);
        o = dupBuffer[index+2] + (avgGreen / sl);

        clamped[index  ] = Math.round(chunk[index  ] * Math.log(n) / log255);
        clamped[index+1] = Math.round(chunk[index+1] * Math.log(n) / log255);
        clamped[index+2] = Math.round(chunk[index+2] * Math.log(n) / log255);
      }
    }
  }

  // log_blend_source_subtract
  blends.black_point = function (chunk, dupBuffer, options) {
    var clamped = new Uint8ClampedArray(dupBuffer.buffer), log255 = Math.log(255), n,m,o;
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }

        n = dupBuffer[index+0] - (avgRed   / sl);
        m = dupBuffer[index+1] - (avgBlue  / sl);
        o = dupBuffer[index+2] - (avgGreen / sl);

        clamped[index  ] = Math.round(chunk[index  ] * Math.log(n) / log255);
        clamped[index+1] = Math.round(chunk[index+1] * Math.log(n) / log255);
        clamped[index+2] = Math.round(chunk[index+2] * Math.log(n) / log255);
      }
    }
  }


  /*
  blends.log_blend_sample_add = function (chunk, dupBuffer, options) {
    var clamped = new Uint8ClampedArray(dupBuffer.buffer), log255 = Math.log(255), n,m,o;
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }

        n = dupBuffer[index+0] + (avgRed   / sl);
        m = dupBuffer[index+1] + (avgBlue  / sl);
        o = dupBuffer[index+2] + (avgGreen / sl);

        clamped[index  ] = Math.round(dupBuffer[index  ] * Math.log(n) / log255);
        clamped[index+1] = Math.round(dupBuffer[index+1] * Math.log(n) / log255);
        clamped[index+2] = Math.round(dupBuffer[index+2] * Math.log(n) / log255);
      }
    }
  }
  */
  /*
  blends.log_blend_sample_subtract = function (chunk, dupBuffer, options) {
    var clamped = new Uint8ClampedArray(dupBuffer.buffer), log255 = Math.log(255), n,m,o;
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }

        n = dupBuffer[index+0] - (avgRed   / sl);
        m = dupBuffer[index+1] - (avgBlue  / sl);
        o = dupBuffer[index+2] - (avgGreen / sl);

        clamped[index  ] = Math.round(dupBuffer[index  ] * Math.log(n) / log255);
        clamped[index+1] = Math.round(dupBuffer[index+1] * Math.log(n) / log255);
        clamped[index+2] = Math.round(dupBuffer[index+2] * Math.log(n) / log255);
      }
    }
  }
  */

  // overflow_blend_source_add
  blends.streak_1995_add = function (chunk, dupBuffer, options) {
   for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }
        dupBuffer[index  ] = chunk[index  ] + Math.round(avgRed   / sl);
        dupBuffer[index+1] = chunk[index+1] + Math.round(avgBlue  / sl);
        dupBuffer[index+2] = chunk[index+2] + Math.round(avgGreen / sl);
      }
    }
  }


  // overflow_blend_source_subtract
  blends.blend_1995_subtract = function (chunk, dupBuffer, options) {
   for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
   
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }
        dupBuffer[index  ] = chunk[index  ] - Math.round(avgRed   / sl);
        dupBuffer[index+1] = chunk[index+1] - Math.round(avgBlue  / sl);
        dupBuffer[index+2] = chunk[index+2] - Math.round(avgGreen / sl);
      }
    }
  }



  // overflow_blend_sample_add
  blends.streak_1995_add = function (chunk, dupBuffer, options) {
   for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
     
        var sl = 9;
        var side = 3;
        var halfside = 1;
   
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }
        dupBuffer[index  ] = dupBuffer[index  ] + Math.round(avgRed   / sl);
        dupBuffer[index+1] = dupBuffer[index+1] + Math.round(avgBlue  / sl);
        dupBuffer[index+2] = dupBuffer[index+2] + Math.round(avgGreen / sl);
      }
    }
  }


  // overflow_blend_sample_subtract
  blends.streak_1995_subtract = function (chunk, dupBuffer, options) {
   for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
    
        var sl = 9;
        var side = 3;
        var halfside = 1;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            avgRed +=   chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }
        dupBuffer[index  ] = dupBuffer[index  ] - Math.round(avgRed   / sl);
        dupBuffer[index+1] = dupBuffer[index+1] - Math.round(avgBlue  / sl);
        dupBuffer[index+2] = dupBuffer[index+2] - Math.round(avgGreen / sl);
      }
    }
  }





  blends.releif_blend = function ( chunk, dupBuffer, opts, paramsArray ) {
    

    var h = opts.height, w = opts.width, x,y;


    for (var x = 0; x < w; x++ ) {
      for (var y = 0; y < h; y++) {
        var index = (x*h+y)*4;
        var sIndex = ((x+1)*h+(y+1))*4;
        var r = Math.round((chunk[index  ] + dupBuffer[index    ]) / 2);
        var g = Math.round((chunk[index+1] + dupBuffer[index + 1]) / 2);
        var b = Math.round((chunk[index+2] + dupBuffer[index + 2]) / 2);
        dupBuffer[index]   = r + (255/2 - chunk[ sIndex ]);
        dupBuffer[index+1] = g + (255/2 - chunk[ sIndex+1 ]);
        dupBuffer[index+2] = b + (255/2 - chunk[ sIndex+2 ]);
        dupBuffer[index+3] = 255;
      }
    }

  }


  blends.archez_mix_clamped = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
   

    // Diagonal
    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        // var Z = 255;
        var Z = chunk[index];
        var color = ( Z  * Math.abs(y%Math.sin(x))>10) ? 0 : 255;
        clamped[index]   = color - dupBuffer[index];
        clamped[index+1] = color - dupBuffer[index+1];
        clamped[index+2] = color - dupBuffer[index+2];
        clamped[index+3] = 255;
      }
    }

  }


  blends.archez_mix_overflow = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;


    // Diagonal
    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        // var Z = 255;
        var Z = chunk[index];
        var color = ( Z  * Math.abs(y%Math.sin(x))>10) ? 0 : 255;
        dupBuffer[index]   = color - dupBuffer[index];
        dupBuffer[index+1] = color - dupBuffer[index+1];
        dupBuffer[index+2] = color - dupBuffer[index+2];
        dupBuffer[index+3] = 255;
      }
    }

  }


  blends.contrast_blend_sub_dest = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   Math.round((Math.atan(x-h,y-w)*chunk[index  ])/360) - dupBuffer[index];
        dupBuffer[index+1] = Math.round((Math.atan(x-h,y-w)*chunk[index+1])/360) - dupBuffer[index+1];
        dupBuffer[index+2] = Math.round((Math.atan(x-h,y-w)*chunk[index+2])/360) - dupBuffer[index+2];
        dupBuffer[index+3] = 255;
      }
    }
  }


  /*
  blends.contrast_blend_clamped_sub_dest = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        clamped[index] =   Math.round((Math.atan(x-h,y-w)*chunk[index  ])/360) - dupBuffer[index];
        clamped[index+1] = Math.round((Math.atan(x-h,y-w)*chunk[index+1])/360) - dupBuffer[index+1];
        clamped[index+2] = Math.round((Math.atan(x-h,y-w)*chunk[index+2])/360) - dupBuffer[index+2];
        clamped[index+3] = 255;
      }
    }
  }


  */
  blends.contrast_blend_add_dest = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   Math.round((Math.atan(x-h,y-w)*chunk[index  ])/360) + dupBuffer[index];
        dupBuffer[index+1] = Math.round((Math.atan(x-h,y-w)*chunk[index+1])/360) + dupBuffer[index+1];
        dupBuffer[index+2] = Math.round((Math.atan(x-h,y-w)*chunk[index+2])/360) + dupBuffer[index+2];
        dupBuffer[index+3] = 255;
      }
    }
  }



  blends.contrast_blend_clamped_add_dest = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        clamped[index] =   Math.round((Math.atan(x-h,y-w)*chunk[index  ])/360) + dupBuffer[index];
        clamped[index+1] = Math.round((Math.atan(x-h,y-w)*chunk[index+1])/360) + dupBuffer[index+1];
        clamped[index+2] = Math.round((Math.atan(x-h,y-w)*chunk[index+2])/360) + dupBuffer[index+2];
        clamped[index+3] = 255;
      }
    }
  }



  blends.contrast_blend_sub_src = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   Math.round((Math.atan(x-h,y-w)*chunk[index  ])/360) - chunk[index];
        dupBuffer[index+1] = Math.round((Math.atan(x-h,y-w)*chunk[index+1])/360) - chunk[index+1];
        dupBuffer[index+2] = Math.round((Math.atan(x-h,y-w)*chunk[index+2])/360) - chunk[index+2];
        dupBuffer[index+3] = 255;
      }
    }
  }


  /*
  blends.contrast_blend_clamped_sub_src = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
    var index, r,g,b;
    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index + 1];
        b = chunk[index + 2];
        clamped[index] =   Math.round((Math.atan(x-h,y-w)* r )/360) - r;
        clamped[index+1] = Math.round((Math.atan(x-h,y-w)* g )/360) - g;
        clamped[index+2] = Math.round((Math.atan(x-h,y-w)* b )/360) - b;
        clamped[index+3] = 255;
      }
    }
  }*/



  blends.contrast_blend_add_src = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   Math.round((Math.atan(x-h,y-w)*chunk[index  ])/360) + chunk[index];
        dupBuffer[index+1] = Math.round((Math.atan(x-h,y-w)*chunk[index+1])/360) + chunk[index+1];
        dupBuffer[index+2] = Math.round((Math.atan(x-h,y-w)*chunk[index+2])/360) + chunk[index+2];
        dupBuffer[index+3] = 255;
      }
    }
  }



  blends.contrast_blend_clamped_add_src = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        clamped[index] =   Math.round((Math.atan(x-h,y-w)*chunk[index  ])/360) + chunk[index];
        clamped[index+1] = Math.round((Math.atan(x-h,y-w)*chunk[index+1])/360) + chunk[index+1];
        clamped[index+2] = Math.round((Math.atan(x-h,y-w)*chunk[index+2])/360) + chunk[index+2];
        clamped[index+3] = 255;
      }
    }
  }




  blends.shifter = function (chunk, dupBuffer, opts) { 


    var h = opts.height, w = opts.width, gamma = opts.depth;

    // Done
    var smoshDefaults = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [5,5,5,5,5,5,10,10,10,10,10,10],
      clip  : [150, 300, 500],
      def   : [100, 200, 15, 15]
    }

    //  Done
   
    function findDistance (loc, step) {
      return loc + (step*4)
    }

    function channelSwing(pixel, loc, swingMap) {
      var pixelValue = pixel.r + pixel.g + pixel.b;
      // Done
      
      function swingDistort(loc, swing, thresh, def) {
        var temp = chunk[ findDistance(loc, swing) + thresh ] ? chunk[ findDistance(loc, swing) + thresh ] * gamma : def * gamma;  
        return temp;
      }

    if ( pixelValue > swingMap.clip[0]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[0], swingMap.thresh[0], swingMap.def[0] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[1], swingMap.thresh[1], swingMap.def[0] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[2], swingMap.thresh[2], swingMap.def[0] );
      dupBuffer[loc +3] = 255;
    } else if ( pixelValue > swingMap.clip[1]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[3], swingMap.thresh[3], swingMap.def[1] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[4], swingMap.thresh[4], swingMap.def[1] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[5], swingMap.thresh[5], swingMap.def[1] );
      dupBuffer[loc +3] = 255;
    } else if (pixelValue > swingMap.clip[2]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[6], swingMap.thresh[6], swingMap.def[2] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[7], swingMap.thresh[7], swingMap.def[2] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[8], swingMap.thresh[8], swingMap.def[2] );
      dupBuffer[loc +3] = 255;
    } else {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[9],  swingMap.thresh[9],  swingMap.def[3] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[10], swingMap.thresh[10], swingMap.def[3] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[11], swingMap.thresh[11], swingMap.def[3] );
      dupBuffer[loc +3] = 255;
    }



  }
    var i = 0, j = 0;
    for (i = 0; i < h; ++i) {
        for (j = 0; j < w; ++j) {
            
            var index = (i*w+j)*4;

            
            // Pass an rgba objects to the processing function.
            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };
            
            // Process the tuple.
            channelSwing(rgba, index, smoshDefaults);
              dupBuffer[index + 0] = (dupBuffer[index + 0] + rgba.r) / 2; 
              dupBuffer[index + 1] = (dupBuffer[index + 1] + rgba.g) / 2; 
              dupBuffer[index + 2] = (dupBuffer[index + 2] + rgba.b) / 2; 
              dupBuffer[index + 3] = 255;

        }
    }
  }



  blends.swingdistortfuzz = function (chunk, dupBuffer, opts) { 

    var gamma = opts.depth || 1;
    var h = opts.height, w = opts.width;



    // Actual settings dont matter
    var fizzleDefaults = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [5,5,5,10,10,10,-10,-10,-10,-5,-5,-5],
      clip:   [150, 300, 500],
      def:    [150,150,150,150]
    }

    function findDistance (loc, step) {
      return loc + (step*4)
    }

    function channelSwing(pixel, loc, swingMap) {
      var pixelValue = pixel.r + pixel.g + pixel.b;
      // Done
      
      function swingDistort(loc, swing, thresh, def) {
        var temp = chunk[ findDistance(loc, swing) + thresh ] ? chunk[ findDistance(loc, swing) + thresh ] * gamma : def * gamma;  
        return temp;
      }

    if ( pixelValue > swingMap.clip[0]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[0], swingMap.thresh[0], swingMap.def[0] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[1], swingMap.thresh[1], swingMap.def[0] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[2], swingMap.thresh[2], swingMap.def[0] );
      dupBuffer[loc +3] = 255;
    } else if ( pixelValue > swingMap.clip[1]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[3], swingMap.thresh[3], swingMap.def[1] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[4], swingMap.thresh[4], swingMap.def[1] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[5], swingMap.thresh[5], swingMap.def[1] );
      dupBuffer[loc +3] = 255;
    } else if (pixelValue > swingMap.clip[2]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[6], swingMap.thresh[6], swingMap.def[2] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[7], swingMap.thresh[7], swingMap.def[2] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[8], swingMap.thresh[8], swingMap.def[2] );
      dupBuffer[loc +3] = 255;
    } else {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[9],  swingMap.thresh[9],  swingMap.def[3] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[10], swingMap.thresh[10], swingMap.def[3] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[11], swingMap.thresh[11], swingMap.def[3] );
      dupBuffer[loc +3] = 255;
    }



  }
    
    var i = 0, j = 0, n = 0;
    var p = Math.floor(h / 2);

    for (var i = 0; i < h; i++) {


        if ( i  < p ){

          var coeff1 = p +   i;
          var coeff2 = p + (i*2)//(i*2);
          var coeff3 = p + (i*3)//(i*4);
          var coeff4 = p + (i*4)//(i*8);

        } else {

          var coeff1 = p -   i;
          var coeff2 = p - (i/2);
          var coeff3 = p - (i/3);
          var coeff4 = p - (i/4);

        }


        fizzleDefaults.swing[0] = fizzleDefaults.swing[1] = fizzleDefaults.swing[2] = coeff1;  
        fizzleDefaults.swing[3] = fizzleDefaults.swing[4] = fizzleDefaults.swing[5] = coeff2;
        fizzleDefaults.swing[6] = fizzleDefaults.swing[7] = fizzleDefaults.swing[8] = coeff3;
        fizzleDefaults.swing[9] = fizzleDefaults.swing[10] = fizzleDefaults.swing[11] = coeff4;
      

        for (var j = 0; j < w; j++) {
            
            var index = (i*w+j)*4;          


            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };

              channelSwing(rgba, index, fizzleDefaults);
              dupBuffer[index + 0] = (dupBuffer[index + 0] + rgba.r) / 2; 
              dupBuffer[index + 1] = (dupBuffer[index + 1] + rgba.g) / 2; 
              dupBuffer[index + 2] = (dupBuffer[index + 2] + rgba.b) / 2; 
              dupBuffer[index + 3] = 255; 

        }
    }
  }




  blends.slish = function (chunk, dupBuffer, opts) { 

    var gamma = opts.depth || 1;
    var h = opts.height, w = opts.width;



    // for (var i = 0; i < )

    // Actual settings dont matter
    var fizzleDefaults = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [5,5,5,10,10,10,-10,-10,-10,-5,-5,-5],
      clip:   [150, 300, 500],
      def:    [150,150,150,150]
    }

    function findDistance (loc, step) {
      return loc + (step*4)
    }

    function channelSwing(pixel, loc, swingMap) {
      var pixelValue = pixel.r + pixel.g + pixel.b;
      // Done
      
      function swingDistort(loc, swing, thresh, def) {
        var temp = chunk[ findDistance(loc, swing) + thresh ] ? chunk[ findDistance(loc, swing) + thresh ] * gamma : def * gamma;  
        return temp;
      }

    if ( pixelValue > swingMap.clip[0]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[0], swingMap.thresh[0], swingMap.def[0] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[1], swingMap.thresh[1], swingMap.def[0] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[2], swingMap.thresh[2], swingMap.def[0] );
      dupBuffer[loc +3] = 255;
    } else if ( pixelValue > swingMap.clip[1]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[3], swingMap.thresh[3], swingMap.def[1] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[4], swingMap.thresh[4], swingMap.def[1] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[5], swingMap.thresh[5], swingMap.def[1] );
      dupBuffer[loc +3] = 255;
    } else if (pixelValue > swingMap.clip[2]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[6], swingMap.thresh[6], swingMap.def[2] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[7], swingMap.thresh[7], swingMap.def[2] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[8], swingMap.thresh[8], swingMap.def[2] );
      dupBuffer[loc +3] = 255;
    } else {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[9],  swingMap.thresh[9],  swingMap.def[3] );
      dupBuffer[loc +1] = swingDistort( loc, swingMap.swing[10], swingMap.thresh[10], swingMap.def[3] );
      dupBuffer[loc +2] = swingDistort( loc, swingMap.swing[11], swingMap.thresh[11], swingMap.def[3] );
      dupBuffer[loc +3] = 255;
    }



  }
    
    var i = 0, j = 0, n = 0;
    var p = Math.floor(h / 2);

    for (var i = 0; i < h; ++i) {


        if ( i  < p ){

          var coeff1 = p +   i;
          var coeff2 = p + (i*2)//(i*2);
          var coeff3 = p + (i*3)//(i*4);
          var coeff4 = p + (i*4)//(i*8);

        } else {

          var coeff1 = p -   i;
          var coeff2 = p - (i/2);
          var coeff3 = p - (i/3);
          var coeff4 = p - (i/4);

        }

        fizzleDefaults.swing[0] = fizzleDefaults.swing[1] = fizzleDefaults.swing[2] = coeff1;  
        fizzleDefaults.swing[3] = fizzleDefaults.swing[4] = fizzleDefaults.swing[5] = coeff2;
        fizzleDefaults.swing[6] = fizzleDefaults.swing[7] = fizzleDefaults.swing[8] = coeff3;
        fizzleDefaults.swing[9] = fizzleDefaults.swing[10] = fizzleDefaults.swing[11] = coeff4;
      

        for (var j = 0; j < w; ++j) {
            
            var index = (i*w+j)*4;
            
            // Pass an rgba objects to the processing function.


            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };

              channelSwing(rgba, index, fizzleDefaults);
              dupBuffer[index + 0] = (dupBuffer[index + 0] + rgba.r) / 2;
              dupBuffer[index + 1] = (dupBuffer[index + 1] + rgba.g) / 2;
              dupBuffer[index + 2] = (dupBuffer[index + 2] + rgba.b) / 2;
              dupBuffer[index + 3] = 255; 

        }
    }

  }


  blends.kernelblend = function (chunk, dupBuffer, options) {

    var sharpKernel = {
      height: 3,
      width: 3,
      data :[-1,-1,-1, -1,11,-1, -1,-1,-1]
    },
    brightKernel = {
      height: 3,
      width: 3,
      data :[1,1,1, 1,8,1, 1,1,1]
    },
    blueKernel ={
      height: 3, 
      width:3,
      data: [1,0,1, 0,5,0, 1,0,1]
    };

    var sl = sharpKernel.height * sharpKernel.width;
    var side = Math.sqrt(sl);
    var kernel = sharpKernel.data;
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            var kval = kernel[dx * side + dy];
            avgRed +=   kval * chunk[ sIndex     ] - dupBuffer[ sIndex    ];
            avgBlue +=  kval * chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
            avgGreen += kval * chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
          }
        }
        dupBuffer[index  ] = dupBuffer[index  ] + Math.round(avgRed   / sl);
        dupBuffer[index+1] = dupBuffer[index+1] + Math.round(avgBlue  / sl);
        dupBuffer[index+2] = dupBuffer[index+2] + Math.round(avgGreen / sl);
      }
    }


  }


  blends.kernelblaze = function (chunk, dupBuffer, options) {

    var sharpKernel = {
      height: 3,
      width: 3,
      data :[-1,-1,-1, -1,11,-1, -1,-1,-1]
    },
    brightKernel = {
      height: 3,
      width: 3,
      data :[1,1,1, 1,8,1, 1,1,1]
    },
    blueKernel ={
      height: 3, 
      width:3,
      data: [1,0,1, 0,5,0, 1,0,1]
    };

    var sl = sharpKernel.height * sharpKernel.width;
    var side = Math.sqrt(sl);
    var kernel = sharpKernel.data;
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        var avgRed = 0, avgBlue = 0, avgGreen = 0;
        for (var dx = 0; dx < side; ++dx) {
          for (var dy = 0; dy < side; ++dy) {
            var sIndex = (x+dx) * w + (y+dy) * 4;
            var kval = kernel[dx * side + dy];
            avgRed +=   kval * chunk[ sIndex     ];
            avgBlue +=  kval * chunk[ sIndex + 1 ];
            avgGreen += kval * chunk[ sIndex + 2 ];
          }
        }
        dupBuffer[index  ] = chunk[index  ] + Math.round(avgRed   / sl);
        dupBuffer[index+1] = chunk[index+1] + Math.round(avgBlue  / sl);
        dupBuffer[index+2] = chunk[index+2] + Math.round(avgGreen / sl);
      }
    }


  }



  blends.clipped = function (chunk, dupBuffer, options) { 
    var i = 0, l = dupBuffer.length;
    while (i < l) {
      dupBuffer[++i] = chunk[i] >= 245 ? dupBuffer[i] : chunk[i] ;
    }
  }

  blends.notclipped = function (chunk, dupBuffer, options) { 
    var i = 0, l = dupBuffer.length;
    while (i < l) {
      dupBuffer[++i] = chunk[i] >= 245 ? chunk[i] : dupBuffer[i];
    }

  }

  blends.mean = function (chunk, dupBuffer, options) {
    var i = 0, l = dupBuffer.length;
    var mean = meanPixel(dupBuffer);
    while (i < l) {
      dupBuffer[++i] = dupBuffer[i] <= (mean[0] + 10 ) && dupBuffer[i] >= (mean[0] - 10) ? dupBuffer[i] : chunk[i]
      dupBuffer[++i] = dupBuffer[i] <= (mean[1] + 10 ) && dupBuffer[i] >= (mean[1] - 10) ? dupBuffer[i] : chunk[i]
      dupBuffer[++i] = dupBuffer[i] <= (mean[2] + 10 ) && dupBuffer[i] >= (mean[2] - 10) ? dupBuffer[i] : chunk[i]
      dupBuffer[i++] = 255
    }
  }

  blends.notmean = function (chunk, dupBuffer, options) {
    var i = 0, l = dupBuffer.length;
    var mean = meanPixel(dupBuffer);
    while (i < l) {
      dupBuffer[++i] = dupBuffer[i] <= (mean[0] + 10 ) && dupBuffer[i] >= (mean[0] - 10) ? chunk[i] : dupBuffer[i];
      dupBuffer[++i] = dupBuffer[i] <= (mean[1] + 10 ) && dupBuffer[i] >= (mean[1] - 10) ? chunk[i] : dupBuffer[i];
      dupBuffer[++i] = dupBuffer[i] <= (mean[2] + 10 ) && dupBuffer[i] >= (mean[2] - 10) ? chunk[i] : dupBuffer[i];
      dupBuffer[i++] = 255
    }
  }

  blends.color = function (chunk, dupBuffer, options) { 
    var threshold = options.threshold || 1
    var color = colorObjectFromColorString(options.color);
    var r = color.r || 150; 
    var g = color.g || 150; 
    var b = color.b || 150; 
    for (var x = 0, h = options.height; x < h; x++) {
      for (var y = 0, w = options.width; y < w; y++) {
        var index = (x*w+y)*4;
        if ( dupBuffer[index + 0] <= (r + threshold ) && dupBuffer[index + 0] >= (r - threshold)) {
          if ( dupBuffer[index + 1] <= (g + threshold ) && dupBuffer[index + 1] >= (g - threshold)) {
            if ( dupBuffer[index + 2] <= (b + threshold ) && dupBuffer[index + 2] >= (b - threshold)) {
              dupBuffer[index + 0] = chunk[index + 0];
              dupBuffer[index + 1] = chunk[index + 1];
              dupBuffer[index + 2] = chunk[index + 2];
            }
          }
        }
      }
    }
  }

  blends.light = function (chunk, dupBuffer, options) { 
    var threshold = options.threshold || 50;
    for (var x = 0, h = options.height; x < h; x++) {
      for (var y = 0, w = options.width; y < w; y++) {
        var index = (x*w+y)*4;
        if ( dupBuffer[index + 0] <= (220 + threshold ) && dupBuffer[index + 0] >= (220 - threshold)) {
          if ( dupBuffer[index + 1] <= (220 + threshold ) && dupBuffer[index + 1] >= (220 - threshold)) {
            if ( dupBuffer[index + 2] <= (220 + threshold ) && dupBuffer[index + 2] >= (220 - threshold)) {
              dupBuffer[index + 0] = chunk[index + 0];
              dupBuffer[index + 1] = chunk[index + 1];
              dupBuffer[index + 2] = chunk[index + 2];
            }
          }
        }
      }
    }
  }

  blends.dark = function (chunk, dupBuffer, options) { 
    var threshold = options.threshold || 50;
    for (var x = 0, h = options.height; x < h; x++) {
      for (var y = 0, w = options.width; y < w; y++) {
        var index = (x*w+y)*4;
        if ( dupBuffer[index + 0] <= (20 + threshold ) && dupBuffer[index + 0] >= (20 - threshold)) {
          if ( dupBuffer[index + 1] <= (20 + threshold ) && dupBuffer[index + 1] >= (20 - threshold)) {
            if ( dupBuffer[index + 2] <= (20 + threshold ) && dupBuffer[index + 2] >= (20 - threshold)) {
              dupBuffer[index + 0] = chunk[index + 0];
              dupBuffer[index + 1] = chunk[index + 1];
              dupBuffer[index + 2] = chunk[index + 2];
            }
          }
        }
      }
    }
  }

  blends.mid = function (chunk, dupBuffer, options) { 
    var threshold = options.threshold || 50;
    for (var x = 0, h = options.height; x < h; x++) {
      for (var y = 0, w = options.width; y < w; y++) {
        var index = (x*w+y)*4;
        if ( dupBuffer[index + 0] <= (100 + threshold ) && dupBuffer[index + 0] >= (100 - threshold)) {
          if ( dupBuffer[index + 1] <= (100 + threshold ) && dupBuffer[index + 1] >= (100 - threshold)) {
            if ( dupBuffer[index + 2] <= (100 + threshold ) && dupBuffer[index + 2] >= (100 - threshold)) {
              dupBuffer[index + 0] = chunk[index + 0];
              dupBuffer[index + 1] = chunk[index + 1];
              dupBuffer[index + 2] = chunk[index + 2];
            }
          }
        }
      }
    }
  }

  blends.red = function (chunk, dupBuffer, options) { 
    var threshold = options.threshold || 50;
    for (var x = 0, h = options.height; x < h; x++) {
      for (var y = 0, w = options.width; y < w; y++) {
        var index = (x*w+y)*4;
        if ( dupBuffer[index] <= (200 + threshold ) && dupBuffer[index] >= (200 - threshold)) {
          dupBuffer[index + 0] = chunk[index + 0];
          dupBuffer[index + 1] = chunk[index + 1];
          dupBuffer[index + 2] = chunk[index + 2];
        }
      }
    }
  }

  blends.green = function (chunk, dupBuffer, options) { 
    var threshold = options.threshold || 50;
    for (var x = 0, h = options.height; x < h; x++) {
      for (var y = 0, w = options.width; y < w; y++) {
        var index = (x*w+y)*4;
        if ( dupBuffer[index+1] <= (200 + threshold ) && dupBuffer[index+1] >= (200 - threshold)) {
          dupBuffer[index + 0] = chunk[index + 0];
          dupBuffer[index + 1] = chunk[index + 1];
          dupBuffer[index + 2] = chunk[index + 2];
        }
      }
    }
  }

  blends.blue = function (chunk, dupBuffer, options) { 
    var threshold = options.threshold || 50;
    for (var x = 0, h = options.height; x < h; x++) {
      for (var y = 0, w = options.width; y < w; y++) {
        var index = (x*w+y)*4;
        if ( dupBuffer[index+2] <= (200 + threshold ) && dupBuffer[index+2] >= (200 - threshold)) {
          dupBuffer[index + 0] = chunk[index + 0];
          dupBuffer[index + 1] = chunk[index + 1];
          dupBuffer[index + 2] = chunk[index + 2];
        }
      }
    }
  }


  blends.source_poisson_add = function (chunk, dupBuffer, options) { 
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var m = [
          index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          index-4, index, index+4,
          index+((w*4) -4), index+ (w*4), index+(w*4) + 4
        ];
        var ml = m.length;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;

        for (var k = 0; k < ml; k++) {
          avgRed +=   dupBuffer[ m[k] + 0 ] - chunk[ m[k] + 0];
          avgBlue +=  dupBuffer[ m[k] + 1 ] - chunk[ m[k] + 1];
          avgGreen += dupBuffer[ m[k] + 2 ] - chunk[ m[k] + 2];
        }
        
        clamped[index+0] = dupBuffer[index+0] + (avgRed   / ml);
        clamped[index+1] = dupBuffer[index+1] + (avgBlue  / ml);
        clamped[index+2] = dupBuffer[index+2] + (avgGreen / ml);
      }
    }
  }

  blends.source_poisson_subtract = function (chunk, dupBuffer, options) { 
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var m = [
          index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          index-4, index, index+4,
          index+((w*4) -4), index+ (w*4), index+(w*4) + 4
        ];
        var ml = m.length;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;

        for (var k = 0; k < ml; k++) {
          avgRed +=   dupBuffer[ m[k] + 0 ] - chunk[ m[k] + 0];
          avgBlue +=  dupBuffer[ m[k] + 1 ] - chunk[ m[k] + 1];
          avgGreen += dupBuffer[ m[k] + 2 ] - chunk[ m[k] + 2];
        }
        
        clamped[index+0] = dupBuffer[index+0] - (avgRed   / ml);
        clamped[index+1] = dupBuffer[index+1] - (avgBlue  / ml);
        clamped[index+2] = dupBuffer[index+2] - (avgGreen / ml);
      }
    }
  }
  blends.sample_poisson_add = function (chunk, dupBuffer, options) { 
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var m = [
          index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          index-4, index, index+4,
          index+((w*4) -4), index+ (w*4), index+(w*4) + 4
        ];
        var ml = m.length;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;

        for (var k = 0; k < ml; k++) {
          avgRed +=   dupBuffer[ m[k] + 0 ] - chunk[ m[k] + 0];
          avgBlue +=  dupBuffer[ m[k] + 1 ] - chunk[ m[k] + 1];
          avgGreen += dupBuffer[ m[k] + 2 ] - chunk[ m[k] + 2];
        }
        
        clamped[index+0] = chunk[index+0] + (avgRed   / ml);
        clamped[index+1] = chunk[index+1] + (avgBlue  / ml);
        clamped[index+2] = chunk[index+2] + (avgGreen / ml);
      }
    }
  }

  blends.sample_poisson_subtract = function (chunk, dupBuffer, options) { 
    var clamped = new Uint8ClampedArray(dupBuffer.buffer);
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var m = [
          index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          index-4, index, index+4,
          index+((w*4) -4), index+ (w*4), index+(w*4) + 4
        ];
        var ml = m.length;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;

        for (var k = 0; k < ml; k++) {
          avgRed +=   dupBuffer[ m[k] + 0 ] - chunk[ m[k] + 0];
          avgBlue +=  dupBuffer[ m[k] + 1 ] - chunk[ m[k] + 1];
          avgGreen += dupBuffer[ m[k] + 2 ] - chunk[ m[k] + 2];
        }
        
        clamped[index+0] = chunk[index+0] - (avgRed   / ml);
        clamped[index+1] = chunk[index+1] - (avgBlue  / ml);
        clamped[index+2] = chunk[index+2] - (avgGreen / ml);
      }
    }
  }

  blends.source_overflow_add = function (chunk, dupBuffer, options) { 
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var m = [
          index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          index-4, index, index+4,
          index+((w*4) -4), index+ (w*4), index+(w*4) + 4
        ];
        var ml = m.length;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;

        for (var k = 0; k < ml; k++) {
          avgRed +=   dupBuffer[ m[k] + 0 ] - chunk[ m[k] + 0];
          avgBlue +=  dupBuffer[ m[k] + 1 ] - chunk[ m[k] + 1];
          avgGreen += dupBuffer[ m[k] + 2 ] - chunk[ m[k] + 2];
        }
        
        dupBuffer[index+0] = dupBuffer[index+0] + (avgRed   / ml);
        dupBuffer[index+1] = dupBuffer[index+1] + (avgBlue  / ml);
        dupBuffer[index+2] = dupBuffer[index+2] + (avgGreen / ml);
      }
    }
  }

  blends.source_overflow_subtract = function (chunk, dupBuffer, options) { 
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var m = [
          index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          index-4, index, index+4,
          index+((w*4) -4), index+ (w*4), index+(w*4) + 4
        ];
        var ml = m.length;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;

        for (var k = 0; k < ml; k++) {
          avgRed +=   dupBuffer[ m[k] + 0 ] - chunk[ m[k] + 0];
          avgBlue +=  dupBuffer[ m[k] + 1 ] - chunk[ m[k] + 1];
          avgGreen += dupBuffer[ m[k] + 2 ] - chunk[ m[k] + 2];
        }
        
        dupBuffer[index+0] = dupBuffer[index+0] - (avgRed   / ml);
        dupBuffer[index+1] = dupBuffer[index+1] - (avgBlue  / ml);
        dupBuffer[index+2] = dupBuffer[index+2] - (avgGreen / ml);
      }
    }
  }
  blends.sample_overflow_add = function (chunk, dupBuffer, options) { 
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var m = [
          index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          index-4, index, index+4,
          index+((w*4) -4), index+ (w*4), index+(w*4) + 4
        ];
        var ml = m.length;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;

        for (var k = 0; k < ml; k++) {
          avgRed +=   dupBuffer[ m[k] + 0 ] - chunk[ m[k] + 0];
          avgBlue +=  dupBuffer[ m[k] + 1 ] - chunk[ m[k] + 1];
          avgGreen += dupBuffer[ m[k] + 2 ] - chunk[ m[k] + 2];
        }
        
        dupBuffer[index+0] = chunk[index+0] + (avgRed   / ml);
        dupBuffer[index+1] = chunk[index+1] + (avgBlue  / ml);
        dupBuffer[index+2] = chunk[index+2] + (avgGreen / ml);
      }
    }
  }

  blends.sample_overflow_subtract = function (chunk, dupBuffer, options) { 
    for (var x=0,x1=1,h = options.height, h1 = options.height-1; x1 < h1; x++, x1++) {
      for (var y=0,y1=1,w = options.width, w1 = options.width-1; y1 < w1; y++, y1++) {
        // starting at 1,1
        var index = (x1*w+y1)*4; 
        // movement kernel
        var m = [
          index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          index-4, index, index+4,
          index+((w*4) -4), index+ (w*4), index+(w*4) + 4
        ];
        var ml = m.length;
        var avgRed = 0, avgBlue = 0, avgGreen = 0;

        for (var k = 0; k < ml; k++) {
          avgRed +=   dupBuffer[ m[k] + 0 ] - chunk[ m[k] + 0];
          avgBlue +=  dupBuffer[ m[k] + 1 ] - chunk[ m[k] + 1];
          avgGreen += dupBuffer[ m[k] + 2 ] - chunk[ m[k] + 2];
        }
        
        dupBuffer[index+0] = chunk[index+0] - (avgRed   / ml);
        dupBuffer[index+1] = chunk[index+1] - (avgBlue  / ml);
        dupBuffer[index+2] = chunk[index+2] - (avgGreen / ml);
      }
    }
  }


  blends.boost = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;

    for (var i = 0, l = chunk.length; i < l; i+=4) {

      dupBuffer[i] = Math.round(255 * Math.log(chunk[i])/Math.log(255));
      dupBuffer[i+1] = Math.round(255 * Math.log(chunk[i+1])/Math.log(255));
      dupBuffer[i+2] = Math.round(255 * Math.log(chunk[i+2])/Math.log(255));
      dupBuffer[i+3] = 255;
    }
  }




  blends.solarization = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // point-inversitive
    // Turn this into a blend mode
    var h = opts.height, w = opts.width, x,y;

    for (var i = 0, l = chunk.length; i < l; i+=4) {

      dupBuffer[i]   = (chunk[i] < 255/2) ? 255 - chunk[i]:chunk[i];
      dupBuffer[i+1] = (chunk[i+1] < 255/2) ? 255 - chunk[i+1]:chunk[i+1];
      dupBuffer[i+2] = (chunk[i+2] < 255/2) ? 255 - chunk[i+2]:chunk[i+2];
      dupBuffer[i+3] = 255;
    }

  }



  blends.solar_gradient = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: gradientblend

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < w; x++ ) {
      for (var y = 0; y < h; y++) {
        var index = (x*h+y)*4;
        var r = chunk[index];
        var g = chunk[index+1];
        var b = chunk[index+2];
        dupBuffer[index]   = (r > (255*x)/(2*w))?r : 255 - r;
        dupBuffer[index+1] = (g > (255*x)/(2*w))?g : 255 - g;
        dupBuffer[index+2] = (b > (255*x)/(2*w))?b : 255 - b;
        dupBuffer[index+3] = 255;
      }
    }
  }



  blends.solar_gradient_map = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: gradientblend

    var h = opts.height, w = opts.width, x,y;
    var paramsArray = paramsArray || chunk;

    for (var x = 0; x < w; x++ ) {
      for (var y = 0; y < h; y++) {
        var index = (x*h+y)*4;
        var r = chunk[index];
        var g = chunk[index+1];
        var b = chunk[index+2];
        var sR = paramsArray[index];
        var sG = paramsArray[index+1];
        var sB = paramsArray[index+2];
        dupBuffer[index]   = (sR > (255*x)/(2*w))?r : 255 - r;
        dupBuffer[index+1] = (sG > (255*x)/(2*w))?g : 255 - g;
        dupBuffer[index+2] = (sB > (255*x)/(2*w))?b : 255 - b;
        dupBuffer[index+3] = 255;
      }
    }
  }


  blends.deplacement = function (chunk, dupBuffer, opts, displacementMap) {
    var depth = opts.threshold || 50;
        var w = opts.width, h = opts.height;
        var w1 = w-1, h1 = h - 1;
        var index, target;

        var x, y,shiftx, shifty;
        var a = 50, b = 120;
        var mx = 0, my = 0;
            mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
            my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
        for(y = 0; y < h; ++y) {
          for(x = 0; x < w; ++x) {
            index = y * w + x << 2; // interesting
            shiftx = x + chunk[index] / 255 * -mx * depth >> 0;
            shifty = y + chunk[index] / 255 * -my * depth >> 0;
            // clamp
            if(shiftx < 0){
                shiftx = 0
            } else if(shiftx > w1){
                shiftx = w1
            }
            if(shifty < 0){
                shifty = 0
            } else if(shifty > h1){
                shifty = h1
            }

            target = shifty * w + shiftx << 2;
            dupBuffer[index]   = chunk[target];
            dupBuffer[index+1] = chunk[target+1];
            dupBuffer[index+2] = chunk[target+2];
          }
        }
  }


  blends.deplacementup = function (chunk, dupBuffer, opts, displacementMap) {
    var depth = opts.threshold || 50;
        var w = opts.width, h = opts.height;
        var w1 = w-1, h1 = h - 1;
        var index, target;
        // Clone current images

        var x, y,shiftx, shifty;
        var a = 50, b = 120;
        var mx = 0, my = 0;
            mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
            my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
        for(y = 0; y < w; ++y) {
          for(x = 0; x < h; ++x) {
            index = y * h + x << 2; // interesting
            shiftx = x + chunk[index] / 255 * -mx * depth >> 0;
            shifty = y + chunk[index] / 255 * -my * depth >> 0;
            // clamp
            if(shiftx < 0){
                shiftx = 0
            } else if(shiftx > h1){
                shiftx = h1
            }
            if(shifty < 0){
                shifty = 0
            } else if(shifty > w1){
                shifty = w1
            }

            target = shifty * h + shiftx << 2;
            dupBuffer[index]   = chunk[target];
            dupBuffer[index+1] = chunk[target+1];
            dupBuffer[index+2] = chunk[target+2];
          }
        }
  }

  blends.displacement_map = function (chunk, dupBuffer, opts, displacementMap) {
    var depth = opts.threshold || 50;
    var w = opts.width, h = opts.height;
    var tx=0,ty=0,mx=0,my=0;
    var w1 = w-1; var h1 = h - 1;
    var i, j, index, target;
    var x, y, px, py;
    var a = 50, b = 50;
    var displacementMap = displacementMap || chunk;

    mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
    my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) ) ;
    // console.log('mx,my:',mx, " ",my);
    var count = 0;


    var tmpa, tmpb;
    for(y = 0; y < h; ++y) {
        for(x = 0; x < w; ++x) {
          index = y * w + x << 2; // interesting
          px = x + displacementMap[index] / 255 * -mx * depth >> 0;
          py = y + displacementMap[index] / 255 * -my * depth >> 0;
          // clamp
          if(px < 0){
              px = x
          } else if(px > w1){
              px = w1
          }
          if(py < 0){
              py = y
          } else if(py > h1){
              py = h1
          }

          target = py * w + px << 2;
   

          dupBuffer[index]   = chunk[target];
          dupBuffer[index+1] = chunk[target+1];
          dupBuffer[index+2] = chunk[target+2];


        }
    }
  }

  blends.bwdisplacement_map = function (chunk, dupBuffer, opts, displacementMap) {
    var depth = opts.threshold || 50;
    var w = opts.width, h = opts.height;
    var w1 = w-1, h1 = h - 1;
    var i, j, index, target;
    var x, y,shiftx, shifty;
    var mx=0,my=0;
    var displacementMap = displacementMap || chunk;
    var tx = ((w/4) / window.innerWidth) * 2 - 1;
    var ty = ((h/4) / window.innerHeight) * 2 - 1;
    mx += (tx - mx) * .05;
    my += (ty - my) * .05;

    for(y = 0; y < h; ++y) {
        for(x = 0; x < w; ++x) {
          index = y * w + x << 2; // interesting
          shiftx = x + displacementMap[index] / 255 * -mx * depth >> 0;
          shifty = y + displacementMap[index] / 255 * -my * depth >> 0;
          // clamp
          if(shiftx < 0){
              shiftx = 0
          } else if(shiftx > w1){
              shiftx = w1
          }
          if(shifty < 0){
              shifty = 0
          } else if(shifty > h1){
              shifty = h1
          }

          target = shifty * w + shiftx << 2;
          dupBuffer[index] =   chunk[target];
          dupBuffer[index+1] = chunk[target+1];
          dupBuffer[index+2] = chunk[target+2];
        }
    }
  }

  // Bad Math..but oh so good
  blends.glichurdisplacement_map = function (chunk, dupBuffer, opts, displacementMap) {
    var depth = opts.threshold || 50;
    var w = opts.width, h = opts.height;
    var w1 = w-1, h1 = h - 1;
    var i, j, index, target;
    var x, y,shiftx, shifty;
    var displacementMap = displacementMap || chunk;

    for(y = 0; y < h; ++y) {
        for(x = 0; x < w; ++x) {
          index = y * w + x << 2; // interesting
          shiftx = x + displacementMap[index] / 255 * 20 * depth >> 0;
          shifty = y + displacementMap[index] / 255 * 20 * depth >> 0;
          // clamp
          if(shiftx < 0){
              shiftx = 0
          } else if(shiftx > w1){
              shiftx = w1
          }
          if(shifty < 0){
              shifty = 0
          } else if(shifty > h1){
              shifty = h1
          }

          target = shifty * h + shiftx << 2;
          dupBuffer[index] =   chunk[target];
          dupBuffer[index+1] = chunk[target+1];
          dupBuffer[index+2] = chunk[target+2];
        }
    }
  }



  blends.deplace = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height,
        a = options.xspace || 50,
        b = options.yspace || 120;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting (basically * 4 the number)
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index]   = chunk[target];
        dupBuffer[index+1] = chunk[target+1];
        dupBuffer[index+2] = chunk[target+2];
      }
    }
  }

  blends.deplace_sin = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height,
        a = options.xspace || 50,
        b = options.yspace || 120;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var mx = 0, my = 0;
        mx += (Math.sin(a) > 0 ? Math.sin(a) * 2 : Math.abs(Math.sin(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting (basically * 4 the number)
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index]   = chunk[target];
        dupBuffer[index+1] = chunk[target+1];
        dupBuffer[index+2] = chunk[target+2];
      }
    }
  }
  blends.deplace_cos = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height,
        a = options.xspace || 50,
        b = options.yspace || 120;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.cos(b) > 0 ? Math.cos(b) * 2 : Math.abs(Math.cos(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting (basically * 4 the number)
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index]   = chunk[target];
        dupBuffer[index+1] = chunk[target+1];
        dupBuffer[index+2] = chunk[target+2];
      }
    }
  }
  blends.deplace_tan = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height,
        a = options.xspace || 50,
        b = options.yspace || 120;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var mx = 0, my = 0;
        mx += (Math.tan(a) > 0 ? Math.tan(a) * 2 : Math.abs(Math.tan(a)) );
        my += (Math.tan(b) > 0 ? Math.tan(b) * 2 : Math.abs(Math.tan(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting (basically * 4 the number)
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index]   = chunk[target];
        dupBuffer[index+1] = chunk[target+1];
        dupBuffer[index+2] = chunk[target+2];
      }
    }
  }

  blends.deplace_atan = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height,
        a = options.xspace || 50,
        b = options.yspace || 120;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var mx = 0, my = 0;
        mx += (Math.atan(a) > 0 ? Math.atan(a) * 2 : Math.abs(Math.atan(a)) );
        my += (Math.atan(b) > 0 ? Math.atan(b) * 2 : Math.abs(Math.atan(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting (basically * 4 the number)
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index]   = chunk[target];
        dupBuffer[index+1] = chunk[target+1];
        dupBuffer[index+2] = chunk[target+2];
      }
    }
  }


  blends.deplace_red = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height,
        a = options.xspace || 50,
        b = options.yspace || 120;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting (basically * 4 the number)
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index]   = (dupBuffer[index]  +  chunk[target]) / 2;
        dupBuffer[index+1] = dupBuffer[index+1];
        dupBuffer[index+2] = dupBuffer[index+2];
      }
    }
  }


  blends.deplace_green = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height,
        a = options.xspace || 50,
        b = options.yspace || 120;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting (basically * 4 the number)
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index]   =  dupBuffer[index];
        dupBuffer[index+1] = (dupBuffer[index+1]  +  chunk[target+1]) / 2;
        dupBuffer[index+2] =  dupBuffer[index+2];
      }
    }
  }

  blends.deplace_blue = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height,
        a = options.xspace || 50,
        b = options.yspace || 120;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting (basically * 4 the number)
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index]   =  dupBuffer[index];
        dupBuffer[index+1] =  dupBuffer[index+1];
        dupBuffer[index+2] = (dupBuffer[index+2]  +  chunk[target+2]) / 2;
      }
    }
  }


  blends.destruct = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }
        // exactly the same as deplace except w with h... :D
        target = shifty * h + shiftx << 2;
        dupBuffer[index] =   chunk[target];
        dupBuffer[index+1] = chunk[target+1];
        dupBuffer[index+2] = chunk[target+2];
      }
    }
  }

  // blends.deplace_from_old_affect_old = function (chunk, dupBuffer, options) { 
  //   var depth = options.threshold || 50;
  //   var w = options.width, h = options.height;
  //   var w1 = w-1, h1 = h - 1;
  //   var index, target;
  //   var x, y,shiftx, shifty;
  //   var a = 50, b = 120;
  //   var mx = 0, my = 0;
  //       mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
  //       my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
  //   for(y = 0; y < h; y++) {
  //     for(x = 0; x < w; x++) {
  //       index = y * w + x << 2; // interesting
  //       shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
  //       shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
  //       // clamp
  //       if(shiftx < 0){
  //           shiftx = 0
  //       } else if(shiftx > w1){
  //           shiftx = w1
  //       }
  //       if(shifty < 0){
  //           shifty = 0
  //       } else if(shifty > h1){
  //           shifty = h1
  //       }
    
  //       target = shifty * w + shiftx << 2;
  //       dupBuffer[index] =   dupBuffer[target];
  //       dupBuffer[index+1] = dupBuffer[target+1];
  //       dupBuffer[index+2] = dupBuffer[target+2];
  //     }
  //   }
  // }
  blends.deplace_from_old_affect_new = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }
        
        target = shifty * w + shiftx << 2;
        dupBuffer[index] =   chunk[target];
        dupBuffer[index+1] = chunk[target+1];
        dupBuffer[index+2] = chunk[target+2];
      }
    }
  }

  // blends.deplace_from_new_affect_old = function (chunk, dupBuffer, options) { 
  //   var depth = options.threshold || 50;
  //   var w = options.width, h = options.height;
  //   var w1 = w-1, h1 = h - 1;
  //   var index, target;
  //   var x, y,shiftx, shifty;
  //   var a = 50, b = 120;
  //   var mx = 0, my = 0;
  //       mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
  //       my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
  //   for(y = 0; y < h; y++) {
  //     for(x = 0; x < w; x++) {
  //       index = y * w + x << 2; // interesting
  //       shiftx = x + chunk[index] / 255 * -mx * depth >> 0;
  //       shifty = y + chunk[index] / 255 * -my * depth >> 0;
  //       // clamp
  //       if(shiftx < 0){
  //           shiftx = 0
  //       } else if(shiftx > w1){
  //           shiftx = w1
  //       }
  //       if(shifty < 0){
  //           shifty = 0
  //       } else if(shifty > h1){
  //           shifty = h1
  //       }

  //       target = shifty * w + shiftx << 2;
  //       dupBuffer[index] =   dupBuffer[target];
  //       dupBuffer[index+1] = dupBuffer[target+1];
  //       dupBuffer[index+2] = dupBuffer[target+2];
  //     }
  //   }
  // }

  // deplace_from_new_blend_old
  blends.deplace_blur_new_old = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + chunk[index] / 255 * -mx * depth >> 0;
        shifty = y + chunk[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }
        
        target = shifty * w + shiftx << 2;
        dupBuffer[index] =   (dupBuffer[target]   + chunk[index]) / 2;
        dupBuffer[index+1] = (dupBuffer[target+1] + chunk[index+1]) / 2;
        dupBuffer[index+2] = (dupBuffer[target+2] + chunk[index+2]) / 2;
      }
    }
  }
  // deplace_from_old_blend_old
  blends.deplace_blur_old_old = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }
      
        target = shifty * w + shiftx << 2;
        dupBuffer[index] =   (dupBuffer[target]   + chunk[index]) / 2;
        dupBuffer[index+1] = (dupBuffer[target+1] + chunk[index+1]) / 2;
        dupBuffer[index+2] = (dupBuffer[target+2] + chunk[index+2]) / 2;
      }
    }
  }


  blends.deplace_from_old_blend_old_bw = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index] =   (dupBuffer[target] + chunk[index]) / 2;
        dupBuffer[index+1] = (dupBuffer[target] + chunk[index]) / 2;
        dupBuffer[index+2] = (dupBuffer[target] + chunk[index]) / 2;
      }
    }
  }


  blends.deplace_from_old_blend_old_mix = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        if (target == index) {
          dupBuffer[index] =   dupBuffer[target+0];
          dupBuffer[index+1] = dupBuffer[target+1];
          dupBuffer[index+2] = dupBuffer[target+2];
          continue;
        }

        
        target = shifty * w + shiftx << 2;
        dupBuffer[index] =   (dupBuffer[target] + chunk[index]) / 2;
        dupBuffer[index+1] = (dupBuffer[target] + chunk[index+1]) / 2;
        dupBuffer[index+2] = (dupBuffer[target] + chunk[index+2]) / 2;
      }
    }
  }


  blends.deplace_from_old_blend_new = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
        shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index] =   (dupBuffer[target] + chunk[index]) / 2;
        dupBuffer[index+1] = (dupBuffer[target+1] + chunk[index+1]) / 2;
        dupBuffer[index+2] = (dupBuffer[target+2] + chunk[index+2]) / 2;
      }
    }
  }




  blends.deplace_from_new_blend_new = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + chunk[index] / 255 * -mx * depth >> 0;
        shifty = y + chunk[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index] =   (dupBuffer[target] + chunk[index]) / 2;
        dupBuffer[index+1] = (dupBuffer[target+1] + chunk[index+1]) / 2;
        dupBuffer[index+2] = (dupBuffer[target+2] + chunk[index+2]) / 2;
      }
    }
  }



  blends.deplace_from_new_blend_new_bw = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + chunk[index] / 255 * -mx * depth >> 0;
        shifty = y + chunk[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index] =   (dupBuffer[target] + chunk[index]) / 2;
        dupBuffer[index+1] = (dupBuffer[target] + chunk[index]) / 2;
        dupBuffer[index+2] = (dupBuffer[target] + chunk[index]) / 2;
      }
    }
  }



  blends.deplace_from_new_blend_new_mix = function (chunk, dupBuffer, options) { 
    var depth = options.threshold || 50;
    var w = options.width, h = options.height;
    var w1 = w-1, h1 = h - 1;
    var index, target;
    var x, y,shiftx, shifty;
    var a = 50, b = 120;
    var mx = 0, my = 0;
        mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
        my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
    for(y = 0; y < h; y++) {
      for(x = 0; x < w; x++) {
        index = y * w + x << 2; // interesting
        shiftx = x + chunk[index] / 255 * -mx * depth >> 0;
        shifty = y + chunk[index] / 255 * -my * depth >> 0;
        // clamp
        if(shiftx < 0){
            shiftx = 0
        } else if(shiftx > w1){
            shiftx = w1
        }
        if(shifty < 0){
            shifty = 0
        } else if(shifty > h1){
            shifty = h1
        }

        target = shifty * w + shiftx << 2;
        dupBuffer[index] =   (dupBuffer[target] + chunk[index]) / 2;
        dupBuffer[index+1] = (dupBuffer[target] + chunk[index+1]) / 2;
        dupBuffer[index+2] = (dupBuffer[target] + chunk[index+2]) / 2;
      }
    }
  }

  blends.triangular = function (chunk, dupBuffer, options) { 
    var width = options.width, height = options.height;
    var half = (width/2); // (width/2)*4
    var halfheight = (height/2); // (height/2)*4
    var step = 0, start, end;
    for (var i = 0; i < height; i++) {
      var middle = ((i * width*4) + (half*4)) - 1; // = (i*width*4) + (half*4);
      if (i < halfheight) {

        start = middle - (i*4); // i*4 for rgba pixels
        end   = middle + (i*4); // i*4 for rgba pixels
          
      } else {

        start =  middle  - ((i*4) - ( 1 +(2*step)*4 ) ); // start - amount over the middle
        end   =  middle  + ((i*4) - ( 1 +(2*step)*4 ) );  // end   - amount over the middle

        step+=1;
      }

      for (var j = 0; j < width; j++) {
        // var index = i * width + j;
        var index = (i*width+j)*4;
        if (index >= start && index <= end) {

          dupBuffer[index + 0] = chunk[index + 0];
          dupBuffer[index + 1] = chunk[index + 1];
          dupBuffer[index + 2] = chunk[index + 2];
          dupBuffer[index + 3] = chunk[index + 3];
            
        } else {

          dupBuffer[index + 0] = dupBuffer[index + 0];
          dupBuffer[index + 1] = dupBuffer[index + 1];
          dupBuffer[index + 2] = dupBuffer[index + 2];
          dupBuffer[index + 3] = dupBuffer[index + 3];          

        }
      }
    }
  }

  blends.triangular_outside = function (chunk, dupBuffer, options) { 
    var width = options.width, height = options.height;
    var half = (width/2); // (width/2)*4
    var halfheight = (height/2); // (height/2)*4
    var step = 0, start, end;
    for (var i = 0; i < height; i++) {
      var middle = ((i * width*4) + (half*4)) - 1; // = (i*width*4) + (half*4);
      if (i < halfheight) {

        start = middle - (i*4); // i*4 for rgba pixels
        end   = middle + (i*4); // i*4 for rgba pixels
          
      } else {

        start =  middle  - ((i*4) - ( 1 +(2*step)*4 ) ); // start - amount over the middle
        end   =  middle  + ((i*4) - ( 1 +(2*step)*4 ) );  // end   - amount over the middle

          step+=1;
        }

      for (var j = 0; j < width; j++) {
        // var index = i * width + j;
        var index = (i*width+j)*4;
        if (index >= start && index <= end) {
          
          dupBuffer[index + 0] = dupBuffer[index + 0];
          dupBuffer[index + 1] = dupBuffer[index + 1];
          dupBuffer[index + 2] = dupBuffer[index + 2];
          dupBuffer[index + 3] = dupBuffer[index + 3];
            
        } else {
          
          dupBuffer[index + 0] = chunk[index + 0];
          dupBuffer[index + 1] = chunk[index + 1];
          dupBuffer[index + 2] = chunk[index + 2];
          dupBuffer[index + 3] = chunk[index + 3];

        }
      }
    }
  }

  blends.horizontal_drift = function (chunk, dupBuffer, options) { 
    var x = options.width, y = options.height;
    var threshold = options.threshold || 50;

    var mode = colorObjectFromColorString(options.color);
        mode.swap = false; 

    // LOOSE
    function checkValues (color, toggle) {

      if ( color.r >=  (toggle.r - threshold) && color.r <= (toggle.r + threshold) ) {
        toggle.swap = !toggle.swap;
        return 1; 
      }
      if ( color.g >=  (toggle.g - threshold) && color.g <= (toggle.g + threshold) ) {
        toggle.swap = !toggle.swap;
        return 1;
      }
      if ( color.b >=  (toggle.b - threshold) && color.b <= (toggle.b + threshold) ) {
        toggle.swap = !toggle.swap;
        return 1;
      }
      if (toggle.swap === true) {
        // toggle.swap = false;
        return -1
      }
      return 0;
    }


    for (var i = 0; i < x; i++) {

      var tPositions = []; 
      var holdColor = {};
      var color = {};

      for (var j = 0; j < y; j++) {
          
          var index = (i*y*4) + (j*4);
          // Sort pixels into their own arrays, 
          // doing it by line makes the function faster 
          var curColor = {
            r : dupBuffer[index + 0], 
            g : dupBuffer[index + 1], 
            b : dupBuffer[index + 2]  
          }

          tPositions[j] = checkValues( curColor, mode );


      }

      color     = {r: 0, g: 0, b: 0};
      holdColor = {r: 0, g: 0, b: 0};
      for (var j = 0; j < y; j++) {

        var index = (i*y*4) + (j*4);
        var chooser = tPositions[j];
        switch (chooser) {
          case  1 : 
            holdColor.r = chunk[index + 0]; 
              color.r = holdColor.r; 
            holdColor.g = chunk[index + 1];
              color.g = holdColor.g; 
            holdColor.b = chunk[index + 2];
              color.b = holdColor.b; 
            break;
          case  -1 :
            color.r = chunk[index + 0]; 
            color.g = chunk[index + 1]; 
            color.b = chunk[index + 2]; 
            break;
          case  0 :
            color.r = dupBuffer[index + 0]
            color.g = dupBuffer[index + 1]
            color.b = dupBuffer[index + 2]
            // skip
            break;
        }
        if ( j % y !== 0 ) {
          dupBuffer[index + 0] = color.r;
          dupBuffer[index + 1] = color.g;
          dupBuffer[index + 2] = color.b;
          dupBuffer[index + 3] = 255;
        } else {
          dupBuffer[index + 0] = dupBuffer[index + 0];
          dupBuffer[index + 1] = dupBuffer[index + 1];
          dupBuffer[index + 2] = dupBuffer[index + 2];
          dupBuffer[index + 3] = 255;
        } 
      }
    }
  }

  blends.vertical_drift = function (chunk, dupBuffer, options) { 
    var x = options.width, y = options.height;
    var threshold = options.threshold || 50;
    // toggles the dirft mode
    var mode = colorObjectFromColorString(options.color);
        mode.swap = false; 

    // LOOSE
    function checkValues (color, toggle) {

      if ( color.r >=  (toggle.r - threshold) && color.r <= (toggle.r + threshold) ) {
        toggle.swap = !toggle.swap;
        return 1; 
      }
      if ( color.g >=  (toggle.g - threshold) && color.g <= (toggle.g + threshold) ) {
        toggle.swap = !toggle.swap;
        return 1;
      }
      if ( color.b >=  (toggle.b - threshold) && color.b <= (toggle.b + threshold) ) {
        toggle.swap = !toggle.swap;
        return 1;
      }
      if (toggle.swap === true) {
        // toggle.swap = false;
        return -1
      }
      return 0;
    }


    for (var i = 0; i < x; i++) {
      var tPositions = []; 
      var holdColor = {};
      var color = {};
      // var holdColor = { r:255,g:255,b:255 };
      for (var j = 0; j < y; j++) {   
        var index = (j*x*4) + (i*4);
        // Sort pixels into their own arrays, 
        // doing it by line makes the function faster 
        var curColor = {
          r : dupBuffer[index + 0], 
          g : dupBuffer[index + 1], 
          b : dupBuffer[index + 2]  
        }
        tPositions[j] = checkValues( curColor, mode );
      }

      for (var j = 0; j < y; j++) {
        var index = (j*x*4) + (i*4);
        var chooser = tPositions[j];
        switch (chooser) {
          case  1 : 
            holdColor.r = chunk[index + 0]; 
              color.r = holdColor.r; 
            holdColor.g = chunk[index + 1];
              color.g = holdColor.g; 
            holdColor.b = chunk[index + 2];
              color.b = holdColor.b; 
            break;
          case  -1 :
            color.r = chunk[index + 0]; 
            color.g = chunk[index + 1]; 
            color.b = chunk[index + 2]; 
            break;
          case  0 :
            color.r = dupBuffer[index + 0]
            color.g = dupBuffer[index + 1]
            color.b = dupBuffer[index + 2]
            // skip
            break;
        }
        if ( j % y !== 0 ) {
          dupBuffer[index + 0] = color.r;
          dupBuffer[index + 1] = color.g;
          dupBuffer[index + 2] = color.b;
          dupBuffer[index + 3] = 255;
        } else {
          dupBuffer[index + 0] = dupBuffer[index + 0];
          dupBuffer[index + 1] = dupBuffer[index + 1];
          dupBuffer[index + 2] = dupBuffer[index + 2];
          dupBuffer[index + 3] = 255;
        } 
      }
    }
  }




  return blends;

}

// blends.generic = function (chunk, dupBuffer, options) { }
// blends.generic = function (chunk, dupBuffer, options) { }
// blends.generic = function (chunk, dupBuffer, options) { }
 

 /*  
    case 'rutt_ettra_ud':
      var h = options.size.height, w = options.size.width;
      options.draw = options.draw || { xspace: 10, yspace:1, weight: 5, stroke: 5 };
      var xspace = options.draw.xspace, yspace = options.draw.yspace;
      var zoom = options.draw.stroke, weight = options.draw.weight;
      var depth = options.gamma || 0.9;
      var zoom = 100;
      var x, y;
      var data = new Uint32Array(dupBuffer.buffer)
      var clone = new Uint32Array(chunk.buffer);
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y; // change to w if need be
          var col = data[index];
          // draw
          for (i = 0; i < weight; i++) {
            var step =  index + (w * i);
            step = parseInt(step*depth, 10);
            clone[step] = col;
          }
        }
      }
      break;
    case 'rutt_etra_lr':
      var h = options.size.height, w = options.size.width;
      options.draw = options.draw || { xspace: 10, yspace:1, weight: 5, stroke: 5 };
      var xspace = options.draw.xspace, yspace = options.draw.yspace;
      var zoom = options.draw.stroke, weight = options.draw.weight;
      var depth = options.gamma || 0.9;
      var zoom = 100;
      var x, y;
      var data = new Uint32Array(dupBuffer.buffer)
      var clone = new Uint32Array(chunk.buffer);
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = y * h +x; // change to w if need be
          var col = data[index];
          // draw
          for (i = 0; i < weight; i++) {
            var step =  index + (h * i);
            step = parseInt(step*depth, 10);
            clone[step] = col;
          }
        }
      }
      break;
      case 'horizontaldrift' : 
        var gamma = options.gamma || 1;
        var x,y;
        var threshold = options.threshold || 50;
            options.direction = 'thithings';
            options.values = options.values || 'white';
        if (options.direction === 'horizontal') {
          var x = options.size.height, y = options.size.width;
        } else {
          var x = options.size.width, y = options.size.height;
        }
        var comparer = {
         white :  {r:200,g:200,b:200},
         black :  {r:50,g:50,b:50},
         grey  :  {r:150,g:150,b:150}
        }
        // toggles the dirft mode
        var mode = comparer[ options.values ];
            mode.swap = false; 

        // LOOSE
        function checkValues (color, toggle) {

          if ( color.r >=  (toggle.r - threshold) && color.r <= (toggle.r + threshold) ) {
            toggle.swap = !toggle.swap;
            return 1; 
          }
          if ( color.g >=  (toggle.g - threshold) && color.g <= (toggle.g + threshold) ) {
            toggle.swap = !toggle.swap;
            return 1;
          }
          if ( color.b >=  (toggle.b - threshold) && color.b <= (toggle.b + threshold) ) {
            toggle.swap = !toggle.swap;
            return 1;
          }
          if (toggle.swap === true) {
            // toggle.swap = false;
            return -1
          }
          return 0;
        }


        for (var i = 0; i < x; i++) {

          var tPositions = []; 
          var holdColor = {};
          var color = {};
          // var holdColor = { r:255,g:255,b:255 };

          for (var j = 0; j < y; j++) {
              
              var index = (i*y*4) + (j*4);
              // Sort pixels into their own arrays, 
              // doing it by line makes the function faster 
              var curColor = {
                r : chunk[index + 0], 
                g : chunk[index + 1], 
                b : chunk[index + 2]  
              }

              tPositions[j] = checkValues( curColor, mode );


          }
          color     = {r: 0, g: 0, b: 0};
          holdColor = {r: 0, g: 0, b: 0};
          for (var j = 0; j < y; j++) {

            var index = (i*y*4) + (j*4);
            var chooser = tPositions[j];
            switch (chooser) {
              case  1 : 
                holdColor.r = dupBuffer[index + 0]; 
                  color.r = holdColor.r; 
                holdColor.g = dupBuffer[index + 1];
                  color.g = holdColor.g; 
                holdColor.b = dupBuffer[index + 2];
                  color.b = holdColor.b; 
                break;
              case  -1 :
                color.r = holdColor.r
                color.g = holdColor.g
                color.b = holdColor.b
                break;
              case  0 :
                color.r = chunk[index + 0]
                color.g = chunk[index + 1]
                color.b = chunk[index + 2]
                // skip
                break;
            }
            if ( j % y !== 0 ) {
              chunk[index + 0] = color.r;
              chunk[index + 1] = color.g;
              chunk[index + 2] = color.b;
              chunk[index + 3] = 255;
            } else {
              chunk[index + 0] = chunk[index + 0];
              chunk[index + 1] = chunk[index + 1];
              chunk[index + 2] = chunk[index + 2];
              chunk[index + 3] = 255;
            } 
        }
      };
      break;
    case 'verticaldrift' : 
        var gamma = options.gamma || 1;
        var x,y;
        var threshold = options.threshold || 50;
            options.direction = 'vertical';
            options.values = options.values || 'white';
        if (options.direction === 'horizontal') {
          var x = options.size.height, y = options.size.width;
        } else {
          var x = options.size.width, y = options.size.height;
        }
        var comparer = {
         white :  {r:200,g:200,b:200},
         black :  {r:50,g:50,b:50},
         grey  :  {r:150,g:150,b:150}
        }
        // toggles the dirft mode
        var mode = comparer[ options.values ];
            mode.swap = false; 

        // LOOSE
        function checkValues (color, toggle) {

          if ( color.r >=  (toggle.r - threshold) && color.r <= (toggle.r + threshold) ) {
            toggle.swap = !toggle.swap;
            return 1; 
          }
          if ( color.g >=  (toggle.g - threshold) && color.g <= (toggle.g + threshold) ) {
            toggle.swap = !toggle.swap;
            return 1;
          }
          if ( color.b >=  (toggle.b - threshold) && color.b <= (toggle.b + threshold) ) {
            toggle.swap = !toggle.swap;
            return 1;
          }
          if (toggle.swap === true) {
            // toggle.swap = false;
            return -1
          }
          return 0;
        }


        for (var i = 0; i < x; i++) {

          var tPositions = []; 
          var holdColor = {};
          var color = {};
          // var holdColor = { r:255,g:255,b:255 };

          for (var j = 0; j < y; j++) {
              
              var index = (j*x*4) + (i*4);
              // Sort pixels into their own arrays, 
              // doing it by line makes the function faster 
              var curColor = {
                r : chunk[index + 0], 
                g : chunk[index + 1], 
                b : chunk[index + 2]  
              }

              tPositions[j] = checkValues( curColor, mode );


          }

          for (var j = 0; j < y; j++) {

            var index = (j*x*4) + (i*4);
            var chooser = tPositions[j];
            switch (chooser) {
              case  1 : 
                holdColor.r = dupBuffer[index + 0]; 
                  color.r = holdColor.r; 
                holdColor.g = dupBuffer[index + 1];
                  color.g = holdColor.g; 
                holdColor.b = dupBuffer[index + 2];
                  color.b = holdColor.b; 
                break;
              case  -1 :
                color.r = holdColor.r
                color.g = holdColor.g
                color.b = holdColor.b
                break;
              case  0 :
                color.r = chunk[index + 0]
                color.g = chunk[index + 1]
                color.b = chunk[index + 2]
                // skip
                break;
            }
            if ( j % y !== 0 ) {
              chunk[index + 0] = color.r;
              chunk[index + 1] = color.g;
              chunk[index + 2] = color.b;
              chunk[index + 3] = 255;
            } else {
              chunk[index + 0] = chunk[index + 0];
              chunk[index + 1] = chunk[index + 1];
              chunk[index + 2] = chunk[index + 2];
              chunk[index + 3] = 255;
            } 
          }
      };
      break;
    case 'displace' :
      var depth = options.threshold || 50;
      var w = options.size.width, h = options.size.height;
      var w1 = w-1, h1 = h - 1;
      var index, target;
      var x, y,shiftx, shifty;
      var a = 50; b = 120;
      var mx = 0, my = 0;
          mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
          my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
      for(y = 0; y < h; y++) {
        for(x = 0; x < w; x++) {
          index = y * w + x << 2; // interesting
          shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
          shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
          // clamp
          if(shiftx < 0){
              shiftx = 0
          } else if(shiftx > w1){
              shiftx = w1
          }
          if(shifty < 0){
              shifty = 0
          } else if(shifty > h1){
              shifty = h1
          }

          target = shifty * w + shiftx << 2;
          chunk[index]   = dupBuffer[target];
          chunk[index+1] = dupBuffer[target+1];
          chunk[index+2] = dupBuffer[target+2];
        }
      }
      break;
    case 'distruct' :
      var depth = options.threshold || 50;
      var w = options.size.width, h = options.size.height;
      var w1 = w-1, h1 = h - 1;
      var index, target;
      var x, y,shiftx, shifty;
      var a = 50; b = 120;
      var mx = 0, my = 0;
          mx += (Math.cos(a) > 0 ? Math.cos(a) * 2 : Math.abs(Math.cos(a)) );
          my += (Math.sin(b) > 0 ? Math.sin(b) * 2 : Math.abs(Math.sin(b)) );
      for(y = 0; y < h; y++) {
        for(x = 0; x < w; x++) {
          index = y * w + x << 2; // interesting
          shiftx = x + dupBuffer[index] / 255 * -mx * depth >> 0;
          shifty = y + dupBuffer[index] / 255 * -my * depth >> 0;
          // clamp
          if(shiftx < 0){
              shiftx = 0
          } else if(shiftx > w1){
              shiftx = w1
          }
          if(shifty < 0){
              shifty = 0
          } else if(shifty > h1){
              shifty = h1
          }

          target = shifty * h + shiftx << 2;
          chunk[index] =   dupBuffer[target];
          chunk[index+1] = dupBuffer[target+1];
          chunk[index+2] = dupBuffer[target+2];
        }
      }
      break;
    case 'smosh-mix' :
      var h = options.size.height, w = options.size.width;
      for( var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
          var index = (i*w*4) + (j*4);
          var rgb = {r: chunk[index], g: chunk[index+1], b: chunk[index+2]};
          var colorvalue = rgb.r + rgb.b + rgb.b;
          
          if (j % (w-1) === 0 ) {
            chunk[index+0] = dupBuffer[index+0]
            chunk[index+1] = dupBuffer[index+1]
            chunk[index+2] = dupBuffer[index+2]
            chunk[index+3] = 255;
            continue;
          }
          if (colorvalue > 100) {
            chunk[index+0] = dupBuffer[index - (19*4)+1] || chunk[index];
            chunk[index+1] = dupBuffer[index + (20*4)+2] || chunk[index+1];
            chunk[index+2] = dupBuffer[index - (4 *4)+0] || chunk[index+2];
            chunk[index+3] = 255; 
          } else if (colorvalue > 50){
            chunk[index+0] = chunk[index - (13*4)+2] || dupBuffer[index]; 
            chunk[index+1] = chunk[index + (15*4)+0] || dupBuffer[index+1];
            chunk[index+2] = chunk[index + (4 *4)+1] || dupBuffer[index+2];
            chunk[index+3] = 255; 
          } else {
            chunk[index+0] = dupBuffer[index + (7*4)+2]   || chunk[index]
            chunk[index+1] = dupBuffer[index + (4*4)+0]   || chunk[index+1]
            chunk[index+2] = dupBuffer[index - (10 *4)+1] || chunk[index+2]
            chunk[index+3] = 255; 
          }
        }
      }
      break;
    case 'pretty-color' :
      var h = options.size.height, w = options.size.width;
      for( var i = 0, l = chunk.length; i < l; i+=4) {
        var r = dupBuffer[i+0],
            g = dupBuffer[i+1],
            b = dupBuffer[i+2],
            tmp;
       if ( r > g && r > b ) { // R is larger
        tmp = g;
          g = b;
          b = tmp;
       }
       if (g > r && g > b) { // G is larger
        tmp = r;
          r = b;
          b = tmp;
       }

       if (b > r && b > g) { // B is larger
        tmp = g;
          g = r;
          r = tmp;
       }
       chunk[i + 0] = r;
       chunk[i + 1] = g;
       chunk[i + 2] = b;
      } 
      break;
    case 'zoomth_light_blend':
      // var extraBuffer = new ArrayBuffer(Uint8ClampedArray.BYTES_PER_ELEMENT * chunk.length);
      // var comparator = new Uint8ClampedArray(chunk);
      for (var x=0,x1=1,h = options.size.height, h1 = options.size.height-1; x1 < h1; x++, x1++) {
        for (var y=0,y1=1,w = options.size.width, w1 = options.size.width-1; y1 < w1; y++, y1++) {
          // starting at 1,1
          var index = (x1*w+y1)*4; 
          // movement kernel
          var sl = 9;
          var side = 3;
          var halfside = 1;
          // var m = [
          //   index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          //   index-4, index, index+4,
          //   index+((w*4) -4), index+ (w*4), index+(w*4) + 4
          // ];
          // var ml = m.length;
          var avgRed = 0, avgBlue = 0, avgGreen = 0;
          for (var dx = 0; dx < side; ++dx) {
            for (var dy = 0; dy < side; ++dy) {
              var sIndex = (x+dx) * w + (y+dy);
              avgRed +=   chunk[ sIndex + 0 ] - dupBuffer[ sIndex + 0];
              avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
              avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
            }
          }
          chunk[index+0] = chunk[index+0] + Math.round(avgRed   / sl);
          chunk[index+1] = chunk[index+1] + Math.round(avgBlue  / sl);
          chunk[index+2] = chunk[index+2] + Math.round(avgGreen / sl);
        }
      }
      break;
    case 'zoomth_dark_blend':
      // var extraBuffer = new ArrayBuffer(Uint8ClampedArray.BYTES_PER_ELEMENT * chunk.length);
      // var comparator = new Uint8ClampedArray(chunk);
      for (var x=0,x1=1,h = options.size.height, h1 = options.size.height-1; x1 < h1; x++, x1++) {
        for (var y=0,y1=1,w = options.size.width, w1 = options.size.width-1; y1 < w1; y++, y1++) {
          // starting at 1,1
          var index = (x1*w+y1)*4; 
          // movement kernel
          var sl = 9;
          var side = 3;
          var halfside = 1;
          // var m = [
          //   index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          //   index-4, index, index+4,
          //   index+((w*4) -4), index+ (w*4), index+(w*4) + 4
          // ];
          // var ml = m.length;
          var avgRed = 0, avgBlue = 0, avgGreen = 0;
          for (var dx = 0; dx < side; ++dx) {
            for (var dy = 0; dy < side; ++dy) {
              var sIndex = (x+dx) * w + (y+dy);
              avgRed +=   chunk[ sIndex + 0 ] - dupBuffer[ sIndex + 0];
              avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
              avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
            }
          }
          chunk[index+0] = chunk[index+0] - Math.round(avgRed   / sl);
          chunk[index+1] = chunk[index+1] - Math.round(avgBlue  / sl);
          chunk[index+2] = chunk[index+2] - Math.round(avgGreen / sl);
        }
      }
      break;
    case 'sample-poisson-add-kernel':
      // var extraBuffer = new ArrayBuffer(Uint8ClampedArray.BYTES_PER_ELEMENT * chunk.length);
      // var comparator = new Uint8ClampedArray(chunk);
      for (var x=0,x1=1,h = options.size.height, h1 = options.size.height-1; x1 < h1; x++, x1++) {
        for (var y=0,y1=1,w = options.size.width, w1 = options.size.width-1; y1 < w1; y++, y1++) {
          // starting at 1,1
          var index = (x1*w+y1)*4; 
          // movement kernel
          if (x < 0) dx = 0;
          if (x >= w) dx = w-1; 
          var sl = 9;
          var side = 3;
          var halfside = 1;
          // var m = [
          //   index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          //   index-4, index, index+4,
          //   index+((w*4) -4), index+ (w*4), index+(w*4) + 4
          // ];
          // var ml = m.length;

          



          var avgRed = 0, avgBlue = 0, avgGreen = 0;
          for (var dx = 0; dx < side; ++dx) {
            for (var dy = 0; dy < side; ++dy) {
              var sIndex = ((x+dx) * w + (y+dy)) * 4;
              avgRed +=   chunk[ sIndex + 0 ] - dupBuffer[ sIndex + 0];
              avgBlue +=  chunk[ sIndex + 1 ] - dupBuffer[ sIndex + 1];
              avgGreen += chunk[ sIndex + 2 ] - dupBuffer[ sIndex + 2];      
            }
          }
          chunk[index+0] = dupBuffer[index+0] + Math.round(avgRed   / sl);
          chunk[index+1] = dupBuffer[index+1] + Math.round(avgBlue  / sl);
          chunk[index+2] = dupBuffer[index+2] + Math.round(avgGreen / sl);
        }
      }
      break;
    case 'dark_blend':
      // var extraBuffer = new ArrayBuffer(Uint8ClampedArray.BYTES_PER_ELEMENT * chunk.length);
      // var comparator = new Uint8ClampedArray(chunk);
      for (var x=0,x1=1,h = options.size.height, h1 = options.size.height-1; x1 < h1; x++, x1++) {
        for (var y=0,y1=1,w = options.size.width, w1 = options.size.width-1; y1 < w1; y++, y1++) {
          // starting at 1,1
          var index = (x1*w+y1)*4; 
          // movement kernel
          var sl = 9;
          var side = 3;
          var halfside = 1;
          // var m = [
          //   index-((w*4) + 4), index-(w*4), index-(w*4) + 4,
          //   index-4, index, index+4,
          //   index+((w*4) -4), index+ (w*4), index+(w*4) + 4
          // ];
          // var ml = m.length;
          var avgRed = 0, avgBlue = 0, avgGreen = 0;
          // var sx = x - halfside;
          // var sy = y - halfside;
          for (var dx = 0; dx < side; ++dx) {
            for (var dy = 0; dy < side; ++dy) {
              var sIndex = (x+dx) * w + (y+dy);
              avgRed +=    dupBuffer[ sIndex + 0];
              avgBlue +=   dupBuffer[ sIndex + 1];
              avgGreen +=  dupBuffer[ sIndex + 2];      
            }
          }
          chunk[index+0] = dupBuffer[index+0] - Math.round(avgRed   / sl);
          chunk[index+1] = dupBuffer[index+1] - Math.round(avgBlue  / sl);
          chunk[index+2] = dupBuffer[index+2] - Math.round(avgGreen / sl);
        }
      }
      break;
    
}

*/



