
function effectsCode() {



  "use strict";


  function isLSB() {
      var b = new Uint8Array([255, 0]);
      return ((new Uint16Array(b, b.buffer))[0] === 255);
  }


  function extractColorOption(color) {
    var cols = [];
    if (isLSB()) {   
      cols.push(parseInt(color.slice(4,6), 16));
      cols.push(parseInt(color.slice(2,4), 16));
      cols.push(parseInt(color.slice(0,2), 16));
    } else {
      cols.push(color.slice(0,2));
      cols.push(color.slice(2,4));
      cols.push(color.slice(4,6));
    }

    return cols;
  }

  function extractColorObject(color) {
    var obj = {};
    if (isLSB()) {
      obj.r = parseInt(color.slice(4,6), 16);
      obj.g = parseInt(color.slice(2,4), 16);
      obj.b = parseInt(color.slice(0,2), 16);
    } else {
      obj.r = parseInt(color.slice(0,2), 16);
      obj.b = parseInt(color.slice(2,4), 16);
      obj.g = parseInt(color.slice(4,6), 16);
    }
    return obj;
  }

  function colorObjectFromColorString(color) {
    var obj = {};
    obj.r = parseInt(color.slice(4,6), 16);
    obj.g = parseInt(color.slice(2,4), 16);
    obj.b = parseInt(color.slice(0,2), 16); 
    return obj;
  }


  function makeSteps(val) {
    var step = (val / 100) * 0.1;
  }



  function findRadius (x,y,cx,cy) {
    return Math.sqrt( Math.pow(x-cx,2) + Math.pow(y-cy,2) );
  }

  function findSquareArea (w,h) {
    return w * h;
  }

  function findCircleArea (r) {
    return Math.PI * Math.pow(r, 2);
  }


  function findCircleInSquare (w,h,r) {
    return (findTotalArea(w, h) / 4) - (findArea(r)/ 4)
  }



  function riseOverRun (x,y) {
    return x/y;
  }

  function ratioOfASide () {

  }


  function clampOverflow(integer) {
    return integer % 255; 
  }


  function absdetail (array) {

    var cache = [];

    if (array.length < 3) {
      return array;
    }
    if (array[0] < array[1] && array[0] < array[2]) {
      cache[0] = array[0];
      cache[1] = array[0];
      cache[2] = array[0];
      cache[3] = 0xFF;
    } else if (array[1] < array[0] && array[1] < array[2]) {
      cache[0] = array[1];
      cache[1] = array[1];
      cache[2] = array[1];
      cache[3] = 0xFF;
    } else if (array[2] < array[0] && array[2] < array[1]) {
      cache[0] = array[2];
      cache[1] = array[2];
      cache[2] = array[2];
      cache[3] = 0xFF;   
    }

    return cache;
    
  }


  // Sleep-effect
  function setAtThreshhold (value) {
    if (value > 255) {
      if (value > 600) {
        // console.log(255)
        return 255;
      }
      if (value > 500) {
        // console.log(225)
        return 225;
      }
      if (value > 400) {
        // console.log(200)
        return 200;
      }
      // console.log(150)
      return 150;
    }
    // console.log(value)
    return value;
  }


  // Bryce Barill's method: https://www.youtube.com/watch?v=-MCnBvDSoB0
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


  function Potion (init) {
    this.type = init.type;
    this._refill = init.refill;
    this._amount = init.amount;

  }

  Potion.prototype.drink = function() {
    console.log('Drinking..', this.type, this._amount);
    return this._amount;
  }

  function Voija () {
    this.chain = [];
    this.oldChain = [];
    this._ether = 100000;

    Object.defineProperty(this, 'ether', {
      get: function() {
        this._ether = this._ether - 1;
        return this._ether;
      },
      set: function (value) {
        this._ether = this._ether + value;
      }
    })

  }

  Voija.prototype.sear = function (val) {
    var newval = {r:0,g:0,b:0};

    // if (this.ether >= 0  ) {
      var red = [
      [0, 15, 50],
      [1, 45, 90],
      [2, 95, 120],
      [3, 125, 190],
      [4, 165, 205],
      [5, 215, 215],
      [6, 256, 250]
      ];
      var green = [
      [0, 14, 36],
      [1, 56, 75],
      [2, 85, 154],
      [3, 119, 174],
      [4, 171, 196],
      [5, 215, 245],
      [6, 256, 230]
      ];
      var blue = [
      [5, 0, 14],
      [5, 42, 78],
      [5, 114, 152],
      [5, 151, 172],
      [5, 176, 194],
      [5, 215, 210],
      [6, 256, 220]
      ];

      var n = 0;
      while ( red[n][1] < val.r ) {
        // console.log(red[n][1], val.r);
        n++;
      }
      newval.r = red[n][2];
      newval.g = val.g + green[n][2] / 2;
      newval.b = val.b + blue[n][2]  / 2;

      return newval;
    // } else  {
      // return val;
    // }
  }



  Voija.prototype.freeze = function (val) {
    var newval = {r:0,g:0,b:0};

    // if (this.ether >= 0  ) {
      var red = 
      [
      [5, 0, 14],
      [5, 42, 58],
      [5, 114, 92],
      [5, 151, 132],
      [5, 176, 174],
      [5, 215, 190],
      [6, 256, 210]
      ];
      var green = 
      [
      [0, 14, 36],
      [1, 56, 75],
      [2, 85, 154],
      [3, 119, 174],
      [4, 171, 196],
      [5, 215, 215],
      [6, 256, 220]
      ];
      var blue = 
      [
      [0, 15, 50],
      [1, 45, 90],
      [2, 95, 120],
      [3, 125, 190],
      [4, 165, 205],
      [5, 215, 235],
      [6, 256, 250]
      ];

      var n = 0;
      while ( red[n][1] < val.r ) {
        // console.log(red[n][1], val.r);
        n++;
      }
      newval.r = red[n][2];
      newval.g = val.g + green[n][2] / 2;
      newval.b = val.b + blue[n][2]  / 2;

      return newval;
    // } else  {
      // return val;
    // }
  }



  Voija.prototype.froze = function (val) {
  var newval = {r:0,g:0,b:0};

  // if (this.ether >= 0  ) {
    var red = 
    [
    [5, 0, 14],
    [5, 42, 58],
    [5, 114, 92],
    [5, 151, 132],
    [5, 176, 174],
    [5, 215, 190],
    [6, 256, 210]
    ];
    var green = 
    [
    [0, 14, 36],
    [1, 56, 75],
    [2, 85, 154],
    [3, 119, 174],
    [4, 171, 196],
    [5, 215, 215],
    [6, 256, 220]
    ];
    var blue = 
    [
    [0, 15, 50],
    [1, 45, 90],
    [2, 95, 120],
    [3, 125, 190],
    [4, 165, 205],
    [5, 215, 235],
    [6, 256, 250]
    ];

    var n = 0;
    while ( red[n][1] < val.r ) {
      // console.log(red[n][1], val.r);
      n++;
    }
    newval.r = val.r & red[n][2];
    newval.g = val.g & green[n][2];
    newval.b = blue[n][2];

    return newval;
  // } else  {
    // return val;
  // }
  }



  Voija.prototype.soar = function(val) {
    var newval = {r:0,g:0,b:0};

    // if (this.ether >= 0  ) {
      var red = [
      [0, 15, 50],
      [1, 45, 90],
      [2, 95, 120],
      [3, 125, 190],
      [4, 165, 205],
      [5, 215, 215],
      [6, 256, 250]
      ];
      var green = [
      [0, 14, 36],
      [1, 56, 75],
      [2, 85, 154],
      [3, 119, 174],
      [4, 171, 196],
      [5, 215, 245],
      [6, 256, 230]
      ];
      var blue = [
      [5, 0, 14],
      [5, 42, 78],
      [5, 114, 152],
      [5, 151, 172],
      [5, 176, 194],
      [5, 215, 210],
      [6, 256, 220]
      ];

      var n = 0;
      while ( red[n][1] < val.r ) {
        // console.log(red[n][1], val.r);
        n++;
      }
      newval.r = val.r & red[n][2];
      newval.g = val.g & green[n][2];
      newval.b = val.b & blue[n][2];

      return newval;
    // } else  {
      // return val;
    // }
  }

  Voija.prototype.spin = function () {
    if (this._ether > 10 && this.oldChain.length > 0) {
      this._ether--;
      return this.oldChain.shift();  
    } else {
      return -1;
    }
  }

  Voija.prototype.etherPot = function (potion) {
    if (potion.type === 'ether'){
      this._ether +=  potion.drink();
      
    }
  }

  Voija.prototype.chagrox = function (sampleSize, chunk ,x, y) {
    this._ether = sampleSize * sampleSize;
    var sampleSize = sampleSize || 10;
    var x = x || 0, y = y || 0;
    var cache = [];

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
  }










  var effects = {};
  effects.noop = function () {};

  /*
  effects.clickme = function () {
      // You still have access to the window methods 
      // and the DOM from inside each effect
    alert('I dont do a damn thing!');
  };
  */

  effects.copy = function (chunk, dupBuffer, opts) {
    for (var i = 0, l = chunk.length; i < l; ++i) {
      dupBuffer[i] = chunk[i];
      
    }
  }


  effects.ghettoize = function (chunk, dupBuffer, opts, paramsArray) {

        // type: sleep;
    var x,y;
    var threshold = parseInt(opts.threshold) || 50;
    var paramsArray = paramsArray || chunk;
    opts.values = opts.values || 'white';
    var x = opts.height, y = opts.width;


    var pixels = chunk;
    var shift = (y / 50 >>> 0) % 4 > 0 ? (y / 50 >>> 0) - ((y / 50 >>> 0) % 4) : (y / 50 >>> 0);
    // var meanPixels = modifiedMeanPixel(chunk);
    var black       = {r: 6,  g: 2,  b:0},
        blue        = {r: 20, g: 30, b:184},
        magentaPink = {r:252, g:165, b:243},
        yellow      = {r:230, g:213, b:67},
        cyan        = {r:0  , g:250, b:249},
        white       = {r:250, g:245, b:250},
        magentaPink = {r:252, g:165, b:243},
        lipstickRed = {r:193, g:0,   b:67};

    var dressHighs  = {r: 122, g:199, b: 123 },
        dressLows   = {r: 19 , g:18 , b: 20  },
        hairHighs   = {r: 93 , g:91 , b: 95  },
        hairLows    = {r: 11 , g:13 , b: 16  },
        lipsHighs   = {r: 238, g:151, b:143 },
        lipsLows    = {r: 207, g:107, b:102 },
        skinHighs   = {r: 254, g:225, b:200 },
        skinLows    = {r: 123, g:77,  b:55  },
        bgHighs     = {r: 255, g:254, b:255 },
        bgLows      = {r: 200, g:199, b:200 },
        shadowHighs = {r: 175, g:185, b:177 },
        shadowLows  = {r: 93 , g:91 , b:93  },
        teethHighs  = {r: 253, g:255, b:250 },
        teethLows   = {r: 184, g:172, b:165 };

    var lips = { r: 214, g:135, b:123 };
    var hair = { r: 50,  g:46,  b:54};
    // var skin = { }


    // isHair(color){
    //   if (color.r - 4 >= color.g && color.g + 8 >= color.r)
    // }

    function isInColorRange(currentColor, highs, lows) {
     if (currentColor.r       >= lows.r && currentColor.r <= highs.r) {
        if (currentColor.g    >= lows.g && currentColor.g <= highs.g) {
           if (currentColor.b >= lows.b && currentColor.b <= highs.b) {
             return true;
           }
        }
     }
     return false;
    }

    for (var i = 0; i < x; i++) {

        for (var j = 0; j < y; j++) {
            
          var index = (i*y*4) + (j*4);

          var curColor = {
            r : paramsArray[index + 0], 
            g : paramsArray[index + 1], 
            b : paramsArray[index + 2]  
          }
          
          var combinedColorValue = curColor.r + curColor.g + curColor.b;
          var finalColor = {};
          
          switch (true) {
            case (curColor.r - 4 >= curColor.g && curColor.g + 8 >= curColor.r) :
              finalColor = yellow;
            break;
            case isInColorRange(curColor, bgHighs, bgLows ) : // This is the background
              finalColor = cyan;
              break;
            case isInColorRange(curColor, skinHighs, skinLows) : // This is the skin
              if (isInColorRange(curColor, lipsHighs, lipsLows)) {
                finalColor = lipstickRed;
              } else {

                finalColor.r = ((magentaPink.r + pixels[index+0]) / 2 >>> 0) - 15;
                finalColor.g = ((magentaPink.b + pixels[index+1]) / 2 >>> 0) - 15;
                finalColor.b = ((magentaPink.g + pixels[index+2]) / 2 >>> 0) - 15;
              }
              break;
            // case isInColorRange(curColor, dressHighs, dressLows) : // This is the dress
            //   finalColor = isInColorRange(hair) ?  yellow;
            //   break;
            case isInColorRange(curColor, hairHighs, hairLows) : // This is the hair
              if (isInColorRange(curColor, dressHighs, dressLows)) {
                finalColor.r = ((yellow.r + pixels[index+0]) / 2 >>> 0) - 15;
                finalColor.g = ((yellow.b + pixels[index+1]) / 2 >>> 0) - 15;
                finalColor.b = ((yellow.g + pixels[index+2]) / 2 >>> 0) - 15;
              } else {
                finalColor = yellow;
              }
              break;
            // case isInColorRange(curColor, lipsHighs, lipsLows) : // These are the lips
            //   finalColor = lipstickRed;
            //   break;
            case isInColorRange(curColor, teethHighs, teethLows): 
              finalColor = white;
              break;
            case isInColorRange(curColor, shadowHighs,shadowLows) :
              finalColor = black;
              break;
          }        

            dupBuffer[index+0] = finalColor.r;
            dupBuffer[index+1] = finalColor.g;
            dupBuffer[index+2] = finalColor.b;
        }
         
    }

  }




  effects.warhol = function (chunk, dupBuffer, opts, paramsArray) {

    // type: sleep;

    var x,y;
    var threshold = parseInt(opts.threshold) || 50;
    var paramsArray = paramsArray || chunk;
    opts.values = opts.values || 'white';
    var x = opts.height, y = opts.width;



  // function meanChecker()

  function modifiedMeanPixel(pixels) {

    if (pixels.length === 0) return new Uint8Array(4);
    if (pixels.length === 4) return pixels;

    var highs = {count: 0, r:0,g:0,b:0}, 
        mids  = {count: 0, r:0,g:0,b:0}, 
        lows  = {count: 0, r:0,g:0,b:0};

    for (var i = 0; i < pixels.length; i+=4){
      var colorvalue = pixels[i] + pixels[i+1] + pixels[i+2]; 
      if (colorvalue > 600) {
        highs.count++;
        highs.r+=pixels[i];
        highs.g+=pixels[i + 1];
        highs.b+=pixels[i + 2];
      } else if (colorvalue > 400) {
        mids.count++;
        mids.r+=pixels[i];
        mids.g+=pixels[i + 1];
        mids.b+=pixels[i + 2];    
      } else {
        lows.count++;
        lows.r+=pixels[i];
        lows.g+=pixels[i + 1];
        lows.b+=pixels[i + 2];    
      }
      
    }

    highs.r = (highs.r / highs.count) >>> 0;
    highs.g = (highs.g / highs.count) >>> 0;
    highs.b = (highs.b / highs.count) >>> 0;
    highs.totalvalue = highs.r + highs.g + highs.b;

    mids.r = (mids.r / mids.count) >>> 0;
    mids.g = (mids.g / mids.count) >>> 0;
    mids.b = (mids.b / mids.count) >>> 0;
    mids.totalvalue = mids.r + mids.g + mids.b;

    lows.r = (lows.r / lows.count) >>> 0;
    lows.g = (lows.g / lows.count) >>> 0;
    lows.b = (lows.b / lows.count) >>> 0;
    lows.totalvalue = lows.r + lows.g + lows.b;

    return {
      highs:highs, 
      mids:mids, 
      lows:lows
      };
  }


    var pixels = chunk;
    var meanPixels = modifiedMeanPixel(chunk);
    var black =       {r: 6, g: 2, b:0},
        blue =        {r: 20,g: 30,b:184},
        magentaPink = {r:252,g:165,b:243},
        lipstickRed = {r:193,g:0,  b:67};





    for (var i = 0; i < x; i++) {

        for (var j = 0; j < y; j++) {
            
          var index = (i*y*4) + (j*4);

          var curColor = {
            r : paramsArray[index + 0], 
            g : paramsArray[index + 1], 
            b : paramsArray[index + 2]  
          }
          
          var combinedColorValue = curColor.r + curColor.g + curColor.b;
          var finalColor = {};
          
          switch (true) {
   
            case combinedColorValue >= meanPixels.highs.totalvalue - 10: 
              finalColor = blue;
              break;
            case combinedColorValue >= meanPixels.mids.totalvalue - 10: 
              finalColor = magentaPink;

              break;

            case combinedColorValue > meanPixels.lows.totalvalue - 10: 
              finalColor = lipstickRed;

              break;
            default: finalColor = black; break;
        }        

            dupBuffer[index+0] = finalColor.r;
            dupBuffer[index+1] = finalColor.g;
            dupBuffer[index+2] = finalColor.b;
        }
         
    }

    var shift = (y / 50 >>> 0) % 4 > 0 ? (y / 50 >>> 0) - ((y / 50 >>> 0) % 4) : (y / 50 >>> 0);
    for (var i = 0; i < x; i++) {

        for (var j = 0; j < y; j++) {
            
          var index = (i*y*4) + (j*4);

          var curColor = {
            r : paramsArray[index + 0], 
            g : paramsArray[index + 1], 
            b : paramsArray[index + 2]  
          }

          if (curColor.r === black.r && curColor.g === black.g && curColor.b === black.b) {
            // The pixels behind this one is now black
            dupBuffer[index-shift-4] = black.r || pixels[index+0];
            dupBuffer[index-shift-3] = black.g || pixels[index+1];
            dupBuffer[index-shift-2] = black.b || pixels[index+2];
            // This pixel is now the color ahead of it
            dupBuffer[index+0] = pixels[index+4];
            dupBuffer[index+1] = pixels[index+5];
            dupBuffer[index+2] = pixels[index+6];
    
          } 

        }
         
    }


  }



  effects.mettoizi = function (chunk, dupBuffer, opts, paramsArray) {

        // type: sleep;

    var x,y, length;
    var threshold = parseInt(opts.threshold) || 50;
    var paramsArray = paramsArray || chunk;
    opts.values = opts.values || 'white';
    var x = opts.height, y = opts.width;

    var shift = (y / 50 >>> 0) % 4 > 0 ? (y / 50 >>> 0) - ((y / 50 >>> 0) % 4) : (y / 50 >>> 0);
    // var meanPixels = modifiedMeanPixel(chunk);
    var black       = {r: 6,  g: 2,  b:0},
        blue        = {r: 20, g: 30, b:184},
        magentaPink = {r:252, g:165, b:243},
        yellow      = {r:230, g:213, b:67},
        cyan        = {r:0  , g:250, b:249},
        white       = {r:250, g:245, b:250},
        magentaPink = {r:252, g:165, b:243},
        lipstickRed = {r:193, g:0,   b:67};

    var dressHighs  = {r: 122, g:199, b: 123 },
        dressLows   = {r: 19 , g:18 , b: 20  },
        hairHighs   = {r: 93 , g:91 , b: 95  },
        hairLows    = {r: 11 , g:13 , b: 16  },
        lipsHighs   = {r: 238, g:151, b:143 },
        lipsLows    = {r: 207, g:107, b:102 },
        skinHighs   = {r: 254, g:225, b:200 },
        skinLows    = {r: 123, g:77,  b:55  },
        bgHighs     = {r: 255, g:254, b:255 },
        bgLows      = {r: 200, g:199, b:200 },
        shadowHighs = {r: 175, g:185, b:177 },
        shadowLows  = {r: 93 , g:91 , b:93  },
        teethHighs  = {r: 253, g:255, b:250 },
        teethLows   = {r: 184, g:172, b:165 },
        lips = { r: 214, g:135, b:123 },
        hair = { r: 50,  g:46,  b:54};

    length = chunk.length;

    function isInColorRange(currentColor, highs, lows) {
     if (currentColor.r       >= lows.r && currentColor.r <= highs.r) {
        if (currentColor.g    >= lows.g && currentColor.g <= highs.g) {
           if (currentColor.b >= lows.b && currentColor.b <= highs.b) {
             return true;
           }
        }
     }
     return false;
    }


    for (var i = 0; i < x; i++) {

        for (var j = 0; j < y; j++) {
            
          var index = (j*x*4) + (y*4);
          var nextRow = (j*x*4) + ((y+1)*4)
          if (nextRow > length) {
            nextRow = index;
          }

          var curColor = {
            r : paramsArray[index + 0], 
            g : paramsArray[index + 1], 
            b : paramsArray[index + 2]  
          }
          
          var combinedColorValue = curColor.r + curColor.g + curColor.b;
          var finalColor = {};
          
          switch (true) {
            case (curColor.r - 4 >= curColor.g && curColor.g + 8 >= curColor.r) :
              finalColor = {r: chunk[nextRow+0], g: chunk[nextRow+0], b:chunk[nextRow+0]};
            break;
            case isInColorRange(curColor, bgHighs, bgLows ) : // This is the background
              finalColor = {r: chunk[nextRow+1], g: chunk[nextRow+1], b:chunk[nextRow+1]};
              break;
            case isInColorRange(curColor, skinHighs, skinLows) : // This is the skin
              if (isInColorRange(curColor, lipsHighs, lipsLows)) {
                finalColor.r = (lipstickRed.r + chunk[nextRow+0]) / 2;
                finalColor.g = (lipstickRed.g + chunk[nextRow+1]) / 2;
                finalColor.b = (lipstickRed.b + chunk[nextRow+2]) / 2;
              } else {

                finalColor.r = (chunk[index+0] + chunk[nextRow+0]) / 2;
                finalColor.g = (chunk[index+1] + chunk[nextRow+1]) / 2;
                finalColor.b = (chunk[index+2] + chunk[nextRow+2]) / 2;
              }
              break;
            case isInColorRange(curColor, hairHighs, hairLows) : // This is the hair
              if (isInColorRange(curColor, dressHighs, dressLows)) {
                finalColor.r = chunk[nextRow+0];
                finalColor.g = chunk[nextRow+1];
                finalColor.b = chunk[nextRow+2];
              } else {
                finalColor.r = (chunk[index+2] + cyan.r) / 2;
                finalColor.g = (chunk[index+2] + cyan.g) / 2;
                finalColor.b = (chunk[index+2] + cyan.b) / 2;
              }
              break;
            case isInColorRange(curColor, teethHighs, teethLows): 
              finalColor = white;
              break;
            case isInColorRange(curColor, shadowHighs,shadowLows) :
              finalColor = black;
              break;
          }        

            dupBuffer[index+0] = finalColor.r;
            dupBuffer[index+1] = finalColor.g;
            dupBuffer[index+2] = finalColor.b;
        }
         
    }

  }




  effects.moire = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var beg = 0, end = 10;
    var nsmooth;
    var x, y;

    var data = new Uint32Array(dupBuffer.buffer);

    if (isLSB()) {
        for (var y = 0; y < h; ++y) {
            for (var x = 0; x < w; ++x) {
                var value = x * y & 0xff;

                data[y * w + x] =
                    (255   << 24) |    // alpha
                    (value << 16) |    // blue
                    (value <<  8) |    // green
                     value;            // red
            }
        }
    } else {
        for (y = 0; y < h; ++y) {
            for (x = 0; x < w; ++x) {
                value = x * y & 0xff;

                data[y * w + x] =
                    (value << 24) |    // red
                    (value << 16) |    // green
                    (value <<  8) |    // blue
                     255;              // alpha
            }
        }
    }

  }



  effects.colorcrusher = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var m=5, x, y;
    
    // var now = new Date() * 1;
    var isLittleEndian = isLSB();
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer)
    var dl = data.length;

    if (isLittleEndian) {
      for (var i = 0; i < dl; i++) {
        clone[i] = (data[i] * m);

      }    
    } else {
        for (var i = 0; i < dl; i++) {
          clone[i] = (data[i] * m);
        }
    }
  }


  effects.linedrift_top = function (chunk, dupBuffer, opts, paramsArray) {

    // type: drift
    var h = opts.height, w = opts.width, x, y;
    var amt = opts.threshold || 20;
    var mode = 'top';
    var isLittleEndian = isLSB();
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var threshold, val, c;
   
    if (isLSB()) {
      for (var i = 0; i < w-1; i++) {
        for (var j = 0; j < h-1; j++) {
          val = data[i+(j*w)];
          threshold = data[i+(j+1)*w];

          if (extractBrightnessLSB(val) > extractBrightnessLSB(threshold) + amt) { 
            switch(mode) {
            case 'left':
              c = val;
              clone[(i+1)+(j*w)] = c;
              break;
            case 'top':
              c = val;
              clone[i+((j+1)*w)] = c;
              break;
            }
          }
        }
      }
    } else {
      for (var i = 0; i < w-1; i++) {
        for (var j = 0; j < h-1; j++) {
          val = data[i+(j*w)];
          threshold = data[i+(j+1)*w];

          if (extractBrightnessMSB(val) > extractBrightnessMSB(threshold) + amt) { 
            switch(mode) {
            case 'left':
              c = val;
              clone[(i+1)+(j*w)] = c;
              break;
            case 'top':
              c = val;
              clone[i+((j+1)*w)] = c;
              break;
            }
          }
        }
      }
    }
    
  }


  effects.linedrift_left = function (chunk, dupBuffer, opts, paramsArray) {

    // type: drift
    var h = opts.height, w = opts.width, x, y;
    var amt = opts.threshold || 20;
    var mode = 'left';
    var isLittleEndian = isLSB();
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var threshold, val, c;
    if (isLSB()) {
      for (var i = 0; i < w-1; i++) {
        for (var j = 0; j < h-1; j++) {
          val = data[i+(j*w)];
          threshold = data[i+(j+1)*w];

          if (extractBrightnessLSB(val) > extractBrightnessLSB(threshold) + amt) { 
            switch(mode) {
            case 'left':
              c = val;
              clone[(i+1)+(j*w)] = c;
              break;
            case 'top':
              c = val;
              clone[i+((j+1)*w)] = c;
              break;
            }
          }
        }
      }
    } else {
      for (var i = 0; i < w-1; i++) {
        for (var j = 0; j < h-1; j++) {
          val = data[i+(j*w)];
          threshold = data[i+(j+1)*w];

          if (extractBrightnessMSB(val) > extractBrightnessMSB(threshold) + amt) { 
            switch(mode) {
            case 'left':
              c = val;
              clone[(i+1)+(j*w)] = c;
              break;
            case 'top':
              c = val;
              clone[i+((j+1)*w)] = c;
              break;
            }
          }
        }
      }
    }
  }



  effects.randomblocks = function (chunk, dupBuffer, opts, paramsArray) {
    
    var h = opts.height, w = opts.width, x, y;
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var size = (opts.xspace * opts.yspace) || 100;

    for (var x = 0; x < h; x+=size) {
      for (var y = 0; y < w; y+=size) {
        var i = Math.round( Math.random() * h - 1 );
        var j = Math.round( Math.random() * w - 1 );
        
        if ( (i+size) > h) i = (i - (i-h)) - size;
        if ( (j+size) > w) j = (j - (j-h)) - size;

        copyBlocks(i, j, size, size, x, y, size, size);

      }
    }


    function copyBlocks(sx, sy, sw, sh, dx, dy, dw, dh) {
      // console.time("copyBlocks");
      var i = 0;
      var buf = new Uint32Array(sw * sh);  
      for (var n = 0; n < sh; n++ ) {
        for (var o = 0; o < sw; o++) {
          var sIndex = (sx + n) * w + (sy + o);
          buf[i++] = data[sIndex];
        }
      }
      var i = 0;
      for (var n = 0; n < dh; n++) {
        for (var o = 0; o < dw; o++) {
          var dIndex = (dx + n) * w + (dy + o);
          clone[dIndex] = buf[i++]
        }
      }

    }

  }




  effects.nin_dissapointed_effect = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var space = 5;
    var weight = 10;
    var depth = opts.depth || 0.9;
    var zoom = 100;
    var x, y, i;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var length = data.length;

    for (var x = 0; x < h; x+=space) {
      for (var y = 0; y < w; y+=space) {
        var index = x * w +y; // change to w if need be
        var col = data[index];
        // draw
        for (var i = 0; i < weight; i++) {
          var step =  index + (w * i);
          step = parseInt(step*depth, 10);
          clone[step] = col;
        }
      }
    }

  }




  effects.rutt_etra = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var space = 5;
    var weight = 10;
    var depth = opts.depth || 0.9;
    var zoom = 100;
    var x, y, i;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var length = data.length;

    for (var x = 0; x < h; x+=space) {
      for (var y = 0; y < w; y+=space) {
        var index = x * w +y; // change to w if need be
        var col = data[index];
        // draw
        for (var i = 0; i < weight; i++) {
          var step =  index + (w * i);
          // step = parseInt(step*depth-zoom, 10);
          clone[step] = col;
        }
      }
    }

  }



  effects.rutt_etra_blendud = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var xspace = opts.xspace || 5, 
        yspace = opts.yspace || 5,
        weight = opts.weight || 10,
        depth = opts.depth || 0.9,
        x, y, i;
    var isLittleEndian = isLSB();
    
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
   
    var length = data.length;

    for (var x = 0; x < h; x+=xspace) {
      for (var y = 0; y < w; y+=yspace) {
        var index = x * w +y; // change to w if need be
        var col = data[index];
        // draw
        for (var i = 0; i < weight; ++i) {
          var step =  index + (w * i);
          step = parseInt(step*depth, 10);
          clone[step] = col;
        }
      }
    }
  }



  effects.rutt_etra_blendlr = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var xspace = opts.xspace || 5, 
        yspace = opts.yspace || 5,
        weight = opts.weight || 10,
        depth = opts.depth || 0.9,
        x, y, i;
    
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var length = data.length;

    for (var x = 0; x < w; x+=xspace) {
      for (var y = 0; y < h; y+=yspace) {
        var index = y * h + x; // change to w if need be
        var col = data[index];
        // draw
        for (var i = 0; i < weight; i++) {
          var step =  index + (h * i);
          step = parseInt(step*depth, 10);
          clone[step] = col;
        }
      }
    }
  }






  effects.rutt_etra_bright_lr = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var xspace = opts.xspace || 5, 
        yspace = opts.yspace || 5,
        weight = opts.weight || 10,
        depth = opts.depth || 0.9,
        x, y, v;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    

    var length = data.length;

    var vectors = [];
    if (isLSB()){ 
      for (var x = 0; x < h; x+=xspace) {
        // create vectors
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w + y; 
          var col = data[index];
          var brite = extractBrightnessLSB(col);
          // draw
          vectors.push([x, y, Math.abs(parseInt((depth*brite / 25),10)), col]);
        }
      }
    } else {
      for (var x = 0; x < h; x+=xspace) {
        // create vectors
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w + y; 
          var col = data[index];
          var brite = extractBrightnessMSB(col);
          // draw
          vectors.push([x, y, Math.abs(parseInt((depth*brite / 25),10)), col]);
        }
      }
    }

    var px = 0, py = 0, nx, ny;
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
          clone[ index ] = color;
          for (var i = 0; i < weight; i++) clone[ index + (w * i) ] = color;
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
            for (i = 0; i < weight; i++) clone[ index + (w * i) ] = color;
            // clone[ cIndex ] = color;
          }
        }

  }




  effects.rutt_etra_bright_lr_map = function (chunk, dupBuffer, opts, paramsArray) {
    var paramsArray = paramsArray || chunk;
    var h = opts.height, w = opts.width;
    var xspace = opts.xspace || 5, 
        yspace = opts.yspace || 5,
        weight = opts.weight || 10,
        depth = opts.depth || 0.9,
        x, y, v;

   
    var data = new Uint32Array(chunk.buffer);
    var bMap = new Uint32Array(paramsArray.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    
    var length = data.length;

    var vectors = [];
    if (isLSB()) { 
      for (var x = 0; x < h; x+=xspace) {
        // create vectors
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w + y; 
          var col = data[index];
          var brite = extractBrightnessLSB(bMap[index]);
      
          vectors.push([x, y, Math.abs(parseInt((depth*brite / 25),10)), col]);

        }
      }
    } else {
      for (var x = 0; x < h; x+=xspace) {
        // create vectors
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w + y; 
          var col = data[index];
          var brite = extractBrightnessMSB(bMap[index]);
      
          vectors.push([x, y, Math.abs(parseInt((depth*brite / 25),10)), col]);

        }
      }
    }

    var px = 0, py = 0, nx, ny;
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
          clone[ index ] = color;
          for (var i = 0; i < weight; i++) clone[ index + (w * i) ] = color;
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
            for (i = 0; i < weight; i++) clone[ index + (w * i) ] = color;
            // clone[ cIndex ] = color;
          }
        }
  }




  effects.rgb_lights = function (chunk, dupBuffer, opts, paramsArray) {
    
    // type: draw
    var h = opts.height, w = opts.width;
    var xspace = opts.xspace || 5, 
        yspace = opts.yspace || 5,
        weight = opts.weight || 10,
        depth = opts.depth || 0.9,
        x, y;
    var rgb = "r";

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);


    if (isLSB()) {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index];
          var chan = extractBrightnessLSB(col);
          var r = (col &0xFF);
          var g = (col >> 8)&0xFF;
          var b = (col >> 16)&0xFF;
          switch (rgb) {
            case 'r':
              col =  (255 << 24) | (  0 << 16) | (  0 <<  8) | chan;
              break;
            case 'g':
              col =  (255 << 24) | ( 0 << 16) | ( chan << 8) | 0;
              break;
            case 'b':
              col =  (255 << 24) | ( chan << 16) | ( 0 << 8) | 0;
              break;
          }


          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            var step =  index + (dx * w + dy);
              clone[step] = col;
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }  
    } else {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index];
          var chan = extractBrightnessMSB(col);
          var r = (col &0xFF);
          var g = (col >> 8)&0xFF;
          var b = (col >> 16)&0xFF;
          switch (rgb) {
            case 'r':
              col =  (chan << 24) | (  0 << 16) | (  0 <<  8) | 255;
              break;
            case 'g':
              col =  (255 << 24)  | ( chan << 16) | ( 0 << 8) | 255;
              break;
            case 'b':
              col =  (0   << 24)  | ( 0 << 16) | ( chan << 8) | 255;
              break;
          }


          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            var step =  index + (dx * w + dy);
              clone[step] = col;
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }
    }
  }



  effects.rgb_lights_3d = function (chunk, dupBuffer, opts, paramsArray) {
    
    // type: draw
    var h = opts.height, w = opts.width;
    var xspace = opts.xspace || 5, 
        yspace = opts.yspace || 5,
        weight = opts.weight || 10,
        depth = opts.depth || 0.9,
        x, y;
    var rgb = "r";

    // Sanity checker, needed?
    // if (xspace < 10) xspace = 10; 
    // if (yspace < 10) yspace = 10;
    // if (weight > 5) weight = 5;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);


    if (isLSB()) {
      for (var x = 0; x < h; x+= (xspace+weight)  ) {
        for (var y = 0; y < w; y+=(yspace+weight)  ) {
          var index = x * w +y;
          var col = data[index];
          var chan = extractBrightnessLSB(col);
    

          // draw
          for (var dz = 0; dz < weight; ++dz) {
            for (var dx = 0; dx < xspace; ++dx) {
              for (var dy = 0; dy < yspace; ++dy) {
                
                var nchan = Math.max(0, Math.min(255, Math.round(chan*dz)));
                switch (rgb) {
                  case 'r':
                    col =  (255 << 24) | (  0 << 16) | (  0 <<  8) | nchan;
                    break;
                  case 'g':
                    col =  (255 << 24) | ( 0 << 16) | ( nchan << 8) | 0;
                    break;
                  case 'b':
                    col =  (255 << 24) | ( nchan << 16) | ( 0 << 8) | 0;
                    break;
                }
                var step = index + ((dx * w + dy) + ( (dz * w) + dz) );

                clone[step] = col;
                
              }
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }  
    } else { 
      for (var x = 0; x < h; x+= (xspace+weight)  ) {
        for (var y = 0; y < w; y+=(yspace+weight)  ) {
          var index = x * w +y;
          var col = data[index];
          var chan = extractBrightnessLSB(col);
    

          // draw
          for (var dz = 0; dz < weight; ++dz) {
            for (var dx = 0; dx < xspace; ++dx) {
              for (var dy = 0; dy < yspace; ++dy) {
                
                var nchan = Math.max(0, Math.min(255, Math.round(chan*dz)));
                switch (rgb) {
                  case 'r':
                    col =  (nchan << 24) | (  0 << 16) | (  0 <<  8) | 255;
                    break;
                  case 'g':
                    col =  (   0 << 24) | ( nchan << 16) | ( 0 << 8) | 255;
                    break;
                  case 'b':
                    col =  (   0 << 24) | ( 0 << 16) | ( nchan << 8) | 255;
                    break;
                }
                var step = index + ((dx * w + dy) + ( (dz * w) + dz) );

                clone[step] = col;
                
              }
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }  
    }
  }



  effects.simple_3d_light = function (chunk, dupBuffer, opts, paramsArray) {
    
    // type: draw
    var xspace = opts.xspace, yspace = opts.yspace;
    var zoom = opts.stroke, weight = opts.weight;
    var h = opts.height, w = opts.width;
    var x, y;

    if (xspace < 10) xspace = 10; 
    if (yspace < 10) yspace = 10;
    if (weight > 5) weight = 5;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    if (isLSB()) {
      for (var x = 0; x < h; x+= (xspace+weight)  ) {
        for (var y = 0; y < w; y+=(yspace+weight)  ) {
          var index = x * w +y;
          var col = data[index];
          var chan = extractBrightnessLSB(col);

          // draw
          for (var dz = 0; dz < weight; dz++) {
            for (var dx = 0; dx < xspace; dx++) {
              for (var dy = 0; dy < yspace; dy++) {
                // console.log(dz)
                var nchan = Math.max(0, Math.min(255, Math.round(chan*dz)));
                col =  (255 << 24) | (  nchan << 16) | (  nchan <<  8) | nchan;
                
                var step = index + ((dx * w + dy) + ( (dz * w) + dz) );

                clone[step] = col;
                
              }
            }
          }
        }
      }  
    } else { // Big-Endian
      for (var x = 0; x < h; x+= (xspace+weight)  ) {
        for (var y = 0; y < w; y+=(yspace+weight)  ) {
          var index = x * w +y;
          var col = data[index];
          var chan = extractBrightnessMSB(col);

          // draw
          for (var dz = 0; dz < weight; ++dz) {
            for (var dx = 0; dx < xspace; ++dx) {
              for (var dy = 0; dy < yspace; ++dy) {
                // console.log(dz)
                var nchan = Math.max(0, Math.min(255, Math.round(chan*dz)));
                col =  (nchan << 24) | (  nchan << 16) | (  nchan <<  8) | 255;
                
                var step = index + ((dx * w + dy) + ( (dz * w) + dz) );

                clone[step] = col;
                
              }
            }
          }
        }
      }
    }
  }



  effects.simple_3d_color = function (chunk, dupBuffer, opts, paramsArray) {
    
    // type: draw
    var xspace = opts.xspace || 10, 
        yspace = opts.yspace || 10,
        weight = opts.weight || 5;
    var h = opts.height, w = opts.width, x, y;

    // Sanity check???
    // if (xspace < 10) xspace = 10; 
    // if (yspace < 10) yspace = 10;
    // if (weight > 5) weight = 5;


    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    for (var x = 0; x < h; x+= (xspace+weight)  ) {
      for (var y = 0; y < w; y+=(yspace+weight)  ) {
        var index = x * w +y;
        var col = data[index];
        // draw
        for (var dz = 0; dz < weight; dz++) {
          for (var dx = 0; dx < xspace; dx++) {
            for (var dy = 0; dy < yspace; dy++) {
              var step = index + ((dx * w + dy) + ( (dz * w) + dz) );
              clone[step] = col;
              
            }
          }
        }

      }
    }  
  }



  effects.half_lights = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width, x, y;
    var xspace = opts.xspace || 10,
        yspace = opts.yspace || 5;
    var rgb = "r";

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    if (isLSB()) {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index];
          var r = (col &0xFF);
          var g = (col >> 8)&0xFF;
          var b = (col >> 16)&0xFF;
          switch (rgb) {
            case 'r':
              col =  (255 << 24) | ( Math.round(b/2)<< 16) | ( Math.round(g/2) << 8) | r;
              break;
            case 'g':
              col =  (255 << 24) | ( Math.round(b/2) << 16) | ( g << 8) | Math.round(r/2) ;
              break;
            case 'b':
              col =  (255 << 24) | ( b << 16) | ( Math.round(g/2) << 8) | Math.round(r/2);
              break;
          }
          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            var step =  index + (dx * w + dy);
              clone[step] = col;
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }  
    } else {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index];
          var r = (col >> 24)&0xFF;
          var g = (col >> 16)&0xFF;
          var b = (col >> 8) &0xFF;
          switch (rgb) {
            case 'r':
              col =  (r << 24) | ( Math.round(g/2) << 16) | ( Math.round(b/2) << 8) | 255;
              break;
            case 'g':
              col =  (Math.round(r/2) << 24) | ( g << 16) | ( Math.round(b/2) << 8) | 255;
              break;
            case 'b':
              col =  (Math.round(r/2) << 24) | ( Math.round(g/2) << 16) | ( b << 8) | 255;
              break;
          }
          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy  =0; dy < yspace; ++dy) {
            var step =  index + (dx * w + dy);
              clone[step] = col;
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }  
    }
  }





  effects.half_circle_lights = function (chunk, dupBuffer, opts, paramsArray) {
   
    var h = opts.height, w = opts.width, x, y;
    var xspace = opts.xspace || 15,
        yspace = opts.yspace || 15;
    var rgb = "r";

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var scx = Math.round(xspace/2);
    var scy = Math.round(yspace/2);
    var numSteps = xspace * yspace,
        radius = Math.round( numSteps/4/10 ),
        circ = radius * radius;
    
    if (isLSB()) {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index];

          var r = (col &0xFF);
          var g = (col >> 8)&0xFF;
          var b = (col >> 16)&0xFF;
          switch (rgb) {
            case 'r':
              col =  (255 << 24) | ( Math.round(b/2)<< 16) | ( Math.round(g/2) << 8) | r;
              break;
            case 'g':
              col =  (255 << 24) | ( Math.round(b/2) << 16) | ( g << 8) | Math.round(r/2) ;
              break;
            case 'b':
              col =  (255 << 24) | ( b << 16) | ( Math.round(g/2) << 8) | Math.round(r/2);
              break;
          }
          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            var cx = scx - dx;
            var cy = scy - dy;
            if ( ( cx * cx + cy * cy ) <=  circ  ) {
              var step =  index + (dx * w + dy);
              clone[step] = col;
              }
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }  
    } else {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          // var col = data[index];

          // Average the color value square
          var col;
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
              var dIndex = index + (dx * w + dy);
              col += data[dIndex];
            }
          }
          col = Math.round(col / numSteps);

          var r = (col >> 24)&0xFF;
          var g = (col >> 16)&0xFF;
          var b = (col >> 8) &0xFF;
          switch (rgb) {
            case 'r':
              col =  (r << 24) | ( Math.round(g/2) << 16) | ( Math.round(b/2) << 8) | 255;
              break;
            case 'g':
              col =  (Math.round(r/2) << 24) | ( g << 16) | ( Math.round(b/2) << 8) | 255;
              break;
            case 'b':
              col =  (Math.round(r/2) << 24) | ( Math.round(g/2) << 16) | ( b << 8) | 255;
              break;
          }

          // draw
          var cx = scx - x;
          var cy = scy - y;
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            if ( ( cx * cx + cy * cy ) <=  circ  ) {
              var step =  index + (dx * w + dy);
              clone[step] = col;
              }
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }  
    }


  }





  effects.half_circle_colors = function (chunk, dupBuffer, opts, paramsArray) {
   
    var h = opts.height, w = opts.width, x, y;
    var xspace = opts.xspace || 15,
        yspace = opts.yspace || 15;

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var scx = Math.round(xspace/2);
    var scy = Math.round(yspace/2);
    var numSteps = xspace * yspace,
        radius = Math.round( numSteps/4/10 ),
        circ = radius * radius;
    
    if (isLSB()) {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index];

          var r = (col &0xFF);
          var g = (col >> 8)&0xFF;
          var b = (col >> 16)&0xFF;

          col =  (255 << 24) | ( b << 16) | ( g << 8) | r;
          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            var cx = scx - dx;
            var cy = scy - dy;
            if ( ( cx * cx + cy * cy ) <=  circ  ) {
              var step =  index + (dx * w + dy);
              clone[step] = col;
              }
            }
          }

        }
      }  
    } else {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          // var col = data[index];

          // Average the color value square
          var col;
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
              var dIndex = index + (dx * w + dy);
              col += data[dIndex];
            }
          }
          col = Math.round(col / numSteps);

          var r = (col >> 24)&0xFF;
          var g = (col >> 16)&0xFF;
          var b = (col >> 8) &0xFF;
          
          col =  (r << 24) | ( g << 16) | ( b << 8) | 255;
          

          // draw
          var cx = scx - x;
          var cy = scy - y;
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            if ( ( cx * cx + cy * cy ) <=  circ  ) {
              var step =  index + (dx * w + dy);
              clone[step] = col;
              }
            }
          }

        }
      }  
    }


  }




  effects.blockbreaker = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width, x, y;
    var xspace = opts.xspace || 5, 
        yspace = opts.yspace || 5;
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var rgb = "r";

    var scx = Math.round(xspace/2);
    var scy = Math.round(yspace/2);
    var numSteps = xspace * yspace, radius, circ;
   
    if (isLSB()) {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index];
          
          var chan = 255 - extractBrightnessLSB(col);

          var radius = (xspace * yspace) / chan;

          circ = Math.round(radius * radius);

          var r = (col &0xFF);
          var g = (col >> 8)&0xFF;
          var b = (col >> 16)&0xFF;
   
          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            var cx = scx - dx;
            var cy = scy - dy;
            if ( ( cx * cx + cy * cy ) <=  circ  ) {
              var step =  index + (dx * w + dy);
              clone[step] = col;
              }
            }
          }
        }
      }  
    } else {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index];
          
          var chan = 255 - extractBrightnessMSB(col);

          var radius = (xspace * yspace) / chan;

          circ = Math.round(radius * radius);

          var r = (col &0xFF);
          var g = (col >> 8)&0xFF;
          var b = (col >> 16)&0xFF;
   
          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            var cx = scx - dx;
            var cy = scy - dy;
            if ( ( cx * cx + cy * cy ) <=  circ  ) {
              var step =  index + (dx * w + dy);
              clone[step] = col;
              }
            }
          }
        }
      }
    }
  }


  effects.fuzz_lights = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var xspace =  10;
    var yspace = 5;
    var x, y;
    var rgb = "r";

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var length = data.length;
    var isLittleEndian = isLSB();


    if (isLittleEndian) {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index],dCol;
          var r = (col &0xFF);
          var g = (col >> 8)&0xFF;
          var b = (col >> 16)&0xFF;
          switch (rgb) {
            case 'r':
              dCol =  (255 << 24) | ( Math.round(b/2)<< 16) | ( Math.round(g/2) << 8) | r;
              break;
            case 'g':
              dCol =  (255 << 24) | ( Math.round(b/2) << 16) | ( g << 8) | Math.round(r/2) ;
              break;
            case 'b':
              dCol =  (255 << 24) | ( b << 16) | ( Math.round(g/2) << 8) | Math.round(r/2);
              break;
          }
          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy = 0; dy < yspace; ++dy) {
            var step =  index + (dx * w + dy);
              clone[step] = (data[step] + col) / 2;
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }  
    } else {
      for (var x = 0; x < h; x+=xspace) {
        for (var y = 0; y < w; y+=yspace) {
          var index = x * w +y;
          var col = data[index], dCol;
          var r = (col >> 24)&0xFF;
          var g = (col >> 16)&0xFF;
          var b = (col >> 8) &0xFF;
          switch (rgb) {
            case 'r':
              dCol =  (r << 24) | ( Math.round(g/2) << 16) | ( Math.round(b/2) << 8) | 255;
              break;
            case 'g':
              dCol =  (Math.round(r/2) << 24) | ( g << 16) | ( Math.round(b/2) << 8) | 255;
              break;
            case 'b':
              dCol =  (Math.round(r/2) << 24) | ( Math.round(g/2) << 16) | ( b << 8) | 255;
              break;
          }
          // draw
          for (var dx = 0; dx < xspace; ++dx) {
            for (var dy  =0; dy < yspace; ++dy) {
            var step =  index + (dx * w + dy);
              clone[step] = (data[step] + col) / 2;
            }
          }

          if (rgb === 'r') rgb = 'g';
          else if (rgb === 'g') rgb = 'b';
          else rgb = 'r';

        }
      }  
    }

  }



  effects.pixelate = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var xspace =  10;
    var yspace = 5;
    var x, y;
    var rgb = "r";

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var length = data.length;

    for (var x = 0; x < h; x+=xspace) {
      for (var y = 0; y < w; y+=yspace) {
        var index = x * w + y;
        var col = data[index];

        // draw
        for (var dx = 0; dx < xspace; ++dx) {
          for (var dy = 0; dy < yspace; ++dy) {
          var step =  index + (dx * w + dy);
            clone[step] = col;
          }
        }

      }
    }  
  }


  effects.pandaize = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;
    var cl = chunk.length;
    var x, y;

    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var pl = pixels.length;

    var barwidth = (opts.xspace === undefined || parseInt(opts.xspace, 10) === 0) ? 6 : parseInt(opts.xspace, 10), 
        picspace = 2, 
        minbright = (opts.yspace === undefined || parseInt(opts.yspace, 10) === 0) ? 20 : parseInt(opts.yspace, 10), 
        zigheight = 40, 
        drctn = 1,
        lumin = 1.618,
        bothsides = false,
        bw = true,
        c1, c2;

    if (isLSB) {
      c1 = (255 << 24) | ( 0   << 16 ) | ( 0   << 8) | 0;
      c2 = (255 << 24) | ( 255 << 16 ) | ( 255 << 8) | 255;
    } else {
      c1 = ( 0   << 24) | ( 0   << 16 ) | ( 0   << 8) | 255;
      c2 = ( 255 << 24) | ( 255 << 16 ) | ( 255 << 8) | 255;
    }

   for (var y = 0; y < h; y++) {
      if (y % zigheight === 0 ) drctn = -drctn;

      for (var x = 0; x < w; x+=barwidth) {
        for (var i = 0; i < barwidth; i++) {
          
          if (isLSB) {
            var pos = (x+(drctn*y))+ i + y * w;
            if (pos >= pl) continue;
            var currentColor = pixels[pos];
            var r = (currentColor >> 16)&0xFF;
            var g = (currentColor >> 8)&0xFF;
            var b = (currentColor &0xFF);
            if (!bw) {

              clone[pos] = c1;
            } else {
              if ( ( bothsides && ( i < 0 + picspace || i >= barwidth-picspace ) ) || ( !bothsides && i < 0 + picspace ) ) {
                var brite = Math.max.apply(null, [r,g,b]);
                    brite = Math.max(Math.min(255, ( minbright + (brite*lumin) )), 0);
                clone[pos] = (255 << 24) | (brite << 16 ) | (brite << 8) | brite;
              } else {
     
                clone[pos] = c2;
              }
            } 
            if ( i == barwidth -1 ){
              bw = !bw;
            }
          } else { // Big Endian
            var pos = (x+(drctn*y))+i +y *w;
            if (pos >= pl) continue;
            var currentColor = pixels[pos];
            var r = (currentColor >> 16)&0xFF;
            var g = (currentColor >> 8)&0xFF;
            var b = (currentColor &0xFF);

            if (bw) {
              clone[pos] = c1;
              
            } else {
              if ( ( bothsides && ( i < 0 + picspace || i >= barwidth-picspace ) ) || ( !bothsides && i < 0 + picspace ) ) {
                var brite = Math.max.apply(null, [r,g,b]);
                    brite = Math.max(Math.min(255, ( minbright + (brite*lumin) )), 0)
                clone[pos] = (brite << 24) | (brite << 16 ) | (brite << 8) | 255;
              } else {
                clone[pos] = c2;
               
              }
              if ( i === barwidth -1){
                bw = !bw;
              }
            } 
          }
        }
      }
    }
  }




  effects.socanoawshift = function (chunk, dupBuffer, opts, paramsArray) {

    var h = opts.height, w = opts.width;
    var beg = 0, end = 10;
    var x, y, xslant = 1, yslant = 1;
    var r, g, b;
    
    var now = new Date() * 1;
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer)
    if (isLSB()) {
      for( x = 0; x < h; x+= xslant) {
        for(y = 0; y < w; y+= yslant) {
          var index = x * w + y;
          var color = data[index];
          r = color&255;
          g = (color>>8)&255;
          b = (color>>16)&255;

          var si = Math.sin(r+g+b) * 256 >> 0
          var co = Math.cos(r+g+b) * 256 >> 0

          var r = co - si * now * 0.1 >> 24;
          var g = co - si * now * 0.1 >> 16;
          var b = co - si * now * 0.1 >> 8;

          clone[index] = (255<< 24) |
                        (b << 16) |
                        (g << 8)  |
                        (r )      |
                        255;
        }
      }
    }
  }


  effects.pipes = function (chunk, dupBuffer, opts, paramsArray) {

    // type: destructive
      var paramsArray = paramsArray || chunk;
      var h = opts.height, w = opts.width, x,y;


      function normalizeKernel(kerneldata) {
        var sum = 0;
        for (var i = 0; i < kerneldata.length; i++) 
          sum+= kerneldata[i];
        if (sum > 0)
          for(var i = 0; i < kerneldata.length; i++)
            kerneldata[i] /= sum;
      }

      function extractKernelArea(kernel, index, locationData) {

        var sumR = 0,
            sumG = 0,
            sumB = 0;
        var o = 0, p = 0;
        var pIndex;
        var x = locationData.x - 1;
        var y = locationData.y - 1;
        var w = locationData.w;

        for (var i = x, kh = kernel.height; o < kh ; ++i, ++o) {

          for (var n = y, kw = kernel.width; p < kw; ++n, ++p) {

            var pIndex = Math.abs(i*w*4) + Math.abs(n*4);
            sumR += (chunk[pIndex+0] || 1) * kernel.data[o+p];
            sumG += (chunk[pIndex+1] || 1) * kernel.data[o+p];
            sumB += (chunk[pIndex+2] || 1) * kernel.data[o+p];
   

          }
        }
        if (sumR < 0) sumR = Math.abs(sumR);
        if (sumG < 0) sumG = Math.abs(sumG);
        if (sumB < 0) sumB = Math.abs(sumB);

        return [ Math.round(sumR), Math.round(sumG), Math.round(sumB) ];
      }



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
    } 

    normalizeKernel(sharpKernel.data);
    for (var x=0;x<h;++x) {
      for (var y=0;y<w;++y) {
        var index = (x*w+y)*4;
        var loc = {w: w, h: h, x: x, y: y};
         var pix =  extractKernelArea( sharpKernel, index, loc);
         dupBuffer[index+0] = pix[0];
         dupBuffer[index+1] = pix[1];
         dupBuffer[index+2] = pix[2];


      }
    }
  }






  effects.kernelizer_map = function (chunk, dupBuffer, opts, paramsArray) {

    // type: kernel

    var opts = opts === undefined ? {} : opts,
        length = chunk.length,
        h = opts.height,
        w = opts.width;
    var paramsArray = (paramsArray === undefined) ? chunk : paramsArray,
        x,y;
    
    var contrastAwesome = {
      height: 3,
      width: 3,
      data: [-7, 19, 19, 16, -19, -12, 9, 17, -19],
    };

    // var kernel = contrastAwesome.data;
    var kernel = [-1,-1,1, -1,1,2, -1,1,1];
    var kl = kernel.length;
    var side = Math.round(Math.sqrt(kl)); 
    var offset = Math.floor(side/2), kx, ky;

    for (var x = 0; x < w; ++x) {
      for (var y = 0; y < h; ++y) {
        var sx = x;
        var sy = y;   
        var r=0,g=0,b=0;
        var index = (x*h+y)*4;
        for (var kx = 0; kx < side; kx++) {
          for (var ky = 0; ky < side; ky++) {
            var scx = sx + kx - offset;
            var scy = sy + ky - offset;
            // if (scx >= 0 && scx < w && scy >= 0 && scy < h) {    
              var kel = (scx*h+scy)*4;
              var wt = kernel[ky*side+kx];
              r += chunk[kel+0] * wt; 
              g += chunk[kel+1] * wt; 
              b += chunk[kel+2] * wt; 
            // }
          }
        }
        dupBuffer[index+0] = r/kernel.length;// Math.abs(Math.round(r));
        dupBuffer[index+1] = g/kernel.length;// Math.abs(Math.round(g));
        dupBuffer[index+2] = b/kernel.length;// Math.abs(Math.round(b));
        dupBuffer[index+3] = 255;
      }
    }

  }



  effects.convolute = function (chunk, dupBuffer, opts, paramsArray) {

    // type: voijami
    var opts = opts || {};
    var numEl = opts.numel || 4;
    
    var length = chunk.length;
    var opaque = opts.noise || 0;


      // Add conv0lutions here
    var exampleKernel = {
      height: 3,
      width: 3,
      data :[-1,-1,-1, -1, 9,-1, -1,-1,-1]
    },
    okKernel = {
      height: 3,
      width: 3,
      data :[  0, -1,  0, -1,  5, -1, 0, -1,  0 ]
    },
     sharpKernel = {
      height: 3,
      width: 3,
      data :[-1,-1,-1, -1, 11,-1, -1,-1,-1]
    },
    brightKernel = {
      height: 3,
      width: 3,
      data :[-2,-2,-2, -2,25,-2, -1,-1,-1]
    },
    blueKernel = {
      height: 3, 
      width:3,
      data: [1,-2,1, 2,5,2, 1,-2,1]
    },
    sobelKernel = {
      height: 3,
      width: 3,
      data: [-1,-1,1, -2,0,2, -1,1,1]
    };

    var kernel = okKernel.data;
    var side = Math.round(Math.sqrt(kernel.length));
    var halfside = Math.floor(side/2);
    var sh = opts.height, sw = opts.width;
    var w = sw;
    var h = sh;
    var alphaFac = opaque ? 1 : 0;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        var sy = y;
        var sx = x;
        var index = (x*w+y)*4;
        var r=0, g=0, b=0, a=0;
        for (var cx=0;cx<side; ++cx) {
          for(var cy=0; cy<side; ++cy) {
            var scx = sx + cx - halfside;
            var scy = sy + cy - halfside;
            if (scx >= 0 && scx < sh && scy >= 0 && scy < sw) {
              var sIndex = (scx*sw+scy)*4;
              var wt = kernel[cx*side+cy];
              r+= chunk[sIndex] * wt;
              g+= chunk[sIndex+1] * wt;
              b+= chunk[sIndex+2] * wt;
              a+= chunk[sIndex+3] * wt;
            }
          }
        }
        dupBuffer[index] = r;
        dupBuffer[index+1] = g;
        dupBuffer[index+2] = b;
        dupBuffer[index+3] = 0xFF;
        // chunk[index+3] = a + alphaFac*(255-a);
      }
    }
  }



  effects.stryp = function (chunk, dupBuffer, opts, paramsArray) {

    // type: kernel

    var h = opts.height, w = opts.width, x,y;
    var paramsArray = (paramsArray === undefined) ? chunk : paramsArray;
    var contrastAwesome = {
      height: 3,
      width: 3,
      data: [-7, 19, 19, 16, -19, -12, 9, 17, -19],
    };
    // var kernel = contrastAwesome.data;
    var kernel = [-1,-1,1, -2,0,2, -1,1,1];
    var side = Math.round(Math.sqrt(kernel.length)); 
    var offset = Math.floor(side/2), kx, ky;
    var scx, scy, sx,sy,r,g,b;
    for (var x = 0; x < w; ++x) {
      for (var y = 0; y < h; ++y) {
        var sx = x - offset;
        var sy = y - offset;   
        var r=0,g=0,b=0;
        var index = (x*h+y)*4;
        for (var kx = 0; kx < side; ++kx) {
          for (var ky = 0; ky < side; ++ky) {
            var scx = sx + kx
            var scy = sy + ky
            // if (scx >= 0 && scx < w && scy >= 0 && scy < h) {    
              var kel = (scx*h+scy)*4;
              var wt = kernel[ky*side+kx];
              r += chunk[kel+0] * wt; 
              g += chunk[kel+1] * wt; 
              b += chunk[kel+2] * wt; 
            // }
          }
        }
        dupBuffer[index+0] = r;// Math.abs(Math.round(r));
        dupBuffer[index+1] = g;// Math.abs(Math.round(g));
        dupBuffer[index+2] = b;// Math.abs(Math.round(b));
        dupBuffer[index+3] = 255;
      }
    }
  }


  effects.sheerator = function (chunk, dupBuffer, opts, paramsArray) {

    // type: voijami

      // Add conv0lutions here
    var exampleKernel = {
      height: 3,
      width: 3,
      data :[-1,-1,-1, -1, 9,-1, -1,-1,-1]
    },
    okKernel = {
      height: 3,
      width: 3,
      data :[  0, -1,  0, -1,  5, -1, 0, -1,  0 ]
    },
     sharpKernel = {
      height: 3,
      width: 3,
      data :[-1,-1,-1, -1, 11,-1, -1,-1,-1]
    },
    brightKernel = {
      height: 3,
      width: 3,
      data :[-2,-2,-2, -2,25,-2, -1,-1,-1]
    },
    blueKernel = {
      height: 3, 
      width:3,
      data: [1,-2,1, 2,5,2, 1,-2,1]
    },
    sobelKernel = {
      height: 3,
      width: 3,
      data: [-1,-1,1, -2,0,2, -1,1,1]
    };

    var kernel = sobelKernel.data;
    var side = Math.round(Math.sqrt(kernel.length));
    var halfside = Math.floor(side/2);
    var sh = opts.height, sw = opts.width;
    var w = sw;
    var h = sh;
    // var alphaFac = opaque ? 1 : 0;
    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var sy = y;
        var sx = x;
        var index = (x*w+y)*4;
        var r=0, g=0, b=0, a=0;
        for (var cx=0;cx<side; cx++) {
          for(var cy=0; cy<side; cy++) {
            var scx = sx + cx - halfside;
            var scy = sy + cy - halfside;
            if (scx >= 0 && scx < sh && scy >= 0 && scy < sw) {
              var sIndex = (scx*sw+scy)*4;
              var wt = kernel[cy*side+cx];
              r+= chunk[sIndex] * wt;
              g+= chunk[sIndex+1] * wt;
              b+= chunk[sIndex+2] * wt;
              // a+= chunk[sIndex+3] * wt;
            }
          }
        }
        dupBuffer[index] = r;
        dupBuffer[index+1] = g;
        dupBuffer[index+2] = b;
        dupBuffer[index+3] = 255; // a + alphaFac*(255-a);
      }
    }
  }


  effects.whoabro = function (chunk, dupBuffer, opts, paramsArray) {

    // type: voijami

    var h = opts.height, w = opts.width,x,y;
    var runs = 5;
    
    while (runs) {

      divdeandconquer({
        start: {h:0, w:0 },
        end: { h: h, w: w}
      });
      runs--;

    }

    function runnit(size) {
      var startH = size.start.h,
          startW = size.start.w,
          endH   = size.end.h,
          endW   = size.end.w;
      for (var x=startH; x < endH; x++) {
        for (var y=startW; y < endW; y++) {
          var index = (x*w+y)*4;
          dupBuffer[index+0]= chunk[index+0 + (x*4)]; 
          dupBuffer[index+1]= chunk[index+1 + (x*4)]; 
          dupBuffer[index+2]= chunk[index+2 + (x*4)]; 
        }
      }
    }


    function divdeandconquer(size) {

      runnit(size);

      if (size.end.h > 20 || size.end.w > 20)
        return;

      var halfOfHeight = parseInt(size.end.h/2, 10), 
          halfOfWidth  = parseInt(size.end.w/2, 10), 
          totalHeight  = parseInt(size.end.h, 10), 
          totalWidth   = parseInt(size.end.w, 10);

          divdeandconquer({start :{h:0, w:0}, end:{h: halfOfHeight, w: halfOfWidth}});
          divdeandconquer({start :{h:0, w:halfOfWidth}, end:{h: halfOfHeight, w: totalWidth}});
          divdeandconquer({start :{h:halfOfHeight, w:0}, end:{h: totalHeight, w: halfOfWidth}});
          divdeandconquer({start :{h:halfOfHeight, w:halfOfWidth}, end:{h: totalHeight, w: totalWidth}});

    }


  }



  effects.swingmapcustom = function (chunk, dupBuffer, opts) { 
    // var chunk = buffer;
    var gamma = opts.depth || 1;
    var h = opts.height, w = opts.width;


    // Done
    var forwardFive = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [5, 5, 5, 10, 10, 10, 15, 15, 15, 20, 20, 20],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    // Done
    var forwardOdd = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [2, 2, 2, 7, 7, 7, 9, 9, 9, 11, 11, 11],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    //  Done
    var backwardFive = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [-5,-5,-5,-10,-10,-10,-15,-15,-15,-20,-20,-20],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }
    // Done
    var backwardOdd = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [-3, -3, -3, -8, -8, -8, -11, -11, -11, -14, -14, -14],
      clip:   [150, 300, 500],
      def:    [150,150,150,150]
    }

     // Done
    var noops = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [0,0,0,0,0,0,0,0,0,0,0,0],
      clip:   [150, 300, 500],
      def:    [150,150,150,150]
    }



  var pattern = [
    1, 1, 0, 0, 0, 0, 0, 0, 3, 
    0, 1, 1, 0, 0, 0, 0, 3, 0, 
    0, 0, 1, 1, 0, 0, 3, 0, 0, 
    0, 0, 0, 1, 1, 3, 0, 0, 0, 
    0, 0, 0, 3, 1, 3, 0, 0, 0, 
    0, 0, 0, 3, 1, 1, 0, 0, 0,
    0, 0, 3, 3, 3, 1, 1, 0, 0,
    0, 0, 3, 0, 0, 0, 1, 1, 0, 
    0, 3, 0, 0, 0, 0, 0, 1, 1,
    3, 0, 0, 0, 0, 0, 0, 0, 1
    ]

    // Hex pattern
  // var pattern = [
  //   2, 2, 2, 2, 2, 2, 2, 2,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   2, 2, 2, 2, 2, 2, 2, 2,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   2, 2, 2, 2, 2, 2, 2, 2,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   2, 2, 2, 2, 2, 2, 2, 2,
  //   0, 0, 0, 0, 0, 0, 0, 0
  // ]
  //   var pattern = [
  //   2, 2, 2, 1, 1, 2, 2, 2,
  //   0, 0, 0, 1, 1, 0, 0, 0,
  //   1, 1, 0, 1, 1, 0, 1, 1,
  //   2, 2, 0, 1, 1, 0, 2, 2,
  //   2, 2, 0, 1, 1, 0, 2, 2,
  //   1, 1, 0, 1, 1, 0, 1, 1,
  //   0, 0, 0, 1, 1, 0, 0, 0,
  //   2, 2, 2, 1, 1, 2, 2, 2
  // ]

  /*  var pattern = [
    2, 2, 1, 1, 1, 1, 2, 2,
    0, 0, 1, 1, 1, 1, 0, 0,
    1, 1, 0, 1, 1, 0, 1, 1,
    2, 2, 0, 1, 1, 0, 2, 2,
    2, 2, 0, 1, 1, 0, 2, 2,
    1, 1, 0, 1, 1, 0, 1, 1,
    0, 0, 1, 1, 1, 1, 0, 0,
    2, 2, 1, 1, 1, 1, 2, 2
  ]*/

  // var pattern = [
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0,
  //   0, 0, 0, 0, 0, 0, 0, 0
  // ]


  // var pattern2 = [
  //   0, 0, 0, 1, 1, 0, 0, 0,
  //   0, 0, 0, 1, 1, 0, 0, 0,
  //   0, 0, 0, 1, 1, 0, 0, 0,
  //   1, 1, 1, 1, 1, 1, 1, 1,
  //   1, 1, 1, 1, 1, 1, 1, 1,
  //   0, 0, 0, 1, 1, 0, 0, 0,
  //   0, 0, 0, 1, 1, 0, 0, 0,
  //   0, 0, 0, 1, 1, 0, 0, 0
  // ]



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

    var min = 0, max = 7, cur = 0;
    var i = 0, j = 0, n = 0;
    for (i = 0; i < h; i++, cur++) {

        if ( cur > max) {
          cur = 0;
        }

        for (j = 0; j < w; j++, n++) {
            
            var index = (i*w*4) + (j*4);
            
            // Pass an rgba objects to the processing function.
            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };
            if (n > max) {
              n = 0;
            }
            // if (n >= pattern.length) {
            //   n = 0;
            // }
            var switcher = pattern[cur + n];

            switch (switcher) {
              case 3: channelSwing(rgba, index, backwardFive); break;
              case 2: channelSwing(rgba, index, forwardOdd); break;
              case 1: channelSwing(rgba, index, forwardFive); break;
              case 0: channelSwing(rgba, index, noops); break;
              default: channelSwing(rgba, index, backwardFive); break;
            }
            chunk[index + 3] = 255;

        }
    }
  }




  effects.map_smosh = function (chunk, dupBuffer, opts, paramsArray) {
      var opts = opts || {};
      var h = opts.height, w = opts.width;

      var paramsArray = paramsArray || chunk;    
    
      var length = chunk.length;

      for( var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
          var index = (i*w*4) + (j*4);
          var rgb = {r: paramsArray[index], g: paramsArray[index+1], b: paramsArray[index+2]};
          var colorvalue = rgb.r + rgb.b + rgb.b;
          
          if (j % (w-1) === 0 ) {
            dupBuffer[index+0] = chunk[index+0]
            dupBuffer[index+1] = chunk[index+1]
            dupBuffer[index+2] = chunk[index+2]
            dupBuffer[index+3] = 255;
            continue;
          }
          if (colorvalue > 100) {
            dupBuffer[index+0] = chunk[index - (19*4)+1] || 255;
            dupBuffer[index+1] = chunk[index + (20*4)+2] || 0;
            dupBuffer[index+2] = chunk[index - (4 *4)+0] || 255;
            dupBuffer[index+3] = 255; 
          } else if (colorvalue > 50){
            dupBuffer[index+0] = chunk[index - (13*4)+2] || 255;
            dupBuffer[index+1] = chunk[index + (15*4)+0] || 255;
            dupBuffer[index+2] = chunk[index + (4 *4)+1] || 0;
            dupBuffer[index+3] = 255; 
          } else {
            dupBuffer[index+0] = chunk[index + (7*4)+2] || 0;
            dupBuffer[index+1] = chunk[index + (4*4)+0] || 255;
            dupBuffer[index+2] = chunk[index - (10 *4)+1] || 255;
            dupBuffer[index+3] = 255; 
          }
        }
      }
  }



  effects.map_drift = function (chunk, dupBuffer, opts, paramsArray) {

        // type: drift;

    
    var gamma = opts.depth || 1;
    var x,y;
    var threshold = parseInt(opts.threshold) || 50;
    var paramsArray = paramsArray || chunk; 
    var x = opts.height, y = opts.width;
    var mode = colorObjectFromColorString(opts.color) || {r: 200, g:200, b:200};
      mode.swap = false;

    // LOOSE
    function checkValues (color, toggle) {
      // console.log(color, toggle);
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
              r : paramsArray[index + 0], 
              g : paramsArray[index + 1], 
              b : paramsArray[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );


        }

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
            dupBuffer[index + 0] = color.r;
            dupBuffer[index + 1] = color.g;
            dupBuffer[index + 2] = color.b;
            dupBuffer[index + 3] = 255;
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          } 
          
        }

    }

  }



  effects.kodachromatic = function (chunk, dupBuffer, opts, paramsArray) {

    var w = opts.width, h = opts.height, index;
    var xslope = 1; var yslope = 1;

    for ( var x = 0; x < w; x += xslope) {
      for (var y = 0; y < h; y += yslope) {
        index = (x*h+y) * 4;

        var r = chunk[index+0] * 1.5;
        var g = chunk[index+1] * 0.95;
        var b = chunk[index+2] * 0.35;
        var avg = Math.round( (r + b + g) / 3);
        dupBuffer[index+0] = avg;
        dupBuffer[index+1] = avg;
        dupBuffer[index+2] = avg;
      }
    }
  }


  effects.panochromatic = function (chunk, dupBuffer, opts, paramsArray) {

    var w = opts.width, h = opts.height, index;
    var xslope = 1; var yslope = 1;

    for ( var x = 0; x < w; x += xslope) {
      for (var y = 0; y < h; y += yslope) {
        index = (x*h+y) * 4;

        var r = chunk[index+0] * 0.45;
        var g = chunk[index+1] * 1.05;
        var b = chunk[index+2] * 1.35;
        var avg = Math.round( (r + b + g) / 3);
        dupBuffer[index+0] = avg;
        dupBuffer[index+1] = avg;
        dupBuffer[index+2] = avg;
      }
    }
  }


  effects.lithochromatic = function (chunk, dupBuffer, opts, paramsArray) {

    var w = opts.width, h = opts.height, index;
    var xslope = 1; var yslope = 1;

    for ( var x = 0; x < w; x += xslope) {
      for (var y = 0; y < h; y += yslope) {
        index = (x*h+y) * 4;

        var r = chunk[index+0] * 0.00;
        var g = chunk[index+1] * 1.05;
        var b = chunk[index+2] * 1.45;
        var avg = Math.round( (r + b + g) / 3);
        dupBuffer[index+0] = avg;
        dupBuffer[index+1] = avg;
        dupBuffer[index+2] = avg;
      }
    }
  }


  effects.orthochromatic = function (chunk, dupBuffer, opts, paramsArray) {

    var w = opts.width, h = opts.height, index;
    var xslope = 1; var yslope = 1;

    for ( var x = 0; x < w; x += xslope) {
      for (var y = 0; y < h; y += yslope) {
        index = (x*h+y) * 4;

        var r = chunk[index+0] * 0.10;
        var g = chunk[index+1] * 1.05;
        var b = chunk[index+2] * 1.45;
        var avg = Math.round( (r + b + g) / 3);
        dupBuffer[index+0] = avg;
        dupBuffer[index+1] = avg;
        dupBuffer[index+2] = avg;
      }
    }
  }


  effects.blgle = function ( chunk, dupBuffer, opts) {
    var color1 = opts.color || {r:0, g:0, b:0};

    var x = opts.height, y = opts.width, index;

    for (var i = 0; i < x; i++) {
      for (var j = 0; j < y; j++) {
        index = (i*y+j)*4;

        dupBuffer[index + 0] = ( chunk[index + 0] << 1 ) & 255 + ( color1.r % chunk[index + 0] )
        dupBuffer[index + 1] = ( chunk[index + 1] << 1 ) & 255 + ( color1.r % chunk[index + 1] )
        dupBuffer[index + 2] = ( chunk[index + 2] << 1 ) & 255 + ( color1.r % chunk[index + 2] )
        dupBuffer[index + 3] = 4;



      }

    }


  }




  effects.twistocity = function ( chunk, dupBuffer, opts ) {
    
    // point-inversitive
    // Turn this into a blend mode
    var h = opts.height, w = opts.width, x,y;
    
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    // var angle = degree2Radian(36);
    // var r = 400;
    var h2 = h/2;
    var w2 = w/2;
    function cartx(r, a) {
      return r*Math.cos(a);
    }
    function carty(r, a) {
      return r*Math.sin(a);
    }
    function degree2Radian(degrees) {
      return degrees * Math.PI / 180;
    }
    function radian2Degree(radians) {
      return radians * 180 / Math.PI;
    }
    // var r = w2 + h2;
    // new[x,y] = old[cartx(sqrt(r*400),a), carty(sqrt(r*400), a)];
    // chunk = chunk.reverse();
    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var angle = Math.atan2(y,x);
        var r = Math.sqrt(y*y + x*x);
        // polar to cart
        var cx = cartx(r,angle);
        var cy = carty(r,angle+r/3);
        // var carto = [angle, r];
        var index = Math.round(x*w+y);
        var sIndex =  Math.round( cx * w + cy);
        clone[index] = pixels[sIndex];
      }
    }
  }




  effects.spirility = function ( chunk, dupBuffer, opts) {

    // degenerative

    var h = opts.height, w = opts.width, x,y;

    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var l = pixels.length;
    var x = 0, y = 0, dx = 0, dy = -1;
    var t = Math.max(w,h);
    var maxI = t*t;
    var maxDistance = h * w;
    var n = 0;


    function getNext() {
      return pixels[n++];
    }

    var a = -h/2;
    var b = h/2;
    var c = -w/2;
    var d = w/2;

    var cx = Math.round(h/2);
    var cy = Math.round(w/2);

    for (var i = 0; i < maxI; i++) {
      if ( (a <= x ) && (x <= b) && ( c <= y ) && (y <= d)) {
        var index = (cx + x) * w + (cy+ y);
        if (index < 0 || index > maxDistance) {
          // console.log('skipping!', i)
          --i;
        } else {
          clone[index] = getNext();      
        }
      }

      if ((x == y) || ((x < 0) && (x == -y)) || ((x > 0) && (x == 1-y))) {
        t=dx; dx=-dy; dy=t;
      }
      x+=dx; y+=dy;
    }

  }


  effects.orbo = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // point-inversitive
    // Turn this into a blend mode
    var h = opts.height, w = opts.width, x,y;
    var h2 = h/2;
    var w2 = w/2;
    var data = new Uint32Array(chunk.buffer);
    // var r = w2 + h2;
    // new[x,y] = old[cartx(sqrt(r*400),a), carty(sqrt(r*400), a)];

    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var index = (x*w+y)*4;
        var tIndex = (x*w+y);
        var sIndex = Math.round( tIndex - extractBrightnessLSB(data[tIndex])/4) * 4;
        dupBuffer[index]   = chunk[sIndex];
        dupBuffer[index+1] = chunk[sIndex+1];
        dupBuffer[index+2] = chunk[sIndex+2];
        dupBuffer[index+3] = 255;
      }
    }
  }



  effects.disperse = function ( chunk, dupBuffer, opts, paramsArray ) {
    

    var h = opts.height, w = opts.width, x,y;
    var h2 = h/2;
    var w2 = w/2;
    // var r = w2 + h2;
    // new[x,y] = old[cartx(sqrt(r*400),a), carty(sqrt(r*400), a)];
    var data = new Uint32Array(chunk.buffer);
    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var index = (x*w+y)*4;
        var tIndex = (x*w+y);
        var sIndex = Math.round( tIndex - extractBrightnessLSB(data[tIndex])/4) * 4;
        dupBuffer[sIndex]   = chunk[index];
        dupBuffer[sIndex+1] = chunk[index+1];
        dupBuffer[sIndex+2] = chunk[index+2];
        dupBuffer[index+3] = 255;
      }
    }
  }



  effects.polarice = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // point-inversitive
    // Turn this into a blend mode
    var h = opts.height, w = opts.width, x,y;
    var angle = degree2Radian(36);
    var r = 400;
    var h2 = h/2;
    var w2 = w/2;
    function cartx(r, a) {
      return r*Math.cos(a);
    }
    function carty(r, a) {
      return r*Math.sin(a);
    }
    function degree2Radian(degrees) {
      return degrees * Math.PI / 180;
    }
    function radian2Degree(radians) {
      return radians * 180 / Math.PI;
    }
    // var r = w2 + h2;
    // new[x,y] = old[cartx(sqrt(r*400),a), carty(sqrt(r*400), a)];
    // chunk = chunk.reverse();
    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var angle = Math.atan2(y,x);
        var r = Math.sqrt(y*y + x*x);
        // polar to cart
        var cx = cartx( Math.sqrt(r*400),angle);
        var cy = carty( Math.sqrt(r*400),angle);
        // var carto = [angle, r];
        var index = (x*w+y)*4;
        var sIndex = ( Math.round(cx) * w + Math.round(cy) ) *4;
        dupBuffer[index]   = chunk[sIndex];
        dupBuffer[index+1] = chunk[sIndex+1];
        dupBuffer[index+2] = chunk[sIndex+2];
        dupBuffer[index+3] = 255;
      }
    }
  }


  effects.polarslice = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // point-inversitive
    // Turn this into a blend mode
    var h = opts.height, w = opts.width, x,y;
    var angle = degree2Radian(36);
    var r = 400;
    var h2 = Math.round(h/2);
    var w2 = Math.round(w/2);
    function cartx(r, a) {
      return r*Math.cos(a);
    }
    function carty(r, a) {
      return r*Math.sin(a);
    }
    function degree2Radian(degrees) {
      return degrees * Math.PI / 180;
    }
    function radian2Degree(radians) {
      return radians * 180 / Math.PI;
    }
    // var r = w2 + h2;
    // new[x,y] = old[cartx(sqrt(r*400),a), carty(sqrt(r*400), a)];
    // chunk = chunk.reverse();
    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var angle = Math.atan2(y,x);
        var r = Math.sqrt(y*y + x*x);
        // polar to cart
        var cx = cartx( Math.sqrt(r*400),angle);
        var cy = carty( Math.sqrt(r*400),angle);
        // var carto = [angle, r];
        var index = (x*w+y)*4;
        // var sIndex = ( Math.round(cx) * w + Math.round(cy) ) *4;
        var sIndex = ( Math.round(cx + h2) * w + Math.round(cy + w2) ) *4;
        dupBuffer[index]   = chunk[sIndex];
        dupBuffer[index+1] = chunk[sIndex+1];
        dupBuffer[index+2] = chunk[sIndex+2];
        dupBuffer[index+3] = 255;
      }
    }
  }


  effects.shrink = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // point-inversitive
    // Turn this into a blend mode
    var h = opts.height, w = opts.width, x,y;
   

    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var index = (x*w+y)*4;
        var sIndex = ((x*2)%(h+1) * w + (y*2)%(w+1))*4;
        var r = chunk[index];
        var g = chunk[index+1];
        var b = chunk[index+2];
        dupBuffer[index]   = chunk[sIndex];
        dupBuffer[index+1] = chunk[sIndex+1];
        dupBuffer[index+2] = chunk[sIndex+2];
        dupBuffer[index+3] = 255;
      }
    }
  }


  effects.stretch = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // point-inversitive
    // Turn this into a blend mode
    var h = opts.height, w = opts.width, x,y;
    var paramsArray = paramsArray || chunk;
    var dupBuffer = new Uint8Array(chunk.length);

    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var index = (x*w+y)*4;
        var sIndex = (Math.round(x/2)*w+y)*4;
        var r = chunk[index];
        var g = chunk[index+1];
        var b = chunk[index+2];
        dupBuffer[index]   = chunk[sIndex];
        dupBuffer[index+1] = chunk[sIndex+1];
        dupBuffer[index+2] = chunk[sIndex+2];
        dupBuffer[index+3] = 255;
      }
    }
  }






  effects.boost = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;

    for (var i = 0, l = chunk.length; i < l; i+=4) {

      dupBuffer[i] = Math.round(255 * Math.log(chunk[i])/Math.log(255));
      dupBuffer[i+1] = Math.round(255 * Math.log(chunk[i+1])/Math.log(255));
      dupBuffer[i+2] = Math.round(255 * Math.log(chunk[i+2])/Math.log(255));
      dupBuffer[i+3] = 255;
    }
  }




  effects.solarization = function ( chunk, dupBuffer, opts, paramsArray ) {
    
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



  effects.solar_gradient = function ( chunk, dupBuffer, opts, paramsArray ) {
    
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



  effects.solar_gradient_map = function ( chunk, dupBuffer, opts, paramsArray ) {
    
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


  effects.releif = function ( chunk, dupBuffer, opts, paramsArray ) {
    

    var h = opts.height, w = opts.width, x,y;
    var paramsArray = paramsArray || chunk;

    for (var x = 0; x < w; x++ ) {
      for (var y = 0; y < h; y++) {
        var index = (x*h+y)*4;
        var sIndex = ((x+1)*h+(y+1))*4;
        var r = chunk[index];
        var g = chunk[index+1];
        var b = chunk[index+2];
        dupBuffer[index]   = r + (255/2 - chunk[ sIndex ]);
        dupBuffer[index+1] = g + (255/2 - chunk[ sIndex+1 ]);
        dupBuffer[index+2] = b + (255/2 - chunk[ sIndex+2 ]);
        dupBuffer[index+3] = 255;
      }
    }

  }



  effects.archez_horizontal = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;

    // Horizontal
    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        // var Z = 255;
        var Z = chunk[index];
        var color = ( Z  * Math.abs(x%Math.sin(y))>10) ? 0 : 255;
        dupBuffer[index]   = color;
        dupBuffer[index+1] = color;
        dupBuffer[index+2] = color;
        dupBuffer[index+3] = 255;
      }
    }

  }



  effects.archez_diagonal = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;

   

    // Diagonal
    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        // var Z = 255;
        var Z = chunk[index];
        var color = ( Z  * Math.abs(y%Math.sin(x))>10) ? 0 : 255;
        dupBuffer[index]   = color;
        dupBuffer[index+1] = color;
        dupBuffer[index+2] = color;
        dupBuffer[index+3] = 255;
      }
    }

  }





  effects.lazer_horizontal = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;

    // Horizontal
    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        var color = ((y%(5+y/25))>5)?0:255;
        dupBuffer[index]   = color;
        dupBuffer[index+1] = color;
        dupBuffer[index+2] = color;
        dupBuffer[index+3] = 255;
      }
    }

  }




  effects.lazer_diagonal = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;

    // Diagonal
    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        var color = ((x%(5+y/25))>5)?0:255;
        dupBuffer[index]   = color;
        dupBuffer[index+1] = color;
        dupBuffer[index+2] = color;
        dupBuffer[index+3] = 255;
      }
    }

  }





  effects.trig_contrast = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: contrast

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   Math.round((Math.atan(x-h,y-w)*chunk[index  ])/360)
        dupBuffer[index+1] = Math.round((Math.atan(x-h,y-w)*chunk[index+1])/360)
        dupBuffer[index+2] = Math.round((Math.atan(x-h,y-w)*chunk[index+2])/360)
        dupBuffer[index+3] = 255;
      }
    }
  }



  effects.ridges = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   y+Math.round((Math.sin(x)*255)/2);
        dupBuffer[index+1] = y+Math.round((Math.sin(x)*255)/2);
        dupBuffer[index+2] = y+Math.round((Math.sin(x)*255)/2);
        dupBuffer[index+3] = 255;
      }
    }

  }


  effects.risged = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   y+(Math.sin(x)*chunk[index]/2);
        dupBuffer[index+1] = y+(Math.sin(x)*chunk[index]/2);
        dupBuffer[index+2] = y+(Math.sin(x)*chunk[index]/2);
        dupBuffer[index+3] = 255;
      }
    }

  }



  effects.moire = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   (x*y)%(chunk[index]   + 1);
        dupBuffer[index+1] = (x*y)%(chunk[index+1] + 1);
        dupBuffer[index+2] = (x*y)%(chunk[index+2] + 1);
        dupBuffer[index+3] = 255;
      }
    }

  }



  effects.moire_static_rgb = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   (chunk[index]*x*y)/  (h-1)*(w-1);
        dupBuffer[index+1] = (chunk[index+1]*x*y)/(h-1)*(w-1);
        dupBuffer[index+2] = (chunk[index+2]*x*y)/(h-1)*(w-1);
        dupBuffer[index+3] = 255;
      }
    }

  }

  effects.moire_static_bw = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: noise

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   (chunk[index]*x*y)/(h-1)*(w-1);
        dupBuffer[index+1] = (chunk[index]*x*y)/(h-1)*(w-1);
        dupBuffer[index+2] = (chunk[index]*x*y)/(h-1)*(w-1);
        dupBuffer[index+3] = 255;
      }
    }
  }



  effects.shape_blade = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: destructive
    
    var h = opts.height, w = opts.width, x,y;
    var X,Y,Z;

    X = h, Y = w, Z = 255;


    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y) * 4;
        dupBuffer[index] =   x%y;
        dupBuffer[index+1] = x%y;
        dupBuffer[index+2] = x%y;
        dupBuffer[index+3] = Z;
      }
    }

  }




  effects.signal_interference = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: expiremental

    var h = opts.height, w = opts.width, x,y;
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var f64a = new Float64Array(clone.buffer);
    var dl = data.length;
    var fl = f64a.length

    function makeAnLSBColor(r, g, b) {
   
      var n = new Uint32Array(1);
          n[0] = (255 << 24) | ( b << 16) | ( g << 8) | r;
      return n[0]
    }


    if (isLSB()) {
      for (var i = 0; i < fl; i++) {
        var u32c = data[i*2];
        f64a[i] = (w*h) / u32c;
       
      }
   
      for (var i = 0; i < dl; i++) {
        u32c = clone[i];
        var r = (u32c &0xff);
        var g = (u32c >>  8) &0xff;
        var b = (u32c >> 16) &0xff;
        clone[i] = (0xFF << 24) | (b << 16) | (g << 8) | r;
      }

    } else {
      for (var i = 0; i < dl; i++) {     
        u32c = clone[i];
        var r = (u32c >> 24) &0xff;
        var g = (u32c >> 16) &0xff;
        var b = (u32c >>  8) &0xff;

        clone[i] = (r << 24) | (g << 16) | (b << 8) | 255;
      }
    }

  }



  effects.funkyjunk = function (chunk, dupBuffer, opts, paramsArray) {

    // type: contrast

    var h = opts.height, w = opts.width, x,y,r,g,b;
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    if (isLSB()) {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = (Math.log( (u32c&0xFF) + 1)          * 32 >> 0 );
          g = (Math.log( ((u32c >>  8) &0xFF) + 1) * 32 >> 0 );
          b = (Math.log( ((u32c >> 16) &0xFF) + 1) * 32 >> 0 );

          clone[index] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
    } else {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = (Math.log( ((u32c >> 24) &0xFF) + 1) * 32 >> 0 );
          g = (Math.log( ((u32c >> 16) &0xFF) + 1) * 32 >> 0 );
          b = (Math.log( ((u32c >>  8) &0xFF) + 1) * 32 >> 0 );

          clone[index] = (r << 24) | (g << 16) | (b << 8) | 255;
        }
      }
    }
  }




  effects.junkyfunk = function (chunk, dupBuffer, opts, paramsArray) {

    var h = opts.height, w = opts.width, x,y,r,g,b;
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    if (isLSB()) {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = (Math.log10( (u32c        &0xFF)  + 1) * 32 >> 0 );
          g = (Math.log10( ((u32c >>  8) &0xFF) + 1) * 32 >> 0 );
          b = (Math.log10( ((u32c >> 16) &0xFF) + 1) * 32 >> 0 );

          clone[index] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
    } else {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = (Math.log10( ((u32c >> 24) &0xFF) + 1)          * 32 >> 0 ) - 1;
          g = (Math.log10( ((u32c >> 16) &0xFF) + 1) * 32 >> 0 );
          b = (Math.log10( ((u32c >>  8) &0xFF) + 1) * 32 >> 0 );

          clone[index] = (r << 24) | (g << 16) | (b << 8) | 255;
        }
      }
    }
  }







  effects.eightbit = function (chunk, dupBuffer, opts, paramsArray) {

    // type: colorspace

    var h = opts.height, w = opts.width, x,y,r,g,b;
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var lut = [50, 60, 70, 90, 120, 145, 200 , 250]; // light-biased

    if (isLSB()) {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = lut[(Math.log2( (u32c         &0xFF) + 1) >> 0 )];
          g = lut[(Math.log2( ((u32c >>  8) &0xFF) + 1) >> 0 )];
          b = lut[(Math.log2( ((u32c >> 16) &0xFF) + 1) >> 0 )];

          clone[index] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
    } else {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = lut[(Math.log2( ((u32c >> 24) &0xFF) + 1) >> 0 )];
          g = lut[(Math.log2( ((u32c >> 16) &0xFF) + 1) >> 0 )];
          b = lut[(Math.log2( ((u32c >>  8) &0xFF) + 1) >> 0 )];

          clone[index] = (r << 24) | (g << 16) | (b << 8) | 255;
        }
      }
    }
  }



  effects.log10_bits_contrast = function (chunk, dupBuffer, opts, paramsArray) {


  // type: colorspace

    var h = opts.height, w = opts.width, x,y,r,g,b;
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);

    var lut = [50, 60, 70, 90, 120, 145, 200 , 250]; // light-biased

    if (isLSB()) {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = lut[(Math.log10( (u32c&0xFF) + 1)          >> 0 )];
          g = lut[(Math.log10( ((u32c >>  8) &0xFF) + 1) >> 0 )];
          b = lut[(Math.log10( ((u32c >> 16) &0xFF) + 1) >> 0 )];

          clone[index] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
    } else {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = lut[(Math.log10( ((u32c >> 24) &0xFF) + 1) >> 0 )];
          g = lut[(Math.log10( ((u32c >> 16) &0xFF) + 1) >> 0 )];
          b = lut[(Math.log10( ((u32c >>  8) &0xFF) + 1) >> 0 )];

          clone[index] = (r << 24) | (g << 16) | (b << 8) | 255;
        }
      }
    }
  }


  effects.log2_bits_collapse = function (chunk, dupBuffer, opts, paramsArray) {


  // type: colorspace

    var h = opts.height, w = opts.width, x,y,r,g,b;
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var lut = [50, 60, 70, 90, 120, 145, 200 , 250]; // light-biased

    if (isLSB()) {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = lut[(Math.log2( (u32c&0xFF) + 1)          >> 0 )];
          g = lut[(Math.log2( ((u32c >>  8) &0xFF) + 1) >> 0 )];
          b = lut[(Math.log2( ((u32c >> 16) &0xFF) + 1) >> 0 )];

          clone[index] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
    } else {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = lut[(Math.log2( ((u32c >> 24) &0xFF) + 1) >> 0 )];
          g = lut[(Math.log2( ((u32c >> 16) &0xFF) + 1) >> 0 )];
          b = lut[(Math.log2( ((u32c >>  8) &0xFF) + 1) >> 0 )];

          clone[index] = (r << 24) | (g << 16) | (b << 8) | 255;
        }
      }
    }
  }



  effects.log_bits_short = function (chunk, dupBuffer, opts, paramsArray) {

  // type: colorspace

    var h = opts.height, w = opts.width, x,y,r,g,b;
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var lut = [50, 60, 70, 90, 120, 145, 200 , 250]; // light-biased

    if (isLSB()) {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = lut[(Math.log( (u32c&0xFF) + 1)          >> 0 )];
          g = lut[(Math.log( ((u32c >>  8) &0xFF) + 1) >> 0 )];
          b = lut[(Math.log( ((u32c >> 16) &0xFF) + 1) >> 0 )];

          clone[index] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
    } else {
      for (var x = 0; x < h; x++) {
        for (var y = 0; y < w; y++ ) {
          var index = x * w +y;
          var u32c = pixels[index];

          r = lut[(Math.log( ((u32c >> 24) &0xFF) + 1) >> 0 )];
          g = lut[(Math.log( ((u32c >> 16) &0xFF) + 1) >> 0 )];
          b = lut[(Math.log( ((u32c >>  8) &0xFF) + 1) >> 0 )];

          clone[index] = (r << 24) | (g << 16) | (b << 8) | 255;
        }
      }
    }
  }



  effects.zoomth = function (chunk, dupBuffer, opts, paramsArray) {
    
    // magnify by 4x

    var opts = opts || {};
    var pixels = new Uint32Array(chunk.buffer);
    var length = pixels.length - 1;
    var clone = new Uint32Array(dupBuffer.buffer);
      
    var i = 1, n = 1;
    
    if (isLSB()) {
      while (n < length) {
      // LSB
        var u32c  = pixels[i];
        var u32cN = pixels[i+1];
        var u32cP = pixels[i-1];
        
        var r = (u32c &0xff);
        var g = (u32c >> 8) &0xff;
        var b = (u32c >> 16) &0xff;

        var r1 = (u32cN &0xff); 
        var g1 = (u32cN >> 8) &0xff;
        var b1 = (u32cN >> 16) &0xff;

        var r2 = (u32cP &0xff); 
        var g2 = (u32cP >> 8) &0xff;
        var b2 = (u32cP >> 16) &0xff;

        var loginatorR = ((r + r1 + r2) / Math.log2(r + r1 + r2)) >> 0;
        var loginatorG = ((g + g1 + g2) / Math.log2(g + g1 + g2)) >> 0;
        var loginatorB = ((b + b1 + b2) / Math.log2(b + b1 + b2)) >> 0;


        var xndf = (255 << 24) | ( loginatorB << 16) | ( loginatorG << 8) | loginatorR;

        clone[n] = u32c;
        clone[n+1] = xndf;
        clone[n+2] = u32cP;
        clone[n+3] = u32c;
        ++i;
        n+=4;

      }
    } else {
      while (n < length) {

      // MSB
        var u32c  = pixels[i];
        var u32cN = pixels[i+1];
        var u32cP = pixels[i-1];
        
        var r = (u32c >> 24) &0xFF;
        var g = (u32c >> 16) &0xff;
        var b = (u32c >>  8) &0xff;
        
        var r1 = (u32cN >> 24) &0xFF;
        var g1 = (u32cN >> 16) &0xff;
        var b1 = (u32cN >>  8) &0xff;
        
        var r2 = (u32cP >> 24) &0xFF;
        var g2 = (u32cP >> 16) &0xff;
        var b2 = (u32cP >>  8) &0xff;
        
        var loginatorR = ((r + r1 + r2) / Math.log2(r + r1 + r2)) >> 0;
        var loginatorG = ((g + g1 + g2) / Math.log2(g + g1 + g2)) >> 0;
        var loginatorB = ((b + b1 + b2) / Math.log2(b + b1 + b2)) >> 0;

        (r << 24) | (g << 16) | (b << 8) | 255;
         
        clone[n] = u32c;
        clone[n+1] = xndf;
        clone[n+2] = u32cP;
        clone[n+3] = u32c;
        ++i;
        n+=4;
      }
    }
  }





  effects.zoomp = function (chunk, dupBuffer, opts, paramsArray) {
    
    // resize by 3x

    var opts = opts || {};
    var pixels = new Uint32Array(chunk.buffer);
    var length = pixels.length;
    var clone = new Uint32Array(dupBuffer.buffer);

    function zoompData32LSB_1st(u32c) {
      var r = (u32c &0xff);
      var g = (u32c >> 8) &0xff;
      var b = (u32c >> 16) &0xff;

      r = Math.max(r - 127, 0);
      g = Math.min(g - Math.floor(g/2), 255);
      b = Math.min(b + Math.floor(b/2), 255);

      return (255 << 24) | (b << 16) | (g << 8) | r;

    }

    function zoompData32LSB_2nd(u32c) {
      var r = (u32c &0xff);
      var g = (u32c >> 8) &0xff;
      var b = (u32c >> 16) &0xff;

      r = Math.max(r - 127, 0);
      g = Math.min(g - Math.floor(b/2), 255);
      b = Math.min(b - Math.floor(b/2), 255);

      return (255 << 24) | (b << 16) | (g << 8) | r;

    }

    function zoompData32MSB_1st(u32c) {
      var r = (u32c >> 24) &0xFF;
      var g = (u32c >> 16) &0xff;
      var b = (u32c >>  8) &0xff;
      
      r = r - 127;
      g = g - Math.floor(g/2);
      b = b + Math.floor(b/2);

      return (r << 24) | (g << 16) | (b << 8) | 255;
    }

    function zoompData32MSB_2nd(u32c) {
      var r = (u32c >> 24) &0xFF;
      var g = (u32c >> 16) &0xff;
      var b = (u32c >>  8) &0xff;
      
      r = r - 127;
      g = g - Math.floor(b/2);
      b = b + Math.floor(b/2);

      return (r << 24) | (g << 16) | (b << 8) | 255;
    }

    var i = 0, n = 0;

    if (isLSB()) {
      while (n < length) {
        clone[n++] = pixels[i];
        clone[n++] = zoompData32LSB_1st(pixels[i]);
        clone[n++] = zoompData32LSB_2nd(pixels[i]);
        i++;
      }
    } else {
      while (n < length) {
        clone[n++] = pixels[i];
        clone[n++] = zoompData32MSB_1st(pixels[i]);
        clone[n++] = zoompData32MSB_2nd(pixels[i]);
        i++;
      }
    }
  }


  // ======================================
  // Copy

  // ======================================
  // Contrast

  // ======================================
  // Destructive

  // ======================================
  // Shapes




  // ======================================
  // Channelshift


  effects.rgb_bgr = function ( chunk, dupBuffer, opts ) {
    
    // type: channelshift

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var dl = data.length, i;

    if (isLSB()) {
      for (var i = 0; i < dl; i++) {
        var n = data[i];
        // var a = (n >> 24) &0xFF;
        var b = (n >> 16) &0xFF;
        var g = (n >>  8) &0xFF;
        var r = (n) &0xFF;

        clone[i] = (255 << 24) | (r << 16) | (g << 8) | b;
      }

    } else {

      for (var i = 0; i < dl; i++) {
        var n = data[i];
        var r = (n >> 24) &0xFF;
        var g = (n >> 16) &0xFF;
        var b = (n >>  8) &0xFF;
        // var a = (n) &0xFF;

        clone[i] = (b << 24) | (  g << 16) | (  r <<  8) | 255;
      }

    }

  }



  effects.rgb_grb = function ( chunk, dupBuffer, opts ) {
    
    // type: channelshift


    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var dl = data.length, i;

    if (isLSB()) {
      for (var i = 0; i < dl; i++) {
        var n = data[i];
        // var a = (n >> 24) &0xFF;
        var b = (n >> 16) &0xFF;
        var g = (n >>  8) &0xFF;
        var r = (n) &0xFF;

        clone[i] = (255 << 24) | (b << 16) | (r << 8) | g;
      }

    } else {

      for (var i = 0; i < dl; i++) {
        var n = data[i];
        var r = (n >> 24) &0xFF;
        var g = (n >> 16) &0xFF;
        var b = (n >>  8) &0xFF;
        // var a = (n) &0xFF;

        clone[i] = (g << 24) | (  r << 16) | (  b <<  8) | 255;
      }

    }

  }




  effects.rgb_brg = function ( chunk, dupBuffer, opts ) {
    
    // type: channelshift

    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var dl = data.length, i;

    if (isLSB()) {
      for (var i = 0; i < dl; i++) {
        var n = data[i];
        // var a = (n >> 24) &0xFF;
        var b = (n >> 16) &0xFF;
        var g = (n >>  8) &0xFF;
        var r = (n) &0xFF;

        clone[i] = (255 << 24) | (g << 16) | (r << 8) | b;
      }

    } else {

      for (var i = 0; i < dl; i++) {
        var n = data[i];
        var r = (n >> 24) &0xFF;
        var g = (n >> 16) &0xFF;
        var b = (n >>  8) &0xFF;
        // var a = (n) &0xFF;

        clone[i] = (b << 24) | (  r << 16) | (  g <<  8) | 255;
      }

    }

  }




  // ======================================
  // Pixelsort


  effects.floatsort_distortion = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: pixelsort
    
    var x,y;
    var h = opts.height, w = opts.width;
    var chunk32, n, ab, dv, u32c, f64c;

    var chunk32 = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var n = chunk.byteLength + (chunk.byteLength % 8);
    var ab = new ArrayBuffer(n);
    var u8c = new Uint8Array(ab);
    var u32c = new Uint32Array(ab);
    var f64c = new Float64Array(ab);

    for (var i = 0,l = chunk32.length; i <l; i++ ) {
      u32c[i] = chunk32[i];
    }

    var pixels = new Float64Array(u32c.buffer);
    var threshold = parseInt(opts.threshold, 10) || 50;
    
    function sortFun (a,b) { return a-b;};
    
    var halfh  = Math.round(h/2);
    var halfw  = Math.round(w/2);

    for (var x = 0; x < w; x++ ) {

      var unsorted = new Float64Array( halfh );
      var sorted = new Float64Array( halfh );

      for (var y = 0; y < halfh; y++ ) {
        var index = x * halfh + y;
        unsorted[y] = pixels[index];
      }

      sorted.set( unsorted.sort(sortFun) );

      for(var y = 0; y < halfh; y++) {
        var index = x * halfh + y;
        pixels[index] = sorted[y];
      }

    }

    for (var i = 0,l = clone.length; i <l; i++ ) {
      clone[i] = u32c[i];
    }

  }



  effects.floatsort = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: pixelsort
    
    var x,y;
    var h = opts.height, w = opts.width;
    var chunk32, n, ab, dv, u32c, f64c;

    var chunk32 = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var n = chunk.byteLength + (chunk.byteLength % 8);
    var ab = new ArrayBuffer(n);
    var u8c = new Uint8Array(ab);
    var u32c = new Uint32Array(ab);
    var f64c = new Float64Array(ab);

    for (var i = 0,l = chunk32.length; i <l; i++ ) {
      u32c[i] = chunk32[i];
    }

    var pixels = new Float64Array(u32c.buffer);
    var threshold = parseInt(opts.threshold, 10) || 50;
    
    function sortFun (a,b) { return a-b;};
    
    var halfh  = Math.round(h/2);
    var halfw  = Math.round(w/2);

    for (var x = 0; x < h; x++ ) {

      var unsorted = new Float64Array( halfw );
      var sorted = new Float64Array( halfw );

      for (var y = 0; y < halfw; y++ ) {
        var index = x * halfw + y;
        unsorted[y] = pixels[index];
      }

      sorted.set( unsorted.sort(sortFun) );

      for(var y = 0; y < halfw; y++) {
        var index = x * halfw + y;
        pixels[index] = sorted[y];
      }

    }
    
    for (var i = 0,l = clone.length; i <l; i++ ) {
      clone[i] = u32c[i];
    }

  }






  effects.fisher_yates_shuffle = function (chunk, dupBuffer, opts, paramsArray) {

    // type: pixelsort class: shuffle

    var h = opts.height, w = opts.width;
    var totalPixels = (h * w * 4);
    var t = {r:0, g:0, b:0};
    
      for (var i = totalPixels-1; i--;) {
        var j = Math.floor(Math.random() * (i+1) );
        
        var t =  { r: chunk[i+0], g: chunk[i+1], b: chunk[i+2] };
        
        dupBuffer[i+0] = chunk[j+0];
        dupBuffer[i+1] = chunk[j+1];
        dupBuffer[i+2] = chunk[j+2];
        
        dupBuffer[j+0] = t.r;
        dupBuffer[j+1] = t.g;
        dupBuffer[j+2] = t.b;
      }

  }



  effects.fisher_yates_shuffle_horizontal = function (chunk, dupBuffer, opts, paramsArray) {

    // type: pixelsort, class: shuffle

    var h = opts.height, w = opts.width;
    for( var i = 0; i < h; i++) {

      for (var j = w-1; j--; ) {
        var r = Math.floor(Math.random() * (j+1) );
        var index =  (i*w*4) + (j*4);
        var rIndex = (i*w*4) + (r*4);
        var t =  { 
          r: chunk[index+0], 
          g: chunk[index+1], 
          b: chunk[index+2] 
        };

        dupBuffer[index+0] = chunk[rIndex+0];
        dupBuffer[index+1] = chunk[rIndex+1];
        dupBuffer[index+2] = chunk[rIndex+2];
        
        dupBuffer[rIndex+0] = t.r;
        dupBuffer[rIndex+1] = t.g;
        dupBuffer[rIndex+2] = t.b;
      }
    }
  }




  effects.fisher_yates_shuffle_vertical = function (chunk, dupBuffer, opts, paramsArray) {
   
    // type: pixelsort, class: shuffle

    var h = opts.height, w = opts.width;
    for( var i = 0; i < w; i++) {

      for (var j = h-1; j--; ) {
        var r = Math.floor(Math.random() * (j+1) );
        var index =  (j*h*4) + (i*4);
        var rIndex = (r*h*4) + (i*4);
        var t =  { 
          r: chunk[index+0], 
          g: chunk[index+1], 
          b: chunk[index+2] 
        };

        dupBuffer[index+0] = chunk[rIndex+0];
        dupBuffer[index+1] = chunk[rIndex+1];
        dupBuffer[index+2] = chunk[rIndex+2];
        
        dupBuffer[rIndex+0] = t.r;
        dupBuffer[rIndex+1] = t.g;
        dupBuffer[rIndex+2] = t.b;
      }
    }


  }








  effects.fisher_yates_deluxe = function (chunk, dupBuffer, opts, paramsArray) {
    var h = opts.height, w = opts.width;    
    for( var i = 0; i < w; i++) {
      for (var j = h-1; j--; ) {
        var r = Math.floor(Math.random() * (j+1) );
        var index =  (i*h*4) + (j*4);
        var rIndex = (i*h*4) + (r*4);
        var t =  { 
          r: chunk[index+0], 
          g: chunk[index+1], 
          b: chunk[index+2] 
        };

        dupBuffer[index+0] = chunk[rIndex+0];
        dupBuffer[index+1] = chunk[rIndex+1];
        dupBuffer[index+2] = chunk[rIndex+2];
        
        dupBuffer[rIndex+0] = t.r;
        dupBuffer[rIndex+1] = t.g;
        dupBuffer[rIndex+2] = t.b;
      }
    }


    for( var i = 0; i < h; i++) {
      for (var j = w-1; j--; ) {
        var r = Math.floor(Math.random() * (j+1) );
        var index =  (j*w*4) + (i*4);
        var rIndex = (r*w*4) + (i*4);
        var t =  { 
          r: dupBuffer[index+0], 
          g: dupBuffer[index+1], 
          b: dupBuffer[index+2] 
        };

        dupBuffer[index+0] = dupBuffer[rIndex+0];
        dupBuffer[index+1] = dupBuffer[rIndex+1];
        dupBuffer[index+2] = dupBuffer[rIndex+2];
        
        dupBuffer[rIndex+0] = t.r;
        dupBuffer[rIndex+1] = t.g;
        dupBuffer[rIndex+2] = t.b;
      }
    }
  }




  effects.pixelsort_lr = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: pixelsort
    
    var h = opts.height, w = opts.width, x,y;
    var u32c  = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    
   
    function sortFun (a,b) { return a-b;};


    for (var x = 0; x < h; x++ ) {

      var unsorted = new Uint32Array( w );
      var sorted = new Uint32Array( w );

      for (var y = 0; y < w; y++ ) {
        var index = x * w + y;
        unsorted[y] = u32c[index];
      }

      sorted.set( unsorted.sort() );

      for(var y = 0; y < w; y++) {
        var index = x * w + y;
        clone[index] = sorted[y];
      }

    }
    
  }




  effects.pixelsort_rl = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: pixelsort
    
    var h = opts.height, w = opts.width, x,y;
    var u32c = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    
    function sortFun (a,b) { return a-b;};


    for (var x = 0; x < h; x++ ) {

      var unsorted = new Uint32Array( w );
      var sorted = new Uint32Array( w );

      for (var y = 0; y < w; y++ ) {
        var index = x * w + y;
        unsorted[y] = u32c[index];
      }

      sorted.set( unsorted.sort() );
      sorted = sorted.reverse();

      for(var y = 0; y < w; y++) {
        var index = x * w + y;
        clone[index] = sorted[y];
      }

    }

  }



  effects.pixelsort_ud = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: pixelsort
    
    var h = opts.height, w = opts.width, x,y;
    var u32c = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    function sortFun (a,b) { return a-b;};


    for (var x = 0; x < w; x++ ) {

      var unsorted = new Uint32Array( h );
      var sorted = new Uint32Array( h );

      for (var y = 0; y < h; y++ ) {
        var index = y * w + x;
        unsorted[y] = u32c[index];
      }

      sorted.set( unsorted.sort() );

      for(var y = 0; y < h; y++) {
        var index = y * w + x;
        clone[index] = sorted[y];

      }

    }
   
  }



  effects.pixelsort_du = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: pixelsort
    
    var h = opts.height, w = opts.width, x,y;
    var u32c = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    function sortFun (a,b) { return a-b;};


    for (var x = 0; x < w; x++ ) {

      var unsorted = new Uint32Array( h );
      var sorted = new Uint32Array( h );

      for (var y = 0; y < h; y++ ) {
        var index = y * w + x;
        unsorted[y] = u32c[index];
      }

      sorted.set( unsorted.sort() );
      sorted = sorted.reverse();

      for(var y = 0; y < h; y++) {
        var index = y * w + x;
        clone[index] = sorted[y];

      }

    }
   
  }





  effects.float_swing = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: drift
    
    var h = opts.height, w = opts.width, x,y;
    var u32c = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var pixels, p64;
    // Make sure buffers are divisible by 8;
    if ( (h * w) % 8 !== 0  ) return;

    pixels = new Float64Array(chunk.buffer);  
    p64 = new Float64Array(clone.buffer);

    var threshold = parseInt(opts.threshold, 10) || 50;
    
    var halfh  = Math.round(h/2);
    var halfw  = Math.round(w/2);

    for (var x = 0; x < w; x++ ) {
      for (var y = 0; y < halfh; y++ ) {
        var index = x * halfh + y;
        var val = pixels[index];
        var val2 = pixels[index + 1];

        if (val < val2) {
          p64[index] = val2;
          p64[index+1] = val;
        }
      }

    }

  }






  effects.float_distortion = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: drift
    
    var x,y;
    var h = opts.height, w = opts.width;
    var box = parseInt(opts.threshold, 10) || 50;
    var chunk32, n, ab, dv, u32c, f64c;
    if (box < 0) box = -box;
    var chunk32 = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var n = chunk.byteLength + (chunk.byteLength % 8);
    var ab = new ArrayBuffer(n);
    var u8c = new Uint8Array(ab);
    var u32c = new Uint32Array(ab);
    var f64c = new Float64Array(ab);

    for (i = 0,l = chunk32.length; i <l; ++i ) u32c[i] = chunk32[i];


    var halfh  = Math.round(h/2);
    var halfw  = Math.round(w/2);
    var half = Math.floor(Math.sqrt(box));
    var offset = Math.round(half/2);

    for (var i = 0, l = f64c.length; i < l; i+=box) {
      var color = f64c[i];
      for (var sx = 0; sx < half; ++sx) {
        for (var sy = 0; sy < half; ++sy) {
          var sIndex = sx * i + sy;
          if (sIndex > l) continue;
            f64c[sIndex] = color;
        }
      }

    }

    for (i = 0,l = clone.length; i <l; ++i ) clone[i] = u32c[i];

  }



  // ===================================================
  // Reverb (Rework this API)

  /*

  effects.f32_wet_reverb = function (chunk, dupBuffer, opts, paramsArray) { 
    // http://stackoverflow.com/questions/5318989/reverb-algorithm
    // type: drift
    var x,y;
    var h = opts.height, w = opts.width;
    var chunk32, clone, n, ab, u8c, u32c, f64c;
        chunk32 = new Uint32Array(chunk.buffer);
        clone = new Uint32Array(dupBuffer.buffer);
        n = chunk.byteLength + (chunk.byteLength % 8);
        ab = new ArrayBuffer(n);
        u8c = new Uint8Array(ab);
        u32c = new Uint32Array(ab);
        f64c = new Float64Array(ab);

    for (i = 0,l = chunk32.length; i <l; ++i ) u32c[i] = chunk32[i];

    // var pixels = new Float64Array(u32c.buffer);
    var pixels = new Float32Array(u32c.buffer);
      
    // var halfh  = Math.round(h/2), halfw  = Math.round(w/2);
    
    var delayMilliseconds = 500;
    var delaySamples = parseInt(delayMilliseconds * 44.1, 10); 
    var decay = 0.5; // Level of reverb;
    for (var i = 0, l = pixels.length; i < l; ++i ) {
      var reverbed = i + delaySamples;
      if (reverbed > l) continue;
      pixels[reverbed] += parseInt(pixels[i] * decay, 10);
      // pixels[reverbed] += pixels[i] * decay;
    }

    for (i = 0,l = clone.length; i <l; ++i ) clone[i] = u32c[i];

  }





  effects.f64_wet_reverb = function (chunk, dupBuffer, opts, paramsArray) { 
    // http://stackoverflow.com/questions/5318989/reverb-algorithm
    // type: drift
    var x,y;
    var h = opts.height, w = opts.width;
    var chunk32, clone, n, ab, u32c, f64c;
        chunk32 = new Uint32Array(chunk.buffer);
        clone = new Uint32Array(dupBuffer.buffer);
        n = chunk.byteLength + (chunk.byteLength % 8);
        ab = new ArrayBuffer(n);
        u32c = new Uint32Array(ab);
        f64c = new Float64Array(ab);

    for (i = 0,l = chunk32.length; i <l; i++ ) u32c[i] = chunk32[i];

    var pixels = new Float64Array(u32c.buffer);

    var delayMilliseconds = 500;
    var delaySamples = parseInt(delayMilliseconds * 44.1, 10); 
    var decay = 0.5; // Level of reverb;
    for (var i = 0, l = pixels.length; i < l; i++ ) {
      var reverbed = i + delaySamples;
      if (reverbed > l) continue;
      pixels[reverbed] += parseInt(pixels[i] * decay, 10);
      // pixels[reverbed] += pixels[i] * decay;
    }

    for (i = 0,l = clone.length; i <l; ++i ) clone[i] = u32c[i];

  }




  effects.float_strong_reverb = function (chunk, dupBuffer, opts, paramsArray) { 
    // http://stackoverflow.com/questions/5318989/reverb-algorithm
    // type: drift
    var h = opts.height, w = opts.width, x, y;
    var decay = opts.depth, delayMilliseconds = opts.threshold;
    var delayMilliseconds = 500;
    var decay = 0.5; // Level of reverb;
    var delaySamples = parseInt(delayMilliseconds * 44.1, 10); 
    
    var chunk32, n, ab, u8c, u32c, f64c;
        chunk32 = new Uint32Array(chunk.buffer);
        clone = new Uint32Array(dupBuffer.buffer);
        n = chunk.byteLength + (chunk.byteLength % 8);
        ab = new ArrayBuffer(n);
        u8c = new Uint8Array(ab);
        u32c = new Uint32Array(ab);
        f64c = new Float64Array(ab);

    for (i = 0,l = chunk32.length; i <l; i++ ) u32c[i] = chunk32[i];

    var pixels = new Float32Array(u32c.buffer);
      
    

    for (var i = 0, l = pixels.length; i < l; i++ ) {
      var reverbed = i + delaySamples;
      if (reverbed > l) continue;
      pixels[reverbed] += parseInt(pixels[i] * decay, 10);
      pixels[reverbed] += pixels[i] * decay;
    }

    for (i = 0,l = clone.length; i <l; ++i ) clone[i] = u32c[i];
  }




  effects.strong_reverb = function (chunk, dupBuffer, opts, paramsArray) { 
    // http://stackoverflow.com/questions/5318989/reverb-algorithm
    // type: drift
    var x,y;
    var h = opts.height, w = opts.width;
   
    var data = new Uint32Array(chunk.buffer);
    var pixels = new Uint32Array(dupBuffer.buffer);
      
    var delayMilliseconds = 500;
    var delaySamples = parseInt(delayMilliseconds * 44.1, 10); 
    var decay = 0.5; // Level of reverb;
    for (var i = 0, l = pixels.length; i < l; i++ ) {
      var reverbed = i + delaySamples;
      if (reverbed > l) continue;
      pixels[reverbed] += parseInt(pixels[i] * decay, 10);
      pixels[reverbed] += pixels[i] * decay;
    }
  }
  */




  effects.outta_shape = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: drift

    
    var xspace = opts.xspace || 10, 
        yspace = opts.yspace || 10,
        zoom = opts.stroke   || 10, 
        weight = opts.weight || 10;
    var h = opts.height, w = opts.width, x, y;
    var data = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var size = xspace * yspace;


    for (var x = 0; x < h; x+=size) {
      for (var y = 0; y < w; y+=size) {
        var i = Math.round( Math.random() * h - 1 );
        var j = Math.round( Math.random() * w - 1 );
        if ( (i+size) > h) i = (i - (i-h)) - size;
        if ( (j+size) > w) j = (j - (j-h)) - size;

        copyBlocks(i, j, size, size, x, y, size, size);


      }
    }
    for (var x = 0; x < h; x+=size) {
      for (var y = 0; y < w; y+=size) {
        var i = Math.round( Math.random() * h - 1 );
        var j = Math.round( Math.random() * w - 1 );
        if ( (i+size) > h) i = (i - (i-h)) - size;
        if ( (j+size) > w) j = (j - (j-h)) - size;

        copyCircles(i,j, size, size, x, y, size, size, Math.round(size/2));

      }
    }

    for (var x = 0; x < h; x+=size) {
      for (var y = 0; y < w; y+=size) {
        var i = Math.round( Math.random() * h - 1 );
        var j = Math.round( Math.random() * w - 1 );
        if ( (i+size) > h) i = (i - (i-h)) - size;
        if ( (j+size) > w) j = (j - (j-h)) - size;

        copyTriangles(i,j, size, size, x, y, size, size);

      }
    }



    function copyBlocks(sx, sy, sw, sh, dx, dy, dw, dh) {
      // console.time("copyBlocks");
      var i = 0;
      var buf = new Uint32Array(sw * sh);  
      for (var n = 0; n < sh; n++ ) {
        for (var o = 0; o < sw; o++) {
          var sIndex = (sx + n) * w + (sy + o);
          buf[i++] = data[sIndex];
        }
      }
      var i = 0;
      for (var n = 0; n < dh; n++) {
        for (var o = 0; o < dw; o++) {
          var dIndex = (dx + n) * w + (dy + o);
          clone[dIndex] = buf[i++];
        }
      }
    }

    function copyCircles(sx, sy, sw, sh, dx, dy, dw, dh, radius) {
      var shp = 0;
      var circ = radius*radius;
      var buf = new Uint32Array( sh * sw);

      var scx = Math.round(sh/2);
      var scy = Math.round(sw/2);

      for (var i = 0; i < sh; i++) {
        for (var j = 0; j < sw; j++) {
          var cx = scx - i;
          var cy = scy - j;
          if ( ( cx * cx + cy * cy ) <=  circ  ) {
            var sIndex = (sx + i)  * w + (sy + j);
            buf[shp++] = data[sIndex];
          }
        }
      }

      var shp = 0;
      for (var i = 0; i < dh; i++) {
        for (var j = 0; j < dw; j++) {
          var cx = scx - i;
          var cy = scy - j;
          if ( (cx * cx + cy * cy) <= circ ) {
            var dIndex = (dx + i) * w + (dy + j);
            clone[dIndex] = buf[shp++];
          }
        }
      }
    }


    function copyTriangles(sx, sy, sw, sh, dx, dy, dw, dh) {
      var shp = 0;
      var area = Math.round(.5 * sh * sw);
      var buf = new Uint32Array(area);

      var scx = Math.round(sh/2);
      var scy = Math.round(sw/2);

      for (var i = 0; i < sh; i++) {
        var qt = Math.ceil(i/2);
        var bs = scx - qt;
        var be = scx + qt;
        for (var j = 0; j < sw; j++) {
          if ( j > bs && j < be ) {
            var sIndex = (sx + i)  * w + (sy + j);
            buf[shp++] = data[sIndex];
          }
        }
      }

      var shp = 0;
      for (var i = 0; i < dh; i++) {
        var qt = Math.ceil(i/2);
        var bs = scx - qt;
        var be = scx + qt;
        for (var j = 0; j < dw; j++) {
          if ( j > bs && j < be ) {
            var dIndex = (dx + i) * w + (dy + j);
            clone[dIndex] = buf[shp++];
          }
        }
      }
    }

    function degree2Radian(degrees) {
      return degrees * Math.PI / 180;
    }
    function radian2Degree(radians) {
      return radians * 180 / Math.PI;
    }

  }

  /*


  effects.controlledreverb_blend = function (chunk, opts, paramsArray) { 
    // http://stackoverflow.com/questions/5318989/reverb-algorithm
    // type: drift
    var x,y;
    var h = opts.height, w = opts.width;
    var delayMilliseconds = parseInt(opts.threshold) || 50;
    var decay = opts.gamma;
    var chunk32, n, ab, dv, u8c, u32c, f64c;
        chunk32 = new Uint32Array(chunk.buffer);
        n = chunk.byteLength + (chunk.byteLength % 8);
        ab = new ArrayBuffer(n);
        u8c = new Uint8Array(ab);
        pixels = new Uint32Array(ab);
        // f64c = new Float64Array(ab);

    for (i = 0,l = chunk32.length; i <l; i++ ) pixels[i] = chunk32[i];

    // var pixels = new Float64Array(u32c.buffer);
    // var pixels = new Float32Array(u32c.buffer);
      
    var delaySamples = parseInt(delayMilliseconds * 44.1, 10); 
    // var decay = 0.1; // Level of reverb;
    for (var i = 0, l = pixels.length; i < l; i++ ) {
      var reverbed = i + delaySamples;
      if (reverbed > l) continue;
      pixels[reverbed] = (pixels[reverbed] + parseInt(pixels[i] * decay, 10)) / 2;

    }

    finalEffects(chunk, u8c, opts);
  }







  effects.floatyconvolve = function (chunk, opts, paramsArray) { 

    // type: drift
    var x,y;
    var h = opts.height, w = opts.width;
    var chunk32, n, ab, dv, u8c, u32c, f64c;
        chunk32 = new Uint32Array(chunk.buffer);
        n = chunk.byteLength + (chunk.byteLength % 8);
        ab = new ArrayBuffer(n);
        u8c = new Uint8Array(ab);
        u32c = new Uint32Array(ab);
        f64c = new Float64Array(ab);

    for (i = 0,l = chunk32.length; i <l; i++ ) u32c[i] = chunk32[i];

    // var pixels = new Float64Array(u32c.buffer);
    var pixels = new Float32Array(u32c.buffer);
      
    var halfh  = Math.round(h/2), halfw  = Math.round(w/2);
    
    // var decay = 0.5; // Level of reverb;
    // for (var i = 0, l = pixels.length; i < l; i++ ) {
        // Y(t) = x(t) + A * Y(t-d);
    // }
    var kernel = [1,1,1, 0, 2, 0, -1,-2,-1];
    var sides = 9;
    var half = Math.floor(Math.sqrt(sides));
    var offset = Math.round(half/2);
    for (var x = 0; x < w; x++ ) {
      for (var y = 0; y < h; y++ ) {
        var sum = 0, sx, sy, scx, scy, index, wt, sIndex;
        var index = x * h + y;
        var sx = x - offset;
        var sy = y - offset;
        for (scx = 0; scx < half; scx++) {
          for (scy = 0; scy < half; scy++) {
            wt = kernel[scx + scy];
            sIndex = (sx+scx) * h + (scy+sy);
            sum += pixels[sIndex] * wt;
          }
        }
        // pixels[index] = sum / sides;
        pixels[index] = sum;
      }
    }

    finalEffects(chunk, u8c, opts);
  }






  effects.floatyzoom = function (chunk, opts, paramsArray) { 

    // type: drift
    var x,y;
    var h = opts.height, w = opts.width;
    var chunk32, n, ab, dv, u8c, u32c, f64c;
        chunk32 = new Uint32Array(chunk.buffer);
        n = chunk.byteLength + (chunk.byteLength % 8);
        ab = new ArrayBuffer(n);
        u8c = new Uint8Array(ab);
        u32c = new Uint32Array(ab);
        f64c = new Float64Array(ab);

    for (i = 0,l = chunk32.length; i <l; i++ ) u32c[i] = chunk32[i];

    var pixels = new Float64Array(u32c.buffer);
    // var pixels = new Float32Array(u32c.buffer);
    for (var x = 0; x < w; x++ ) {
      for (var y = 0; y < h; y+=4 ) {
        var index = x * h + y;
        var value = pixels[index];
            pixels[index+1] = value;
            pixels[index+w] = value;
            pixels[index+w+1] = value;
            pixels[index+(w*2)] = value;
            pixels[index+(w*2)+1] = value;
      }
    }

    finalEffects(chunk, u8c, opts);
  }
  */


  // ======================================
  // Pixeldrift


  effects.asdf_pixelsort_lr_map = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: drift

    var h = opts.height, w = opts.width, x,y;
    var threshold = parseInt(opts.threshold) || 50;
    var paramsArray = paramsArray || chunk;
    var mode = colorObjectFromColorString(opts.color) || {r: 200, g:200, b:200};
        mode.swap = false;

    function sortFun (a,b) { return a-b;};

    function checkValues (color, toggle) {
      // console.log(color, toggle);
      if ( color.r >=  (toggle.r - threshold) && color.r <= (toggle.r + threshold) ) {
        if ( color.g >=  (toggle.g - threshold) && color.g <= (toggle.g + threshold) ) {
          if ( color.b >=  (toggle.b - threshold) && color.b <= (toggle.b + threshold) ) {
            toggle.swap = !toggle.swap;
            return 1;
          }
        }
      }
      if (toggle.swap === true) {
        return -1
      }
      return 0;
    }    
   
    for (var x = 0; x < h; ++x) {
      var r = [];
      var g = [];
      var b = [];
   
      var tPositions = []; 
      var holdColor = {r:0, g:0, b:0};
      var color = {r:0, g:0, b:0};
        for (var y = 0; y < w; ++y) {
            
            var index = (x*w+y)*4;
            // Sort pixels into their own arrays, 
            // doing it by line makes the function faster 
            r[y] = chunk[index + 0]; 
            g[y] = chunk[index + 1]; 
            b[y] = chunk[index + 2]; 

            tPositions[y] = checkValues({r: paramsArray[index],g: paramsArray[index+1], b: paramsArray[index+2]}, mode);
        };

        r.sort(sortFun);
        g.sort(sortFun);
        b.sort(sortFun);

        for (var y = 0; y < w; y++) {
          var index = (x*w+y)*4;
          var chooser = tPositions[y];
          switch (chooser) {
            case  1 : 
              color.r = holdColor.r = r.pop();
              color.g = holdColor.g = g.pop();
              color.b = holdColor.b = b.pop();
              break;
            case  -1 :
              color.r = holdColor.r;
              color.g = holdColor.g;
              color.b = holdColor.b;
              break;
            case  0 :
              color.r = chunk[index + 0];
              color.g = chunk[index + 1];
              color.b = chunk[index + 2];
              // skip
              break;
          }          

          if ( y % w !== 0 ) {
            dupBuffer[index + 0] = color.r;
            dupBuffer[index + 1] = color.g;
            dupBuffer[index + 2] = color.b;
            dupBuffer[index + 3] = 255;
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          } 
     

        }

    }

  }



  effects.asdf_pixelsort_ud_map = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: drift

    var paramsArray = paramsArray || chunk;
    var h = opts.height, w = opts.width, x,y;
    var threshold = parseInt(opts.threshold) || 50;
    var mode = colorObjectFromColorString(opts.color) || {r: 200, g:200, b:200};
        mode.swap = false;

    function sortFun (a,b) { return a-b;};

    function checkValues (color, toggle) {
      if ( color.r >=  (toggle.r - threshold) && color.r <= (toggle.r + threshold) ) {
        if ( color.g >=  (toggle.g - threshold) && color.g <= (toggle.g + threshold) ) {
          if ( color.b >=  (toggle.b - threshold) && color.b <= (toggle.b + threshold) ) {
            toggle.swap = !toggle.swap;
            return 1;
          }
        }
      }
      if (toggle.swap === true) {
        // toggle.swap = false;
        return -1
      }
      return 0;
    }    

    for (var x = h; x--;) {
      var r = [];
      var g = [];
      var b = [];
      var tPositions = []; 
      var holdColor = {r:0, g:0, b:0};
      var color = {r:0, g:0, b:0};
        for (var y = w; y--;) {   
          var index = (y*h+x)*4;
            r[y] = chunk[index + 0]; 
            g[y] = chunk[index + 1]; 
            b[y] = chunk[index + 2]; 

            tPositions[y] = checkValues({r: paramsArray[index],g: paramsArray[index+1], b: paramsArray[index+2]}, mode);
        };

        r.sort(sortFun);
        g.sort(sortFun);
        b.sort(sortFun);

        for (var y = w; y--;) {
          var index = (y*h+x)*4;
          var chooser = tPositions[y];
          switch (chooser) {
            case  1 : 
              color.r = holdColor.r = r.pop();
              color.g = holdColor.g = g.pop();
              color.b = holdColor.b = b.pop();
              break;
            case  -1 :
              color.r = holdColor.r;
              color.g = holdColor.g;
              color.b = holdColor.b;
              break;
            case  0 :
              color.r = chunk[index + 0];
              color.g = chunk[index + 1];
              color.b = chunk[index + 2];

              break;
          }          

          if ( y % w !== 0 ) {
            dupBuffer[index + 0] = color.r;
            dupBuffer[index + 1] = color.g;
            dupBuffer[index + 2] = color.b;
            dupBuffer[index + 3] = 255;
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          }
        }
    }
  }




  effects.pixelcrunch_map = function (chunk, dupBuffer, opts, paramsArray) { 

    // type: drift
    var h = opts.height, w = opts.width, x,y;
    var paramsArray = paramsArray || chunk;
    var threshold = parseInt(opts.threshold) || 50;
    var mode = colorObjectFromColorString(opts.color) || {r: 200, g:200, b:200};
        mode.swap = false;
   
    function sortFun (a,b) { return a-b;};

    function checkValues(color) {
      var colorvalue = color.r + color.g + color.b;
      if (colorvalue > 100) {
        return 0;
      } else if (colorvalue > 50) {
        return -1;
      } else {
        return 1;
      }
    }

    for (var x = 0; x < h; ++x) {
      var r = [];
      var g = [];
      var b = [];
      var tPositions = []; 
      var holdColor = {r:0, g:0, b:0};
      var color = {r:0, g:0, b:0};
        for (var y = 0; y < w; ++y) {
            
            var index = (x*w+y)*4;
            r[y] = chunk[index + 0]; 
            g[y] = chunk[index + 1]; 
            b[y] = chunk[index + 2]; 

            tPositions[y] = checkValues({r: paramsArray[index],g: paramsArray[index+1], b: paramsArray[index+2]}, mode);
        };

        r.sort(sortFun);
        g.sort(sortFun);
        b.sort(sortFun);

        for (var y = 0; y < w; ++y) {
          var index = (x*w+y)*4;
          var chooser = tPositions[y];
          switch (chooser) {
            case  1 : 
              color.r = holdColor.r = r.pop();
              color.g = holdColor.g = g.pop();
              color.b = holdColor.b = b.pop();
              break;
            case  -1 :
              color.r = holdColor.r;
              color.g = holdColor.g;
              color.b = holdColor.b;
              break;
            case  0 :
              color.r = chunk[index + 0];
              color.g = chunk[index + 1];
              color.b = chunk[index + 2];
              // skip
              break;
          }          

          if ( y % w !== 0 ) {
            dupBuffer[index + 0] = color.r;
            dupBuffer[index + 1] = color.g;
            dupBuffer[index + 2] = color.b;
            dupBuffer[index + 3] = 255;
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          } 
     

        }

    }

  }



  effects.drift_lr = function (chunk, dupBuffer, opts) { 
    
    // type: drift;



    var x = opts.height, y = opts.width;
    var threshold = parseInt(opts.threshold) || 50;
    var mode = colorObjectFromColorString(opts.color) || {r: 200, g:200, b:200};
        mode.swap = false;
   
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
   
            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );


        }

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
            dupBuffer[index + 0] = color.r;
            dupBuffer[index + 1] = color.g;
            dupBuffer[index + 2] = color.b;
            dupBuffer[index + 3] = 255;
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          } 
          
        }
    }
  }



  effects.drift_rl = function (chunk, dupBuffer, opts, paramsArray) { 
    
    // type: drift;

    var threshold = parseInt(opts.threshold) || 50;
    var x = opts.height, y = opts.width;
      var mode = colorObjectFromColorString(opts.color) || {r: 200, g:200, b:200};
        mode.swap = false;
   

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
        return -1
      }

      return 0;
    }


    for (var i = x; i--;) {

        var tPositions = []; 
        var holdColor = {};
        var color = {};


        for (var j = y; j--;) {
          var index = (i*y+j)*4;
            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );
        }

        for (var j = y; j--;) {

          var index = (i*y+j)*4;
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
            dupBuffer[index + 0] = color.r;
            dupBuffer[index + 1] = color.g;
            dupBuffer[index + 2] = color.b;
            dupBuffer[index + 3] = 255;
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          } 
          
        }
    }
  }






  effects.drift_ud = function (chunk, dupBuffer, opts, paramsArray) { 
    
    // type: drift;
    var threshold = parseInt(opts.threshold) || 50;
    // opts.direction = 'vertical';
    var x = opts.width, y = opts.height;
    var mode = colorObjectFromColorString(opts.color) || {r: 200, g:200, b:200};
        mode.swap = false;

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

        return -1
      }

      return 0;
    }


    for (var i = 0; i < x; i++) {

        var tPositions = []; 
        var holdColor = {};
        var color = {};


        for (var j = 0; j < y; j++) {
          var index = (j*x+i)*4;
            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );


        }

        for (var j = 0; j < y; j++) {

          var index = (j*x+i)*4;
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
            dupBuffer[index + 0] = color.r;
            dupBuffer[index + 1] = color.g;
            dupBuffer[index + 2] = color.b;
            dupBuffer[index + 3] = 255;
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          } 
          
        }
    }
  }





  effects.drift_du = function (chunk, dupBuffer ,opts, paramsArray) { 
    
    // type: drift;

    var x = opts.width, y = opts.height;
    var threshold = parseInt(opts.threshold) || 50;
    var mode = colorObjectFromColorString(opts.color) || {r: 200, g:200, b:200};
        mode.swap = false;

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

        return -1
      }

      return 0;
    }


    for (var i = x; i--;) {

        var tPositions = []; 
        var holdColor = {};
        var color = {};


        for (var j = y; j--;) {      
            var index = (j*x+i)*4;                
            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );
        }

        for (var j = y; j--;) {
          var index = (j*x+i)*4;
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
    }
  }




  // ==========================================
  // FIX THE API/COORDINATES if you can
  /*

  effects.middrift = function (chunk, opts, paramsArray) { 
    
    // type: drift;


    var gamma = opts.gamma || 1;
    var x,y;
    var paramsArray = paramsArray || chunk;
    var threshold = parseInt(opts.threshold) || 50;
    console.log(threshold);
    opts.direction = 'horizontal';
    opts.values = opts.values || 'black';
    if (opts.direction === 'horizontal') {
      var x = opts.height, y = opts.width;

    } else {
      var x = opts.width, y = opts.height;

    }
    var comparer = {

       white :  {r:200,g:200,b:200},
       black :  {r:50,g:50,b:50},
       grey  :  {r:150,g:150,b:150}
    }

    // toggles the dirft mode
    var mode = comparer[ opts.values ];
        mode.swap = false;

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

        return -1
      }

      return 0;
    }


    for (var i = 0; i < x; i++) {

        var tPositions = []; 
        var holdColor = {};
        var color = {};


        for (var j = 0; j < y; j++) {
            
            var index = (j*x*4) + (i*4);

            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );


        }

        for (var j = 0; j < y; j++) {

          var index = (j*y*4) + (i*4);
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


          if ( j % x !== 0 ) {
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
    }
  }



  effects.slidedrift = function (chunk, opts) { 
    
    // type: drift;


    var gamma = opts.gamma || 1;
    var x,y;

    var threshold = parseInt(opts.threshold) || 50;
    console.log(threshold);
    opts.direction = 'horizontal';
    opts.values = opts.values || 'black';
    if (opts.direction === 'horizontal') {
      var x = opts.height, y = opts.width;

    } else {
      var x = opts.width, y = opts.height;

    }
    var comparer = {

       white :  {r:200,g:200,b:200},
       black :  {r:50,g:50,b:50},
       grey  :  {r:150,g:150,b:150}
    }

    // toggles the dirft mode
    var mode = comparer[ opts.values ];
        mode.swap = false;

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

        return -1
      }

      return 0;
    }


    for (var i = 0; i < x; i++) {

        var tPositions = []; 
        var holdColor = {};
        var color = {};


        for (var j = 0; j < y; j++) {
            
            var index = (j*x*4) + (i*4);

            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );


        }

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
    }
  }





  effects.maldrift = function (chunk, opts, paramsArray) { 
    
    // type: drift;


    var gamma = opts.gamma || 1;
    var x,y;
    var paramsArray = paramsArray || chunk;
    var threshold = parseInt(opts.threshold) || 50;
    console.log(threshold);
    opts.direction = 'horizontal';
    opts.values = opts.values || 'black';
    if (opts.direction === 'horizontal') {
      var x = opts.height, y = opts.width;

    } else {
      var x = opts.width, y = opts.height;

    }
    var comparer = {

       white :  {r:200,g:200,b:200},
       black :  {r:50,g:50,b:50},
       grey  :  {r:150,g:150,b:150}
    }

    // toggles the dirft mode
    var mode = comparer[ opts.values ];
        mode.swap = false;

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

        return -1
      }

      return 0;
    }


    for (var i = x; i--;) {

        var tPositions = []; 
        var holdColor = {};
        var color = {};


        for (var j = y; j--;) {
            
            var index = (j*x*4) + (i*4);

            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );


        }

        for (var j = y; j--;) {

          var index = (j*y*4) + (i*4);
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


          if ( j % x !== 0 ) {
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
    }
  }





  effects.stickydrift = function (chunk, opts, paramsArray) { 
    
    // type: drift;


    var gamma = opts.gamma || 1;
    var x,y;
    var paramsArray = paramsArray || chunk;
    var threshold = parseInt(opts.threshold) || 50;
    console.log(threshold);
    opts.direction = 'horizontal';
    opts.values = opts.values || 'black';
    if (opts.direction === 'horizontal') {
      var x = opts.height, y = opts.width;

    } else {
      var x = opts.width, y = opts.height;

    }
    var comparer = {

       white :  {r:200,g:200,b:200},
       black :  {r:50,g:50,b:50},
       grey  :  {r:150,g:150,b:150}
    }

    // toggles the dirft mode
    var mode = comparer[ opts.values ];
        mode.swap = false;

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

        return -1
      }

      return 0;
    }


    for (var i = x; i--;) {

        var tPositions = []; 
        var holdColor = {};
        var color = {};


        for (var j = y; j--;) {
            
            var index = (j*x*4) + (i*4);

            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );


        }

        for (var j = y; j--;) {

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


          if ( j % x !== 0 ) {
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
    }
  }



  effects.glitchdrift = function (chunk, opts) { 
    // var chunk = buffer;
    var gamma = opts.gamma || 1;
    var x,y;
    // var threshold = 50;
    var threshold = parseInt(opts.threshold) || 50;
    console.log(threshold);
    opts.direction = 'horizontal';
    opts.values = opts.values || 'white';
    if (opts.direction === 'horizontal') {
      var x = opts.height, y = opts.width;
      // console.log('horizontal bro', x, y)
    } else {
      var x = opts.width, y = opts.height;
      // console.log('vertical bro', x, y)
    }
    var comparer = {

       white :  {r:200,g:200,b:200},
       black :  {r:50,g:50,b:50},
       grey  :  {r:150,g:150,b:150}
    }

    var mode = opts.color || comparer[ opts.values ];
        mode.swap = false;
    
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

        return -1
      }

      return 0;
    }


    for (var i = 0; i < x; i++) {
      
        var tPositions = []; 
        var holdColor = {};
        var color = {};


        for (var j = 0; j < y; j++) {
            
            var index = (j*y*4) + (i*4);

            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );


        }

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

    }
  }


  */


  effects.step_drift = function (chunk, dupBuffer, opts) { 

    var threshhold = 20;
    var nextRGB = meanPixel(chunk); 
    var currentRGB = {r: 0, g: 0, b: 0};
    var x = opts.height, y = opts.width;


    function getRGB(loc){
      var rgb  = {
            r: chunk[loc + 0] ? chunk[loc + 0] : 0,
            g: chunk[loc + 1] ? chunk[loc + 1] : 0,
            b: chunk[loc + 2] ? chunk[loc + 2] : 0,
          };
      return rgb;
    }


    function dragPixel (val1, val2) {
      var val = 0
      if (val1 > (val2 - threshhold ) && val1 < (val2 + threshhold) ) {
        val = val1;
      } else {
        val = val2;
      }
      return val;
    }
    
    var i = 0, j = 0;
    for (i = 0; i < x; i++) {
        for (j = 0; j < y; j++) {
            
            var index = (i*y*4) + (j*4);

            currentRGB = getRGB(index);
            nextRGB    = getRGB(index + 4)
          
            dupBuffer[index + 0] = dragPixel( currentRGB.r, nextRGB.r )
            dupBuffer[index + 1] = dragPixel( currentRGB.g, nextRGB.g )
            dupBuffer[index + 2] = dragPixel( currentRGB.b, nextRGB.b )
            dupBuffer[index + 3] = 255;

        }
    }
  }










  effects.shadow_drift = function (chunk, dupBuffer, opts) { 
    // var chunk = buffer;

    var x,y;
    var threshold = 50;
    var gamma = opts.depth;
    var x = opts.height, y = opts.width;
    var mode = colorObjectFromColorString(opts.color) || {r: 200, g:200, b:200};
        mode.swap = false;
   
    // Done
    var forwardFive = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [5, 5, 5, 10, 10, 10, 15, 15, 15, 20, 20, 20],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    // Done
    var forwardOdd = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [2, 2, 2, 7, 7, 7, 9, 9, 9, 11, 11, 11],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    //  Done
    var backwardFive = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [-5,-5,-5,-10,-10,-10,-15,-15,-15,-20,-20,-20],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }
    // Done
    var backwardOdd = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [-3, -3, -3, -8, -8, -8, -11, -11, -11, -14, -14, -14],
      clip:   [150, 300, 500],
      def:    [150,150,150,150]
    }

     // Done
    var noops = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [0,0,0,0,0,0,0,0,0,0,0,0],
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
        
        
            var curColor = {
              r : chunk[index + 0], 
              g : chunk[index + 1], 
              b : chunk[index + 2]  
            }

            tPositions[j] = checkValues( curColor, mode );


        }

        for (var j = 0; j < y; j++) {

          var index = (i*y*4) + (j*4);
          var chooser = tPositions[j];
          var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };
          switch (chooser) {
          
              case 1: channelSwing(rgba, index, forwardFive); break;
              case 0: channelSwing(rgba, index, noops); break;
              case -1: channelSwing(rgba, index, backwardFive); break;
          
            }
            chunk[index + 3] = 255;
        }

    }

  }









  effects.random_drift = function (chunk, dupBuffer, opts) { 

    var h = opts.height, w = opts.width, gamma = opts.depth;


    // Done
    var forwardFive = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [5, 5, 5, 10, 10, 10, 15, 15, 15, 20, 20, 20],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    // Done
    var forwardOdd = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [2, 2, 2, 7, 7, 7, 9, 9, 9, 11, 11, 11],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    //  Done
    var backwardFive = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [-5,-5,-5,-10,-10,-10,-15,-15,-15,-20,-20,-20],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }
    // Done
    var backwardOdd = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [-3, -3, -3, -8, -8, -8, -11, -11, -11, -14, -14, -14],
      clip:   [150, 300, 500],
      def:    [150,150,150,150]
    }

     // Done
    var noops = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [0,0,0,0,0,0,0,0,0,0,0,0],
      clip:   [150, 300, 500],
      def:    [150,150,150,150]
    }

    // Hex pattern
    var pattern = [
      [
        2, 2, 2, 1, 1, 2, 2, 2,
        0, 0, 0, 1, 1, 0, 0, 0,
        1, 1, 0, 1, 1, 0, 1, 1,
        2, 2, 0, 1, 1, 0, 2, 2,
        2, 2, 0, 1, 1, 0, 2, 2,
        1, 1, 0, 1, 1, 0, 1, 1,
        0, 0, 0, 1, 1, 0, 0, 0,
        2, 2, 2, 1, 1, 2, 2, 2
      ],[
        2, 2, 1, 1, 1, 1, 2, 2,
        0, 0, 1, 1, 1, 1, 0, 0,
        1, 1, 0, 1, 1, 0, 1, 1,
        2, 2, 0, 1, 1, 0, 2, 2,
        2, 2, 0, 1, 1, 0, 2, 2,
        1, 1, 0, 1, 1, 0, 1, 1,
        0, 0, 1, 1, 1, 1, 0, 0,
        2, 2, 1, 1, 1, 1, 2, 2
      ],[
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0
      ],[
        2, 2, 2, 2, 2, 2, 2, 2,
        0, 0, 0, 0, 0, 0, 0, 0,
        2, 2, 2, 2, 2, 2, 2, 2,
        0, 0, 0, 0, 0, 0, 0, 0,
        2, 2, 2, 2, 2, 2, 2, 2,
        0, 0, 0, 0, 0, 0, 0, 0,
        2, 2, 2, 2, 2, 2, 2, 2,
        0, 0, 0, 0, 0, 0, 0, 0
      ],[
        0, 0, 0, 1, 1, 0, 0, 0,
        0, 0, 0, 1, 1, 0, 0, 0,
        0, 0, 0, 1, 1, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 0, 0, 0,
        0, 0, 0, 1, 1, 0, 0, 0,
        0, 0, 0, 1, 1, 0, 0, 0
      ]
    ]


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

    var min = 0, max = 7, cur = 0, pl = pattern.length - 1; 
    var i = 0, j = 0, n = 0, p = 0;
    for (i = 0; i < h; i++, cur++) {

        if ( cur > max) {
          cur = 0;
        }

        for (j = 0; j < w; j++, n++) {
            var index = (i*w*4) + (j*4);
            
            // Pass an rgba objects to the processing function.
            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };
            if (n > max) {
              n = 0;
            }
   
            var switcher = pattern[p][cur + n];

            p = Math.floor( Math.random() * pl );

            switch (switcher) {
              case 2: channelSwing(rgba, index, forwardOdd); break;
              case 1: channelSwing(rgba, index, forwardFive); break;
              case 0: channelSwing(rgba, index, noops); break;
              default: channelSwing(rgba, index, backwardFive); break;
            }
            // chunk[index + 3] = 255;


        }
    }
  }



  effects.ice = function (chunk, dupBuffer, opts) { 

    var gamma = opts.depth;
    var h = opts.height, w = opts.width;


    // Done
    var forwardFive = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [5, 5, 5, 10, 10, 10, 15, 15, 15, 20, 20, 20],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    // Done
    var forwardOdd = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [2, 2, 2, 7, 7, 7, 9, 9, 9, 11, 11, 11],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    //  Done
    var backwardFive = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [-5,-5,-5,-10,-10,-10,-15,-15,-15,-20,-20,-20],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }
    // Done
    var backwardOdd = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [-3, -3, -3, -8, -8, -8, -11, -11, -11, -14, -14, -14],
      clip:   [150, 300, 500],
      def:    [150,150,150,150]
    }

     // Done
    var noops = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [0,0,0,0,0,0,0,0,0,0,0,0],
      clip:   [150, 300, 500],
      def:    [150,150,150,150]
    }

    // Done
    var allops = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing:  [10,10,10,10,10,10,10,10,10,10,10,10],
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

    var min = 0, max = 7, cur = 0; 
    var i = 0, j = 0, n = 0, p = 0;
    for (i = 0; i < h; ++i, ++cur) {

        if ( cur > max) {
          cur = 0;
        }

        for (j = 0; j < w; ++j, ++n) {
            var index = (i*w+j)*4;
            
            // Pass an rgba objects to the processing function.
            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };
            if (n > max) {
              n = 0;
            }
   
            var switcher = p = Math.floor( Math.random() * 7 );

            switch (switcher) {
              case 4: channelSwing(rgba, index, backwardFive); break;
              case 3: channelSwing(rgba, index, backwardOdd); break;
              case 2: channelSwing(rgba, index, forwardOdd); break;
              case 1: channelSwing(rgba, index, forwardFive); break;
              case 0: channelSwing(rgba, index, noops); break;
              default: channelSwing(rgba, index, allops); break;
            }
            // chunk[index + 3] = 255;


        }
    }
  }




  /*

  effects.swingleft = function (chunk, opts) { 
    // var chunk = buffer;
    var gamma = opts.gamma || 1;
    var h = opts.height, w = opts.width;

    // Done
    var smoshDefaults = {
      thresh: [0,1,2,0,1,2,0,1,2,0,1,2],
      swing : [10,10,10,0,0,0,-10,-10,-10,0,0,0],
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
      chunk[loc]    = swingDistort( loc, swingMap.swing[0], swingMap.thresh[0], swingMap.def[0] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[1], swingMap.thresh[1], swingMap.def[0] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[2], swingMap.thresh[2], swingMap.def[0] );
      chunk[loc +3] = 255;
    } else if ( pixelValue > swingMap.clip[1]) {
      chunk[loc]    = swingDistort( loc, swingMap.swing[3], swingMap.thresh[3], swingMap.def[1] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[4], swingMap.thresh[4], swingMap.def[1] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[5], swingMap.thresh[5], swingMap.def[1] );
      chunk[loc +3] = 255;
    } else if (pixelValue > swingMap.clip[2]) {
      chunk[loc]    = swingDistort( loc, swingMap.swing[6], swingMap.thresh[6], swingMap.def[2] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[7], swingMap.thresh[7], swingMap.def[2] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[8], swingMap.thresh[8], swingMap.def[2] );
      chunk[loc +3] = 255;
    } else {
      chunk[loc]    = swingDistort( loc, swingMap.swing[9],  swingMap.thresh[9],  swingMap.def[3] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[10], swingMap.thresh[10], swingMap.def[3] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[11], swingMap.thresh[11], swingMap.def[3] );
      chunk[loc +3] = 255;
    }



  }
    var i = 0, j = 0;
    for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
            
            var index = (i*w*4) + (j*4);
            
            // Pass an rgba objects to the processing function.
            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };
            
            // Process the tuple.
            // procfn(rgba, j, i);
            channelSwing(rgba, index, smoshDefaults)
            chunk[index + 3] = 255;
            // Put back the data.
            // data[index]     = parseInt(clamp(rgba.r));
            // data[index + 1] = parseInt(clamp(rgba.g));
            // data[index + 2] = parseInt(clamp(rgba.b));  
            // data[index + 3] = parseInt(clamp(rgba.a));  

        }
    }
  }

  effects.swingright = function (chunk, opts) {
  var opts = opts || {};
  var gamma = opts.gamma || 1;
  var offset = opts.offset || 0;
  var colR = opts.color.r || 0xFF; 
  var colG = opts.color.g || 0xFF;
  var colB = opts.color.b || 0xFF;

  var coloredPixels = [];

  var i = 0;

  while (i < chunk.length) {
    coloredPixels.push([ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]])
    i += 4;
  }

  var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 600 ) {
        chunk[n++] = array[index-10] ? array[index-10][0] : value[0]; //(value[0] + 0x00) / 2;
        chunk[n++] = array[index-10] ? array[index-10][1] : value[1]; //(value[1] + 0x00) / 2;
        chunk[n++] = array[index-10] ? array[index-10][2] : value[2]; //(value[2] + 0x00) / 2;
        chunk[n++] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 400 )  {
        chunk[n++] = array[index-20] ? array[index-20][0] : value[0];//(value[0] + colR) / 2;
        chunk[n++] = array[index-20] ? array[index-20][1] : value[1];//(value[1] + colG) / 2;
        chunk[n++] = array[index-20] ? array[index-20][2] : value[2];//(value[2] + colB) / 2;
        chunk[n++] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 200 ) {
        chunk[n++] = array[index-5] ? array[index-5][0] : chunk[n];
        chunk[n++] = array[index-5] ? array[index-5][1] : chunk[n];
        chunk[n++] = array[index-5] ? array[index-5][2] : chunk[n];
        chunk[n++] = 255;
      } else {
        chunk[n++] = array[index-2] ? array[index-2][0] : chunk[n];
        chunk[n++] = array[index-2] ? array[index-2][1] : chunk[n];
        chunk[n++] = array[index-2] ? array[index-2][2] : chunk[n];
        chunk[n++] = 255;
      }
    })
  }

  */



  effects.chosh = function (chunk, dupBuffer, opts) { 
    // var chunk = buffer;
    var gamma = opts.depth || 1;
    var h = opts.height, w = opts.width;

    var blinkDefaults = {
      thresh: [1,2,0,1,2,0,2,0,1,2,0,2],
      swing : [17, -14, 10, 20, -7, 12, 3, -5, 9, 4, 4, 11],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    // Done
    var bonkDefaults = {
      thresh: [1,2,0,1,2,0,2,0,1,2,0,2],
      swing : [7, 4, 1, 5, 2, 1, 3, 5, 9, 7, 4, 1],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    // Done
    var smoshDefaults = {
      thresh: [1,2,0,1,2,0,2,0,1,2,0,2],
      swing : [-19, 20, -4, 0, 0, 0, 13, -15, 9, 7, 4, -10],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }

    //  Done
    var sleepDefaults = {
      thresh: [1,2,0,1,2,0,2,0,1,2,0,2],
      swing : [7, 4, 1, 5, 2, 1, 3, 5, 9, 7, 4, 1],
      clip  : [100, 200, 400],
      def   : [100, 200, 15, 15]
    }
    // Done
    var simpleDefaults = {
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
    var i = 0, j = 0;
    for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
            
            var index = (i*w*4) + (j*4);
            
            // Pass an rgba objects to the processing function.
            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };
            
            // Process the tuple.
            // procfn(rgba, j, i);
            channelSwing(rgba, index, sleepDefaults)
            // chunk[index + 3] = 255;

            // Put back the data.
            // data[index]     = parseInt(clamp(rgba.r));
            // data[index + 1] = parseInt(clamp(rgba.g));
            // data[index + 2] = parseInt(clamp(rgba.b));  
            // data[index + 3] = parseInt(clamp(rgba.a));  

        }
    }
  }


  effects.swish = function (chunk, dupBuffer, opts) { 
    // var chunk = buffer;
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
      dupBuffer[loc + 1] = swingDistort( loc, swingMap.swing[1], swingMap.thresh[1], swingMap.def[0] );
      dupBuffer[loc + 2] = swingDistort( loc, swingMap.swing[2], swingMap.thresh[2], swingMap.def[0] );
      dupBuffer[loc + 3] = 255;
    } else if ( pixelValue > swingMap.clip[1]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[3], swingMap.thresh[3], swingMap.def[1] );
      dupBuffer[loc + 1] = swingDistort( loc, swingMap.swing[4], swingMap.thresh[4], swingMap.def[1] );
      dupBuffer[loc + 2] = swingDistort( loc, swingMap.swing[5], swingMap.thresh[5], swingMap.def[1] );
      dupBuffer[loc + 3] = 255;
    } else if (pixelValue > swingMap.clip[2]) {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[6], swingMap.thresh[6], swingMap.def[2] );
      dupBuffer[loc + 1] = swingDistort( loc, swingMap.swing[7], swingMap.thresh[7], swingMap.def[2] );
      dupBuffer[loc + 2] = swingDistort( loc, swingMap.swing[8], swingMap.thresh[8], swingMap.def[2] );
      dupBuffer[loc + 3] = 255;
    } else {
      dupBuffer[loc]    = swingDistort( loc, swingMap.swing[9],  swingMap.thresh[9],  swingMap.def[3] );
      dupBuffer[loc + 1] = swingDistort( loc, swingMap.swing[10], swingMap.thresh[10], swingMap.def[3] );
      dupBuffer[loc + 2] = swingDistort( loc, swingMap.swing[11], swingMap.thresh[11], swingMap.def[3] );
      dupBuffer[loc + 3] = 255;
    }

  }
    
    var i = 0, j = 0, n = 0;

    for (var i = 0; i < h; i++) {

        var coeff1 = Math.floor(opts.height / opts.width * i);
        var coeff2 = Math.floor(opts.height / opts.width * (i*2) );
        var coeff3 = Math.floor(opts.height / opts.width * (i*4) );
        var coeff4 = Math.floor(opts.height / opts.width * (i*8) );
        fizzleDefaults.swing[0] = fizzleDefaults.swing[1] = fizzleDefaults.swing[2] = Math.max(coeff1, opts.width);
        fizzleDefaults.swing[3] = fizzleDefaults.swing[4] = fizzleDefaults.swing[5] = Math.max(coeff2, opts.width);
        fizzleDefaults.swing[6] = fizzleDefaults.swing[7] = fizzleDefaults.swing[8] = Math.max(coeff3, opts.width);
        fizzleDefaults.swing[9] = fizzleDefaults.swing[10] = fizzleDefaults.swing[11] = Math.max(coeff4, opts.width);

        for (var j = 0; j < w; j++) {
            
            var index = (i*w*4) + (j*4);
                
            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };

              channelSwing(rgba, index, fizzleDefaults); 
            

        }
    }
  }


  /*
  effects.swingsphererical = function (chunk, opts) { 
    // var chunk = buffer;
    var gamma = opts.gamma || 1;
    var height = opts.height, width = opts.width;

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
      chunk[loc]    = swingDistort( loc, swingMap.swing[0], swingMap.thresh[0], swingMap.def[0] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[1], swingMap.thresh[1], swingMap.def[0] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[2], swingMap.thresh[2], swingMap.def[0] );
      chunk[loc +3] = 255;
    } else if ( pixelValue > swingMap.clip[1]) {
      chunk[loc]    = swingDistort( loc, swingMap.swing[3], swingMap.thresh[3], swingMap.def[1] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[4], swingMap.thresh[4], swingMap.def[1] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[5], swingMap.thresh[5], swingMap.def[1] );
      chunk[loc +3] = 255;
    } else if (pixelValue > swingMap.clip[2]) {
      chunk[loc]    = swingDistort( loc, swingMap.swing[6], swingMap.thresh[6], swingMap.def[2] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[7], swingMap.thresh[7], swingMap.def[2] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[8], swingMap.thresh[8], swingMap.def[2] );
      chunk[loc +3] = 255;
    } else {
      chunk[loc]    = swingDistort( loc, swingMap.swing[9],  swingMap.thresh[9],  swingMap.def[3] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[10], swingMap.thresh[10], swingMap.def[3] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[11], swingMap.thresh[11], swingMap.def[3] );
      chunk[loc +3] = 255;
    }



  }
    
    


  var half = (width/2); // (width/2)*4
  var halfheight = (height/2); // (height/2)*4
  var step = 0;
  for (var i = 0; i < height; i++) {
      var middle = ((i * width*4) + (half*4)) - 1; // = (i*width*4) + (half*4);
      if (i < halfheight) {

        var start = middle - (i*4); // i*4 for rgba pixels
        var end   = middle + (i*4); // i*4 for rgba pixels
        
      } else {

        var start =  middle  - ((i*4) - ( 1 +(2*step)*4 ) ); // start - amount over the middle
        var end   =  middle  + ((i*4) - ( 1 +(2*step)*4 ) );  // end   - amount over the middle
        // console.log('step:',step, i);
        step+=1;
      }

    for (var j = 0; j < width; j++) {
      // var index = i * width + j;
      var index = (i*width*4) + (j*4);
      if (index >= start && index <= end) {
        // put the gold here
        var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };

              channelSwing(rgba, index, fizzleDefaults);
              // chunk[index + 0] = (chunk[index + 0] + rgba.r) / 2; 
              // chunk[index + 1] = (chunk[index + 1] + rgba.g) / 2; 
              // chunk[index + 2] = (chunk[index + 2] + rgba.b) / 2; 
              chunk[index + 3] = 255;
          
      } else {
        // ignore this really;

      }
    }
  }
  }


  effects.inversephererical = function (chunk, opts) { 
    // var chunk = buffer;
    var gamma = opts.gamma || 1;
    var height = opts.height, width = opts.width;

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
      chunk[loc]    = swingDistort( loc, swingMap.swing[0], swingMap.thresh[0], swingMap.def[0] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[1], swingMap.thresh[1], swingMap.def[0] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[2], swingMap.thresh[2], swingMap.def[0] );
      chunk[loc +3] = 255;
    } else if ( pixelValue > swingMap.clip[1]) {
      chunk[loc]    = swingDistort( loc, swingMap.swing[3], swingMap.thresh[3], swingMap.def[1] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[4], swingMap.thresh[4], swingMap.def[1] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[5], swingMap.thresh[5], swingMap.def[1] );
      chunk[loc +3] = 255;
    } else if (pixelValue > swingMap.clip[2]) {
      chunk[loc]    = swingDistort( loc, swingMap.swing[6], swingMap.thresh[6], swingMap.def[2] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[7], swingMap.thresh[7], swingMap.def[2] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[8], swingMap.thresh[8], swingMap.def[2] );
      chunk[loc +3] = 255;
    } else {
      chunk[loc]    = swingDistort( loc, swingMap.swing[9],  swingMap.thresh[9],  swingMap.def[3] );
      chunk[loc +1] = swingDistort( loc, swingMap.swing[10], swingMap.thresh[10], swingMap.def[3] );
      chunk[loc +2] = swingDistort( loc, swingMap.swing[11], swingMap.thresh[11], swingMap.def[3] );
      chunk[loc +3] = 255;
    }



  }
    
    


    var half = (width/2); // (width/2)*4
    var halfheight = (height/2); // (height/2)*4
    var step = 0;
    for (var i = 0; i < height; i++) {
        var middle = ((i * width*4) + (half*4)) - 1; // = (i*width*4) + (half*4);
        if (i < halfheight) {

          var start = middle - (i*4); // i*4 for rgba pixels
          var end   = middle + (i*4); // i*4 for rgba pixels
          
        } else {

          var start =  middle  - ((i*4) - ( 1 +(2*step)*4 ) ); // start - amount over the middle
          var end   =  middle  + ((i*4) - ( 1 +(2*step)*4 ) );  // end   - amount over the middle
          // console.log('step:',step, i);
          step+=1;
        }

      for (var j = 0; j < width; j++) {
        // var index = i * width + j;
        var index = (i*width*4) + (j*4);
        if (index >= start && index <= end) {
          // put the gold here
            
        } else {
          // ignore this really;
          var rgba  = {
                  r: chunk[index],
                  g: chunk[index + 1],
                  b: chunk[index + 2],
                  a: chunk[index + 3]
              };

                channelSwing(rgba, index, fizzleDefaults);
                // chunk[index + 0] = (chunk[index + 0] + rgba.r) / 2; 
                // chunk[index + 1] = (chunk[index + 1] + rgba.g) / 2; 
                // chunk[index + 2] = (chunk[index + 2] + rgba.b) / 2; 
                chunk[index + 3] = 255;

        }
      }
    }
  }

  */





  // ==========================================
  // GREADIENT BLUR

  effects.gradient_blur = function (chunk, dupBuffer, opts) { 
    

    var h = opts.height, w = opts.width;

    function pixelaverager (rgb1, rgb2, rgb3, rgb4, rgb5, rgb6, rgb7, rgb8, rgb9) {
      return {
        r: (rgb1.r + rgb2.r + rgb3.r + rgb4.r + rgb5.r + rgb6.r + rgb7.r + rgb8.r + rgb9.r) / 9,
        g: (rgb1.g + rgb2.g + rgb3.g + rgb4.g + rgb5.g + rgb6.g + rgb7.g + rgb8.g + rgb9.g) / 9,
        b: (rgb1.b + rgb2.b + rgb3.b + rgb4.b + rgb5.b + rgb6.b + rgb7.b + rgb8.b + rgb9.b) / 9
      }
    }

    function findRGB (loc) {
      var rgb1 = {
        r: chunk[loc - 4 ],
        g: chunk[loc - 3 ],
        b: chunk[loc - 2 ]
      },
      rgb2 = {
        r: chunk[loc + 0],
        g: chunk[loc + 1],
        b: chunk[loc + 2]
      },
      rgb3 = {
        r: chunk[loc + 4],
        g: chunk[loc + 5],
        b: chunk[loc + 6]
      },
      rgb4 = {
        r: chunk[loc - 4 + (w*4) ],
        g: chunk[loc - 3 + (w*4) ],
        b: chunk[loc - 2 + (w*4) ]
      },
      rgb5 = {
        r: chunk[loc + 0 + (w*4) ],
        g: chunk[loc + 1 + (w*4) ],
        b: chunk[loc + 2 + (w*4) ]
      },
      rgb6 = {
        r: chunk[loc + 4 + (w*4) ],
        g: chunk[loc + 5 + (w*4) ],
        b: chunk[loc + 6 + (w*4) ]
      },
      rgb7 = {
        r: chunk[loc - 4 - (w*4) ],
        g: chunk[loc - 3 - (w*4) ],
        b: chunk[loc - 2 - (w*4) ]
      },
      rgb8 = {
        r: chunk[loc + 0 - (w*4) ],
        g: chunk[loc + 1 - (w*4) ],
        b: chunk[loc + 2 - (w*4) ]
      },
      rgb9 = {
        r: chunk[loc + 4 - (w*4) ],
        g: chunk[loc + 5 - (w*4) ],
        b: chunk[loc + 6 - (w*4) ]
      };

      return pixelaverager(rgb1, rgb2, rgb3, rgb4, rgb5,rgb6,rgb7,rgb8,rgb9);
    }

    var i = 0, j = 0;
    for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
            
            var index = (i*w+j)*4;
            
            
            var rgb = findRGB(index);
            dupBuffer[index + 0] = rgb.r ? rgb.r : chunk[index + 0];
            dupBuffer[index + 1] = rgb.g ? rgb.g : chunk[index + 1];
            dupBuffer[index + 2] = rgb.b ? rgb.b : chunk[index + 2];
            dupBuffer[index + 3] = 255;


        }
    }
  }



  // ==========================================
  // V A P O R


  effects.bubblegum = function (chunk, dupBuffer, opts) {

    var offset1 = 2, i = 0;
    while (i < chunk.length) {
      
      dupBuffer[i++] = chunk[i] > 245 ? chunk[i] : (chunk[i] + 153) / 2 >>> 0 ; // stable-blue
      dupBuffer[i++] = chunk[i+offset1] > 55 ? chunk[i+offset1] + 0x00  : (chunk[i+offset1] + 85) / 2 >>> 0 ; // Also red
      dupBuffer[i++] = chunk[i+offset1] > 125 ? chunk[i+offset1] + 0x00 : (chunk[i+offset1] + 102) / 2 >>> 0; // RED
      dupBuffer[i++] = 0xFF;
    
    }

    var i = 0;
    while (i < chunk.length) {
      
      dupBuffer[i++] = dupBuffer[i] > 245 ? dupBuffer[i] + 0x00 : dupBuffer[i] + 0x999; // stable-blue
      dupBuffer[i++] = dupBuffer[i+offset1] > 55 ? dupBuffer[i+offset1] + 0x00 : dupBuffer[i+offset1] + 0x555 ; // Also red
      dupBuffer[i++] = dupBuffer[i+offset1] > 125 ? dupBuffer[i+offset1] + 0x00 : dupBuffer[i+offset1] + 0x666; // RED
      dupBuffer[i++] = 0xFF;
    
    }

  }


  effects.artefact =  function (chunk, dupBuffer, opts) {

    var len = chunk.length, gamma = 3, i = 0, value;
    while (i < len) {
      value = chunk[i] + chunk[i+1] + chunk[i+2]
      if ( value &1) {
          if (value > 300) {
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = 255;

          } else {
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = 255
          }
      } else {
      dupBuffer[i++] = ~chunk[i]   * gamma;
      dupBuffer[i++] = ~chunk[i-1] * gamma;
      dupBuffer[i++] = ~chunk[i-2] * gamma;
      dupBuffer[i++] = 255;
      }
    }
  }




  effects.draw = function (chunk, dupBuffer, opts, paramsArray) {
   
    var paramsArray = paramsArray || chunk;
    var len = chunk.length, i = 0, n = 0;
    var mean = meanPixel(paramsArray);

    while (i < len) {
      dupBuffer[++i] = (paramsArray[++i] > mean[0]) ? chunk[i++] >> chunk[i+1] : chunk[i];
      dupBuffer[++i] = (paramsArray[++i] > mean[1]) ? chunk[i++] >> chunk[i+1] : chunk[i];
      dupBuffer[++i] = (paramsArray[++i] > mean[2]) ? chunk[i++] >> chunk[i+1] : chunk[i];
      dupBuffer[++i] = 255;
    
    }

  }




  effects.draws = function (chunk, dupBuffer, opts, paramsArray) {
    var opts = opts || {};
    var gamma = opts.depth || 1;
      var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;
    var paramsArray = paramsArray || chunk;

    var i = 0;
    var n = 0;
    var len = chunk.length
    var mean = meanPixel(chunk);
      while (i < len) {
        dupBuffer[n++] = (paramsArray[++i] > mean[0]) ? chunk[++i] >> chunk[i+1] : chunk[i++] || colR;
        dupBuffer[n++] = (paramsArray[++i] > mean[1]) ? chunk[++i] >> chunk[i+1] : chunk[i++] || colG;
        dupBuffer[n++] = (paramsArray[++i] > mean[2]) ? chunk[++i] >> chunk[i+1] : chunk[i++] || colB;
        dupBuffer[n++] = 255;
        if (i > n) i = n;     
      }

  }








  effects.daw = function (chunk, dupBuffer, opts) {
    var opts = opts || {};
    var gamma = opts.depth || 1;
    var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;



    var i = 0;
    var n = 0;
    var len = chunk.length
    var mean = meanPixel(chunk);
      while (i < len) {
        dupBuffer[i++] = (chunk[i] > mean[0]) ? chunk[i] >> chunk[i+1] : chunk[i];
        dupBuffer[i++] = (chunk[i] > mean[1]) ? chunk[i] >> chunk[i+1] : chunk[i];
        dupBuffer[i++] = (chunk[i] > mean[2]) ? chunk[i] >> chunk[i-1] : chunk[i];
        dupBuffer[i++] = 255;
      
      }
  }





  effects.colorsplash = function (chunk, dupBuffer, opts) {
    var opts = opts || {};
    var gamma = opts.depth || 1;
    var noise = opts.noise || false;
    
    var len = chunk.length, i = 0;
    while (i < len) {

      if ((chunk[i] + chunk[i+1] + chunk[i+2]) &1) {
        dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] : chunk[i]*gamma; // buzz
        dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] : chunk[i]*gamma; // buzz
        dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] : chunk[i]*gamma; // buzz
        dupBuffer[i++] = 255;

      } else {
        
        if (noise) {

          dupBuffer[i++] = chunk[i];
          dupBuffer[i++] = chunk[i-1];
          dupBuffer[i++] = chunk[i-2];
          dupBuffer[i++] = 255;

        } else {
          
          dupBuffer[i++] = ((chunk[i]+1)&1) ? chunk[i] ^ chunk[i] : Math.floor(chunk[i]* gamma); // buzz
          dupBuffer[i++] = ((chunk[i]+1)&1) ? chunk[i] ^ chunk[i] : Math.floor(chunk[i]* gamma); // buzz
          dupBuffer[i++] = ((chunk[i]+1)&1) ? chunk[i] ^ chunk[i] : Math.floor(chunk[i]* gamma); // buzz
          dupBuffer[i++] = 255;
        }

      }
    }

  }



  effects.deteriorate = function (chunk, dupBuffer, opts) {
    var opts = opts || {};
    var gamma = opts.depth || 1;
    var noise = opts.noise || false;
    
    var len = chunk.length, i = 0;
    while (i < len) {

      if ((chunk[i] + chunk[i+1] + chunk[i+2]) &1 === 0) {
        dupBuffer[i++] = (chunk[i*4]  !== undefined ) ? chunk[i] ^ chunk[i] : chunk[i]*gamma; // buzz
        dupBuffer[i++] = (chunk[i*8]  !== undefined ) ? chunk[i] ^ chunk[i] : chunk[i]*gamma; // buzz
        dupBuffer[i++] = (chunk[i*16] !== undefined ) ? chunk[i] ^ chunk[i] : chunk[i]*gamma; // buzz
        dupBuffer[i++] = 255;

      } else {
        
        if (noise) {

          dupBuffer[i++] = chunk[i];
          dupBuffer[i++] = chunk[i-1];
          dupBuffer[i++] = chunk[i-2];
          dupBuffer[i++] = 255;

        } else {
          
          dupBuffer[i++] = ((chunk[i]+1)&1) ? chunk[i] ^ chunk[i] : Math.floor(chunk[i]* gamma); // buzz
          dupBuffer[i++] = ((chunk[i]+1)&1) ? chunk[i] ^ chunk[i] : Math.floor(chunk[i]* gamma); // buzz
          dupBuffer[i++] = ((chunk[i]+1)&1) ? chunk[i] ^ chunk[i] : Math.floor(chunk[i]* gamma); // buzz
          dupBuffer[i++] = 255;
        }

      }
    }

  }
  // ======================================
  // Fix dese api

  /*
  effects.dope = function (chunk, dupBuffer, opts) {
  var opts = opts || {};
  var gamma = opts.gamma || 1;
  var offset = opts.offset || 0;
  // var colR = opts.color.r || 0xFF; 
  // var colG = opts.color.g || 0xCC;
  // var colB = opts.color.b || 0xFF;
  var colR = 0xFF; 
  var colG = 0xCC;
  var colB = 0xFF;



  var coloredPixels = [];

  var i = 0;

  while (i < chunk.length) {
    coloredPixels.push([ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]])
    i += 4;
  }

  var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 100 ) {
        chunk[n++] = (array[index + 7] && array[index + 7][1]) || 100;
        chunk[n++] = (array[index + 4] && array[index + 4][2]) || 100;
        chunk[n++] = (array[index + 1] && array[index + 1][0]) || 100;
        chunk[n++] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 200 )  {
        chunk[n++] = (array[index + 5] && array[index + 5][1]) || 200;
        chunk[n++] = (array[index + 2] && array[index + 2][2]) || 200;
        chunk[n++] = (array[index + 1] && array[index + 1][0]) || 200;
        chunk[n++] = 255;
      } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
        chunk[n++] = (array[index + 3] && array[index + 3][2]) || 15;
        chunk[n++] = (array[index + 5] && array[index + 5][0]) || 15;
        chunk[n++] = (array[index + 9] && array[index + 9][1]) || 15;
        chunk[n++] = 255;
      } else {
        chunk[n++] = (array[index + 7] && array[index + 7][2]) || 15;
        chunk[n++] = (array[index + 4] && array[index + 4][0]) || 15;
        chunk[n++] = (array[index + 1] && array[index + 1][2]) || 15;
        chunk[n++] = 255;
      }
    })


  var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 600 ) {
        chunk[++n] = 0x00;
        chunk[++n] = 0x00;
        chunk[++n] = 0x00;
        chunk[++n] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 400 )  {
        chunk[++n] = colR;
        chunk[++n] = colG;
        chunk[++n] = colB;
        chunk[++n] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 200 ) {
        chunk[n++] = chunk[n - 9] + 0x05
        chunk[n++] = chunk[n - 9] + 0x05
        chunk[n++] = chunk[n - 9] + 0x05
        chunk[n++] = 255;
      } else {
        chunk[++n] = chunk[n + 2] + 0x01;
        chunk[++n] = chunk[n + 2] + 0x01;
        chunk[++n] = chunk[n + 2] + 0x01;
        chunk[++n] = 255;
      }
    })
  }



  effects.nope = function (chunk, dupBuffer, opts) {
  var opts = opts || {};
  var gamma = opts.gamma || 1;
  var offset = opts.offset || 0;
  var colR = opts.colorR || 200; 
  var colG = opts.colorG || 200;
  var colB = opts.colorB || 200;

  var coloredPixels = [];

  var i = 0;

  while (i < chunk.length) {
    coloredPixels.push([ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]])
    i += 4;
  }


  var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 600 ) {
        chunk[++n] = 0x00;
        chunk[++n] = 0x00;
        chunk[++n] = 0x00;
        chunk[++n] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 400 )  {
        chunk[++n] = 0xFF;
        chunk[++n] = 0xCC;
        chunk[++n] = 0xFF;
        chunk[++n] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 200 ) {
        chunk[n++] = chunk[n - 9] + 0x05
        chunk[n++] = chunk[n - 9] + 0x05
        chunk[n++] = chunk[n - 9] + 0x05
        chunk[n++] = 255;
      } else {
        chunk[++n] = chunk[n + 2] + 0x01;
        chunk[++n] = chunk[n + 2] + 0x01;
        chunk[++n] = chunk[n + 2] + 0x01;
        chunk[++n] = 255;
      }
    })
  }

  // REALLY AWESOME
  effects.fope = function (chunk, dupBuffer, opts) {
  var opts = opts || {};
  var gamma = opts.gamma || 1;
  var offset = opts.offset || 0;
  // var colR = opts.color.r || 0xFF; 
  // var colG = opts.color.g || 0xFF;
  // var colB = opts.color.b || 0xFF;
  var colR = 0xFF; 
  var colG = 0xFF;
  var colB = 0xFF;

  var coloredPixels = [];

  var i = 0;

  while (i < chunk.length) {
    coloredPixels.push([ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]])
    i += 4;
  }

  var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 100 ) {
        chunk[n++] = (array[index + 7] && array[index + 7][1]) || 100;
        chunk[n++] = (array[index + 4] && array[index + 4][2]) || 100;
        chunk[n++] = (array[index + 1] && array[index + 1][0]) || 100;
        chunk[n++] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 200 )  {
        chunk[n++] = (array[index + 5] && array[index + 5][1]) || 200;
        chunk[n++] = (array[index + 2] && array[index + 2][2]) || 200;
        chunk[n++] = (array[index + 1] && array[index + 1][0]) || 200;
        chunk[n++] = 255;
      } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
        chunk[n++] = (array[index + 3] && array[index + 3][2]) || 15;
        chunk[n++] = (array[index + 5] && array[index + 5][0]) || 15;
        chunk[n++] = (array[index + 9] && array[index + 9][1]) || 15;
        chunk[n++] = 255;
      } else {
        chunk[n++] = (array[index + 7] && array[index + 7][2]) || 15;
        chunk[n++] = (array[index + 4] && array[index + 4][0]) || 15;
        chunk[n++] = (array[index + 1] && array[index + 1][2]) || 15;
        chunk[n++] = 255;
      }
    })


  var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 600 ) {
        chunk[++n] = (value[0] + 0x00) / 2;
        chunk[++n] = (value[1] + 0x00) / 2;
        chunk[++n] = (value[2] + 0x00) / 2;
        chunk[++n] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 400 )  {
        chunk[++n] = (value[0] + colR) / 2;
        chunk[++n] = (value[1] + colG) / 2;
        chunk[++n] = (value[2] + colB) / 2;
        chunk[++n] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 200 ) {
        chunk[n++] = chunk[n - 9] + 0x05
        chunk[n++] = chunk[n - 8] + 0x05
        chunk[n++] = chunk[n - 7] + 0x05
        chunk[n++] = 255;
      } else {
        chunk[++n] = chunk[n + 2] + 0x01;
        chunk[++n] = chunk[n + 3] + 0x01;
        chunk[++n] = chunk[n + 4] + 0x01;
        chunk[++n] = 255;
      }
    })
  }

  */


  effects.lope = function (chunk, dupBuffer, opts) {
    var opts = opts || {};
    var gamma = opts.depth || 1;
    var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;

    var coloredPixels = [];

  var i = 0;

  while (i < chunk.length) {
    coloredPixels.push([ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]])
    i += 4;
  }

  var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 100 ) {
        chunk[n++] = (array[index + 7] && array[index + 7][1]) || 100;
        chunk[n++] = (array[index + 4] && array[index + 4][2]) || 100;
        chunk[n++] = (array[index + 1] && array[index + 1][0]) || 100;
        chunk[n++] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 200 )  {
        chunk[n++] = (array[index + 5] && array[index + 5][1]) || 200;
        chunk[n++] = (array[index + 2] && array[index + 2][2]) || 200;
        chunk[n++] = (array[index + 1] && array[index + 1][0]) || 200;
        chunk[n++] = 255;
      } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
        chunk[n++] = (array[index + 3] && array[index + 3][2]) || 15;
        chunk[n++] = (array[index + 5] && array[index + 5][0]) || 15;
        chunk[n++] = (array[index + 9] && array[index + 9][1]) || 15;
        chunk[n++] = 255;
      } else {
        chunk[n++] = (array[index + 7] && array[index + 7][2]) || 15;
        chunk[n++] = (array[index + 4] && array[index + 4][0]) || 15;
        chunk[n++] = (array[index + 1] && array[index + 1][2]) || 15;
        chunk[n++] = 255;
      }
    })


  var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 600 ) {
        chunk[++n] = value[0] //(value[0] + 0x00) / 2;
        chunk[++n] = value[1] //(value[1] + 0x00) / 2;
        chunk[++n] = value[2] //(value[2] + 0x00) / 2;
        // chunk[++n] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 400 )  {
        chunk[++n] = (value[0] + colR) / 2;
        chunk[++n] = (value[1] + colG) / 2;
        chunk[++n] = (value[2] + colB) / 2;
        chunk[++n] = 255;
      } else if ( (value[0] + value[1] + value[2]) > 200 ) {
        chunk[n++] = chunk[n - 11] + 0x05
        chunk[n++] = chunk[n - 10] + 0x05
        chunk[n++] = chunk[n - 9] + 0x05
        chunk[n++] = 255;
      } else {
        chunk[++n] = chunk[n + 0];
        chunk[++n] = chunk[n + 0];
        chunk[++n] = chunk[n + 0];
        chunk[++n] = 255;
      }
    })
  }

  effects.xopeblend = function (chunk, dupBuffer, opts, paramsArray) {
    var opts = opts || {};
    var noise = opts.noise || false;
    var h = opts.height, w = opts.width;
    var paramsArray = paramsArray || chunk;
    var tester = 0; 
    for( var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        var index = (i*w*4) + (j*4);
        var rgb = {r: paramsArray[index], g: paramsArray[index+1], b: paramsArray[index+2]};
        var colorvalue = rgb.r + rgb.b + rgb.b;

         // Guards against the image shifting to the left
        if (j % (w-1) === 0) {
          continue;
        }

        if ( colorvalue > 600 ) {

          dupBuffer[index+0] = chunk[index+0];
          dupBuffer[index+1] = chunk[index+1];
          dupBuffer[index+2] = chunk[index+2];
          dupBuffer[index+3] = 255;

        } else if (colorvalue > 400) {

          dupBuffer[index+0] = chunk[(index+0) - (2*4)] || chunk[index + 4 ];
          dupBuffer[index+1] = chunk[(index+1) - (2*4)] || chunk[index + 5 ];
          dupBuffer[index+2] = chunk[(index+2) - (2*4)] || chunk[index + 6 ];
          dupBuffer[index+3] = 255;

        } else if (colorvalue > 200) {

          dupBuffer[index+0] = chunk[(index+0) - 8] || chunk[index+0]; 
          dupBuffer[index+1] = chunk[(index+1) - 8] || chunk[index+1]; 
          dupBuffer[index+2] = chunk[(index+2) - 8] || chunk[index+2]; 
          dupBuffer[index+3] = 255; 

        } else {

          if (noise == true){
            dupBuffer[index+0] = 255 - chunk[index + 4];
            dupBuffer[index+1] = 255 - chunk[index + 5];
            dupBuffer[index+2] = 255 - chunk[index + 6]; 
            dupBuffer[index+3] = 255;      
          } else {
            dupBuffer[index+0] = chunk[index+4];
            dupBuffer[index+1] = chunk[index+5];
            dupBuffer[index+2] = chunk[index+6];
            dupBuffer[index+3] = 255;
            
          }

        }


      }
    }

  }



  // Drot-Pinx
  effects.drot = function (chunk, dupBuffer,opts, paramsArray) {
    var opts = opts || {};
    var gamma = opts.depth || 1;
    var paramsArray = paramsArray || chunk;
    var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;

    var cl = chunk.length;

    var n = 0;

    for (var i = 0; i < cl; i++ ) {
      var c = i*4;
      var pixel = [ paramsArray[c+0], paramsArray[c+1], paramsArray[c+2], paramsArray[c+3] ] 
      if ( (pixel[0] + pixel[1] + pixel[2]) > 600 ) {
        dupBuffer[c+0] = 0x00 * gamma;
        dupBuffer[c+1] = 0x00 * gamma;
        dupBuffer[c+2] = 0x00 * gamma;
        dupBuffer[c+3] = 255;
      } else if ( (pixel[0] + pixel[1] + pixel[2]) > 400 )  {
        dupBuffer[c+0] = colR * gamma;
        dupBuffer[c+1] = colG * gamma;
        dupBuffer[c+2] = colB * gamma;
        dupBuffer[c+3] = 255;
      } else if ( (pixel[0] + pixel[1] + pixel[2]) > 200 ) {
        dupBuffer[c+0] = chunk[c - 4] + 0x05 * gamma;
        dupBuffer[c+1] = chunk[c - 4] + 0x05 * gamma;
        dupBuffer[c+2] = chunk[c - 4] + 0x05 * gamma;
        dupBuffer[c+3] = 255;
      } else {
        dupBuffer[c+0] = chunk[c] + 0x01 * gamma;
        dupBuffer[c+1] = chunk[c] + 0x01 * gamma;
        dupBuffer[c+2] = chunk[c] + 0x01 * gamma;
        dupBuffer[c+3] = 255;
      }
    }

  }


  // NEW
  effects.minx = function(chunk, dupBuffer, opts) {
    
    var opts = opts || {};
    var gamma = opts.depth || 1;

    var cl = chunk.length;
    // var copyBuf = chunk.slice(0);
    var n = 0;
    for (var i = 0; i < cl; i++ ){
      var c = i*4;
      var pixel = [ chunk[c+0], chunk[c+1], chunk[c+2], chunk[c+3] ] 
     
        if ( (pixel[0] + pixel[1] + pixel[2]) > 100 ) {
          dupBuffer[c+0] = (chunk [c + (c*7)] && chunk[c * (c*7) + 1]) * gamma || 100 * gamma;
          dupBuffer[c+1] = (chunk [c + (c*4)] && chunk[c * (c*4) + 2]) * gamma || 100 * gamma;
          dupBuffer[c+2] = (chunk [c + (c*2)] && chunk[c * (c*1) + 1]) * gamma || 100 * gamma;
          dupBuffer[c+3] = 255;
        } else if ( (pixel[0] + pixel[1] + pixel[2]) > 200 )  {
          dupBuffer[c+0] = (chunk [c + (c*5)] && chunk[c + (c*5) + 1]) * gamma || 200 * gamma;
          dupBuffer[c+1] = (chunk [c + (c*2)] && chunk[c + (c*2) + 2]) * gamma || 200 * gamma;
          dupBuffer[c+2] = (chunk [c + (c*1)] && chunk[c + (c*1) + 0]) * gamma || 200 * gamma;
          dupBuffer[c+3] = 255
        } else if ( (pixel[0] + pixel[1] + pixel[2]) < 50 && (pixel[0] + pixel[1] + pixel[2]) > 400  ) {
          dupBuffer[c+0] = (chunk [c + (c*3)] && chunk[c + (c*3) + 2]) * gamma || 15 * gamma;
          dupBuffer[c+1] = (chunk [c + (c*5)] && chunk[c + (c*5) + 0]) * gamma || 15 * gamma;
          dupBuffer[c+2] = (chunk [c + (c*9)] && chunk[c + (c*9) + 1]) * gamma || 15 * gamma;
          dupBuffer[c+3] = 255;
        } else {
          dupBuffer[c+0] = (chunk[c + (c*7)] && chunk[c + (c*7) + 2]) * gamma || 15 * gamma;
          dupBuffer[c+1] = (chunk[c + (c*4)] && chunk[c + (c*4) + 0]) * gamma || 15 * gamma;
          dupBuffer[c+2] = (chunk[c + (c*1)] && chunk[c + (c*1) + 2]) * gamma || 15 * gamma;
          dupBuffer[c+3] = 255;
        }
    }

  }

  // NEW
  effects.highcontrast = function (chunk, dupBuffer, opts) {
    var opts = opts || {};
    var gamma = opts.gamma || 1;
    var offset = opts.offset || 0;
      var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 0xFF,
        colG = colorObj.g || 0xCC,
        colB = colorObj.b || 0xFF;
    var h = opts.height, w = opts.width;

    for (var x = 0; x < h; x++) {
      for (var y = 0; y < w; y++ ) {
        var index = (x*w*4) + (y*4);
        var pixel = [ chunk[index+0], chunk[index+1], chunk[index+2] ]; 

          if ( (pixel[0] + pixel[1] + pixel[2]) > 400 ) {
            dupBuffer[index + 0 ] = chunk[ index + 0] + colR;
            dupBuffer[index + 1 ] = chunk[ index + 1] + colG;
            dupBuffer[index + 2 ] = chunk[ index + 2] + colB;
            dupBuffer[index + 3 ] = 255;
          }  else {
            dupBuffer[index + 0 ] = ~(chunk[ index + 0]) 
            dupBuffer[index + 1 ] = ~(chunk[ index + 1]) 
            dupBuffer[index + 2 ] = ~(chunk[ index + 2]) 
            dupBuffer[index + 3 ] = 255; 
          }


      }
    }


  }




  // NEW NEW NEW!
  effects.ranebowe = function (chunk, dupBuffer, opts) {
    var opts = opts || {};
    var gamma = opts.gamma || 1;
    var offset = opts.offset || 0;
    var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;
    var h = opts.height, w = opts.width;

    var increase, counter, color;
        increase = Math.PI * 2 / 255;
        color = {r: 0, g: 0, b:0};
    for (var i = 0; i < h; i++) {
        counter = 0;
        for (var j = 0; j < w; j++) {     
            var index = (i*w*4) + (j*4);

            var rgba  = {
                r: chunk[index],
                g: chunk[index + 1],
                b: chunk[index + 2],
                a: chunk[index + 3]
            };
         
            color.r = i; // Math.floor( (Math.sin (counter) / 2 + 0.5) * 255 );
            color.g = Math.floor( (Math.sin (counter) / 2 + 0.5) * 255 );
            color.b = Math.floor( (Math.cos (counter) / 2 + 0.5) * 255 );

            dupBuffer[index]     = (rgba.r + color.r) & 255;
            dupBuffer[index + 1] = (rgba.g + color.g) & 255;
            dupBuffer[index + 2] = (rgba.b + color.b) & 255;
            dupBuffer[index + 3] = 255;
        }
    }
  }

  // NEW NEW NEW -- possible ozor-rozo uses a good deal of effect options;
  effects.olroloc = function (chunk, dupBuffer, opts){
    var opts = opts || {};
    var gamma = opts.depth || 1;
    var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;
    var h = opts.height, w = opts.width;

      for(var x = 0; x < h; x++) {
        for(var y = 0; y < w; y++) {
          var index = (x*w*4) + (y*4);
          dupBuffer[index + 0] = (chunk[index + 0] / colR) * gamma * (x+y) >>> 0;
          dupBuffer[index + 1] = (chunk[index + 1] / colG) * gamma * (x+y) >>> 0;
          dupBuffer[index + 2] = (chunk[index + 2] / colB) * gamma * (x+y) >>> 0;
          dupBuffer[index + 3] = 255;
          
        }
      }
  }



  effects.mixcolor = function (chunk, dupBuffer, opts) {

    var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;
    var h = opts.height, w = opts.width;
   
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {    
        var index = (x*w+y)*4;
        
        chunk[index]     = Math.ceil((chunk[index  ] + colR) / 2);
        chunk[index + 1] = Math.ceil((chunk[index+1] + colG) / 2);
        chunk[index + 2] = Math.ceil((chunk[index+2] + colB) / 2);
        chunk[index + 3] = 255;

      }
    }

  }


  //  ========================================
  //  Inverse



  effects.inverse = function(chunk, dupBuffer, opts) {

    for (var i = 0, dl = chunk.length; i < dl; i += 4) {
        dupBuffer[i]     = 255 - chunk[i]; // red
        dupBuffer[i + 1] = 255 - chunk[i + 1]; // green
        dupBuffer[i + 2] = 255 - chunk[i + 2]; // blue
      }
  }


  // =========================================
  // Mirror


  effects.rever = function (chunk, dupBuffer, opts) {
      var opts = opts || {};
      var gamma = opts.gamma || 1;
      var offset = opts.offset || 0;
      var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;

      var length = chunk.length;
      var reversed = new Uint8Array(length);
      var i = 0 ;
      while (i < length) {
    
        reversed[length - i] = chunk[(++i)+5];   
        reversed[length - i] = chunk[(++i)+3];   
        reversed[length - i] = chunk[(++i)+3];   
        reversed[length - i] = chunk[(++i)+3];   

      }
      var i = 0;
      while(i < length) {
        dupBuffer[i+2] = i &1 ? reversed[(++i)+1] * gamma : reversed[(++i)+1]  * gamma;
        dupBuffer[i] = i &1 ? reversed[(++i)+2]   * gamma : reversed[(++i)-2 ] * gamma;
        dupBuffer[i+2] = i&1 ?reversed[(++i)+ 3]  * gamma : reversed[(++i)-4 ] * gamma;
        dupBuffer[i+2] = i&1 ?reversed[(++i)+ 3]  * gamma : reversed[(++i)-4 ] * gamma;
    }
  }



  effects.reversi = function (chunk, dupBuffer, opts) {
    // Reversi - great color
      var gamma = opts.depth || 1;
      var colR = opts.colorR || 200; 
      var colG = opts.colorG || 200;
      var colB = opts.colorB || 200;
      var length = chunk.length;
      var i = 0 ;
      while (i < length) {  
        dupBuffer[length - i] = chunk[(++i)+4];   
        dupBuffer[length - i] = chunk[(++i)+2];   
        dupBuffer[length - i] = chunk[(++i)+3];
        dupBuffer[length - i] = chunk[(++i)+2];   
        
        }

  }

  //NICE
  effects.isreversi = function (chunk, reversed, opts) {
    // Reversi - great color
      var gamma = opts.depth || 1;
      var h = opts.height, w = opts.width;

      var length = chunk.length;
      for (var x= 0; x< h; x++) {
        for (var y = 0; y < w; y++) {
          var index = (x*w+y)*4;

          reversed[--length] = chunk[index + 3];// a a 0+3, 1+1, 2-1, 3-3
          reversed[--length] = chunk[index + 2];// b b 
          reversed[--length] = chunk[index + 1];// g g 
          reversed[--length] = chunk[index + 0];// r r


        }
      }

  }


  effects.mirror_top_to_bottom = function (chunk, dupBuffer, opts) {

    var length = chunk.length, h = opts.height, w = opts.width;
    var half = Math.round(h / 2);
    for (var x= 0; x< h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y)*4;
        if (x > half) { 
          dupBuffer[index + 0] = chunk[ ((h-x) * w*4) + (y * 4)  + 0];
          dupBuffer[index + 1] = chunk[ ((h-x) * w*4) + (y * 4)  + 1];
          dupBuffer[index + 2] = chunk[ ((h-x) * w*4) + (y * 4)  + 2];
          dupBuffer[index + 3] = 255;
          
        } else {
          dupBuffer[index + 0] = chunk[index + 0];
          dupBuffer[index + 1] = chunk[index + 1];
          dupBuffer[index + 2] = chunk[index + 2];
          dupBuffer[index + 3] = 255;
        }


      }
    }

  }


  effects.mirror_bottom_to_top = function (chunk, dupBuffer, opts) {

    var length = chunk.length, h = opts.height, w = opts.width;
    var half = Math.round(h / 2);
    for (var x= 0; x< h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y)*4;
        if (x < half) { 
          dupBuffer[index + 0] = chunk[ ((h-x) * w*4) + (y * 4)  + 0];
          dupBuffer[index + 1] = chunk[ ((h-x) * w*4) + (y * 4)  + 1];
          dupBuffer[index + 2] = chunk[ ((h-x) * w*4) + (y * 4)  + 2];
          dupBuffer[index + 3] = 255;
          
        } else {
          dupBuffer[index + 0] = chunk[index + 0];
          dupBuffer[index + 1] = chunk[index + 1];
          dupBuffer[index + 2] = chunk[index + 2];
          dupBuffer[index + 3] = 255;
        }


      }
    }

  }


  effects.mirror_left_to_right = function (chunk, dupBuffer, opts) {

      var length = chunk.length, h = opts.height, w = opts.width;
      var half = w / 2;
      for (var x= 0; x< h; x++) {
        for (var y = 0; y < w; y++) {
          var index = (x*w+y)*4;
          if (y > half) { 
            dupBuffer[index + 0] = chunk[ (x*w*4) + ((w-y)*4) + 0];
            dupBuffer[index + 1] = chunk[ (x*w*4) + ((w-y)*4) + 1];
            dupBuffer[index + 2] = chunk[ (x*w*4) + ((w-y)*4) + 2];
            dupBuffer[index + 3] = 255;
            
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          }
        }
      }
  }



  effects.mirror_right_to_left = function (chunk, dupBuffer, opts) {

      var length = chunk.length, h = opts.height, w = opts.width;
      var half = w / 2;
      for (var x= 0; x< h; x++) {
        for (var y = 0; y < w; y++) {
          var index = (x*w+y)*4;
          if (y > half) { 
            dupBuffer[index + 0] = chunk[ (x*w*4) + ((w-y)*4) + 0];
            dupBuffer[index + 1] = chunk[ (x*w*4) + ((w-y)*4) + 1];
            dupBuffer[index + 2] = chunk[ (x*w*4) + ((w-y)*4) + 2];
            dupBuffer[index + 3] = 255;
            
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          }
        }
      }
  }



  effects.mirror_half_bottom_rl = function (chunk, dupBuffer, opts) {
    
    var length = chunk.length, h = opts.height, w = opts.width;
    var half = h / 2;

    for (var x= 0; x< h; x++) {
      for (var y = 0; y < w; y++) {
        var index = (x * w + y)*4;
        if (x > half) { 
          dupBuffer[index + 0] = chunk[ (x*w*4) + ((w-y)*4) + 0];
          dupBuffer[index + 1] = chunk[ (x*w*4) + ((w-y)*4) + 1];
          dupBuffer[index + 2] = chunk[ (x*w*4) + ((w-y)*4) + 2];
          dupBuffer[index + 3] = 255;
          
        } else {
          chunk[index + 0] = chunk[index + 0];
          chunk[index + 1] = chunk[index + 1];
          chunk[index + 2] = chunk[index + 2];
          chunk[index + 3] = 255;
        }


      }
    }

  }



  effects.flip_left_half = function (chunk, dupBuffer, opts) {

    var length = chunk.length, h = opts.height, w = opts.width;
    var half = Math.round(w / 2);
    for (var x= 0; x< h; ++x) {
      for (var y = 0; y < w; ++y) {
        var index = (x * w + y)*4;
        if (y < half) { 
          dupBuffer[index + 0] = chunk[ ((h-x) * w*4) + (y * 4)  + 0];
          dupBuffer[index + 1] = chunk[ ((h-x) * w*4) + (y * 4)  + 1];
          dupBuffer[index + 2] = chunk[ ((h-x) * w*4) + (y * 4)  + 2];
          dupBuffer[index + 3] = 255;
          
        } else {
          dupBuffer[index + 0] = chunk[index + 0];
          dupBuffer[index + 1] = chunk[index + 1];
          dupBuffer[index + 2] = chunk[index + 2];
          dupBuffer[index + 3] = 255;
        }


      }
    }

  }




  effects.flip_right_half = function (chunk, dupBuffer, opts) {

    var length = chunk.length, h = opts.height, w = opts.width;
    var half = Math.round(w / 2);
    for (var x= 0; x< h; ++x) {
      for (var y = 0; y < w; ++y) {
        var index = (x * w + y)*4;
        if (y > half) { 
          dupBuffer[index + 0] = chunk[ ((h-x) * w*4) + (y * 4)  + 0];
          dupBuffer[index + 1] = chunk[ ((h-x) * w*4) + (y * 4)  + 1];
          dupBuffer[index + 2] = chunk[ ((h-x) * w*4) + (y * 4)  + 2];
          dupBuffer[index + 3] = 255;
          
        } else {
          dupBuffer[index + 0] = chunk[index + 0];
          dupBuffer[index + 1] = chunk[index + 1];
          dupBuffer[index + 2] = chunk[index + 2];
          dupBuffer[index + 3] = 255;
        }


      }
    }

  }



  effects.flip_bottom_half = function (chunk, dupBuffer, opts) {

    var h = opts.height, w = opts.width;
    var half = h / 2;
    var length = chunk.length;

      for (var x= 0; x< h; ++x) {
        for (var y = 0; y < w; ++y) {
          var index = (x * w + y)*4;
          if (x > half) { 
            dupBuffer[index + 0] = chunk[ (x*w*4) + ((w-y)*4) + 0];
            dupBuffer[index + 1] = chunk[ (x*w*4) + ((w-y)*4) + 1];
            dupBuffer[index + 2] = chunk[ (x*w*4) + ((w-y)*4) + 2];
            dupBuffer[index + 3] = 255;
            
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          }
        }
      }

  }



  effects.flip_top_half = function (chunk, dupBuffer, opts) {

    var h = opts.height, w = opts.width;
    var half = h / 2;
    var length = chunk.length;

      for (var x= 0; x< h; ++x) {
        for (var y = 0; y < w; ++y) {
          var index = (x * w + y)*4;
          if (x < half) { 
            dupBuffer[index + 0] = chunk[ (x*w*4) + ((w-y)*4) + 0]
            dupBuffer[index + 1] = chunk[ (x*w*4) + ((w-y)*4) + 1]
            dupBuffer[index + 2] = chunk[ (x*w*4) + ((w-y)*4) + 2]
            dupBuffer[index + 3] = 255;
            
          } else {
            dupBuffer[index + 0] = chunk[index + 0];
            dupBuffer[index + 1] = chunk[index + 1];
            dupBuffer[index + 2] = chunk[index + 2];
            dupBuffer[index + 3] = 255;
          }
        }
      }

  }



  effects.flip = function (chunk, dupBuffer, opts) {
      var opts = opts || {};
      var gamma = opts.gamma || 1;

      var length = chunk.length;
        var reversed = new Uint8Array(length);
        var i = 0 ;
        while (i < length) {
        // reversed[length - (i-2)] = chunk[++i];   
        reversed[length - i] = chunk[(++i)+5];   
        reversed[length - i] = chunk[(++i)+3];   
        reversed[length - i] = chunk[(++i)+3];  
        reversed[length - i] = chunk[(++i)+3];   
        // reversed[length - i] = 255; 
        // reversed[length - (i-1)] = chunk[++i];   
        }
        var i = 0;
        while(i < length) {
          chunk[i] =  reversed[(++i)+1];
          chunk[i] =  reversed[(++i)+2];
          chunk[i] =  reversed[(++i)+3];
          chunk[i] =  255;
      }
  }




  effects.flop = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // type: Mirror

    var h = opts.height, w = opts.width, x,y;

    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var index = (x*w+y)*4;
        var sIndex = (y*w+x)*4;
        var r = chunk[index];
        var g = chunk[index+1];
        var b = chunk[index+2];
        dupBuffer[index]   = chunk[sIndex];
        dupBuffer[index+1] = chunk[sIndex+1];
        dupBuffer[index+2] = chunk[sIndex+2];
        dupBuffer[index+3] = 255;
      }
    }
  }




  effects.mirrorup = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    // Type: Mirror

    var h = opts.height, w = opts.width, x,y;
   
    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var index = (x*w+y)*4;
        var sIndex = ((h-x)*w+(w-y))*4;
        var r = chunk[index];
        var g = chunk[index+1];
        var b = chunk[index+2];
        dupBuffer[index]   = chunk[sIndex];
        dupBuffer[index+1] = chunk[sIndex+1];
        dupBuffer[index+2] = chunk[sIndex+2];
        dupBuffer[index+3] = 255;
      }
    }

  }



  effects.mirrorleft = function ( chunk, dupBuffer, opts, paramsArray ) {
    
    
    var h = opts.height, w = opts.width, x,y;
   

    for (var x = 0; x < h; x++ ) {
      for (var y = 0; y < w; y++) {
        var index = (x*w+y)*4;
        var sIndex = (x*w+(w-y))*4;
        var r = chunk[index];
        var g = chunk[index+1];
        var b = chunk[index+2];
        dupBuffer[index]   = chunk[sIndex];
        dupBuffer[index+1] = chunk[sIndex+1];
        dupBuffer[index+2] = chunk[sIndex+2];
        dupBuffer[index+3] = 255;
      }
    }
  }






  // ================================================
  // in sickness and in health


  effects.sickness = function (chunk, dupBuffer, opts, paramsArray) {

      // Really doesnt look good past this value
      var gamma = 0.7;
    
      var paramsArray = paramsArray || chunk;
      var len = chunk.length, i = 0;
      while (i < len) {

        if ((paramsArray[i] + paramsArray[i+1] + paramsArray[i+2]) &1) {

              dupBuffer[i++] = ~(paramsArray[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
              dupBuffer[i++] = ~(paramsArray[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
              dupBuffer[i++] = ~(paramsArray[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
              dupBuffer[i++] = 255;
              
          } else {
            
              dupBuffer[i++] = (paramsArray[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
              dupBuffer[i++] = (paramsArray[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
              dupBuffer[i++] = (paramsArray[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
              dupBuffer[i++] = 255;

          }    
      }

  }



  effects.staticsplash =  function (chunk, dupBuffer, opts) {

    var gamma = opts.depth || 1;
    var len = chunk.length,i = 0;
      while (i < len) {
        if ((chunk[i] + chunk[i+1] + chunk[i+2]) &1) {
          chunk[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          chunk[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          chunk[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          // chunk[i++] = (chunk[i]&1) ? chunk[i] ^ chunk[i] * gamma : chunk[i] * gamma; // buzz
          chunk[i++] = 255
        } else {
          chunk[i++] = chunk[i]   * gamma;
          chunk[i++] = chunk[i-1] * gamma;
          chunk[i++] = chunk[i-2] * gamma;
          // chunk[i++] = chunk[i-2] * gamma;
          chunk[i++] = 255
        }
      }
  }

  effects.brucsh = function (chunk, dupBuffer, opts) {

      var gamma = opts.depth || 1;
      var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255; 
      var len = chunk.length, i = 0;
      while (i < len) {

              dupBuffer[i++] = ~(chunk[i]&1) ? chunk[i] ^ colR * gamma : chunk[i] * gamma; // buzz
              dupBuffer[i++] = ~(chunk[i]&1) ? chunk[i] ^ colG * gamma : chunk[i] * gamma; // buzz
              dupBuffer[i++] = ~(chunk[i]&1) ? chunk[i] ^ colB * gamma : chunk[i] * gamma; // buzz
              dupBuffer[i++] = 255;
          
      }

  }




  effects.curse = function (chunk, dupBuffer, opts) {

      var gamma = opts.depth || 1;
      var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;    
      var i = 0;
      var len = chunk.length
    
      while (i < len) {
        if ((chunk[i] + chunk[i+1] + chunk[i+2]) &1) {
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ colR * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ colG * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ colB * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = 255;

        } else {

          dupBuffer[i++] = ((chunk[i]+1)&1) ? chunk[i] ^ colR : Math.floor(chunk[i]* gamma); // buzz
          dupBuffer[i++] = ((chunk[i]+1)&1) ? chunk[i] ^ colG : Math.floor(chunk[i]* gamma); // buzz
          dupBuffer[i++] = ((chunk[i]+1)&1) ? chunk[i] ^ colB : Math.floor(chunk[i]* gamma); // buzz
          dupBuffer[i++] = 255;
        }
      }
  }



  effects.church = function (chunk, dupBuffer, opts) {

      var gamma = opts.depth || 1;
      var len = chunk.length
      var i = 0;
      var colorObj = colorObjectFromColorString(opts.color),
          colR = colorObj.r || 255,
          colG = colorObj.g || 255,
          colB = colorObj.b || 255;

      while (i < len) {
        if ((chunk[i] + chunk[i+1] + chunk[i+2]) &1) {
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ colR * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ colG * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = (chunk[i]&1) ? chunk[i] ^ colB * gamma : chunk[i] * gamma; // buzz
          dupBuffer[i++] = 255;

        } else {
            dupBuffer[i++] = chunk[i]   * gamma;
            dupBuffer[i++] = chunk[i-1] * gamma;
            dupBuffer[i++] = chunk[i-2] * gamma;
            dupBuffer[i++] = 255

        }
      }
  }



  effects.lazer = function (chunk, dupBuffer, opts, paramsArray) {

    var length = chunk.length;
    var paramsArray = paramsArray || chunk;
    var iterations = Math.ceil(length / 4);
    var startAt = length % 4;
    var i = 0;

    do {
        switch(startAt){
            case 0: dupBuffer[++i] = datsrt(chunk[i]); //R
            case 3: dupBuffer[++i] = datsrt(chunk[i]); //G
            case 2: dupBuffer[++i] = datsrt(chunk[i]); //B
            case 1: dupBuffer[++i] = datsrt(chunk[i]); //A
        }
        startAt = 0;
    } while (--iterations > 0);

    function datsrt( val ) {
      // process.stdout.write("val:"+ val+"chunk[i-1]"+chunk[i-1]  + "\033[0G")
      return val > paramsArray[i + 4] ? val : chunk[ i + 4] | 255 ;
    }

  }





  effects.flazer = function (chunk, dupBuffer, opts) {

    var length = chunk.length;  
    var iterations = Math.ceil(length / 4);
    var startAt = length % 4;
    var i = 0;

    do {
        switch(startAt){
            case 0: dupBuffer[++i] = datsrt(chunk[i]); //R
            case 3: dupBuffer[++i] = datsrt(chunk[i]); //G
            case 2: dupBuffer[++i] = datsrt(chunk[i]); //B
            case 1: dupBuffer[++i] = datsrt(chunk[i]); //A
        }
        startAt = 0;
    } while (--iterations > 0);

    function datsrt( val ) {

      return val > chunk[i + 4] ? val : chunk[ i + 4] | 255 ;
    }

  }

  effects.slazer = function (chunk, dupBuffer, opts) {
   
    var length = chunk.length;
    var iterations = Math.ceil(length / 4);
    var startAt = length % 4;
    var i = 0;

    do {
        switch(startAt){
            case 0: dupBuffer[++i] = datsrt(chunk[i]); //R
            case 3: dupBuffer[++i] = datsrt(chunk[i]); //G
            case 2: dupBuffer[++i] = datsrt(chunk[i]); //B
            case 1: dupBuffer[++i] = datsrt(chunk[i]); //A
        }
        startAt = 0;
    } while (--iterations > 0);

    function datsrt( val ) {

      return val > chunk[i + 4] ? val : ~(chunk[ i + 4] - chunk[i]) & 255;

    }


  }

  effects.sorto = function (chunk, dupBuffer, opts) {
   
    var length = chunk.length;
    var iterations = Math.ceil(length / 4);
    var startAt = length % 4;
    var i = 0;

    do {
        switch(startAt){
            case 0: dupBuffer[i++] = datsrt(chunk[i]); //R
            case 3: dupBuffer[i++] = datsrt(chunk[i]); //G
            case 2: dupBuffer[i++] = datsrt(chunk[i]); //B
            case 1: dupBuffer[i++] = 255;

        }
        startAt = 0;
    } while (--iterations > 0);

    function datsrt( val ) {
      
      return val > chunk[i + 4] ? (val + chunk[i + 4] / 2) : chunk[ i + 4] - chunk[i] ;
    }
  }



  // ======================================
  // Smosh (Simple dataMOSH)



  effects.roloc = function (chunk, dupBuffer, opts){



  var coloredPixels = [], i = 0, n = 0;
  while (i < chunk.length) {
    coloredPixels[n++] = [ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]];
    i += 4;
  }

    var n = 0;
    coloredPixels.forEach(function (value, index, array) {
      
      if (value[0] > array[index][0] ) {
        dupBuffer[ n - 4 ] = value[0];
        dupBuffer[ n - 8 ] = value[0];
        dupBuffer[ n++   ] = value[0];

      } else {
        dupBuffer[n++] = array[index][0];
      }

      if (value[1] > array[index][1] ) {
        dupBuffer[ n - 4 ] = value[1];
        dupBuffer[ n - 8 ] = value[1];
        dupBuffer[ n++   ] = value[1];

      } else {
        dupBuffer[n++] = array[index][0];
      }

      if (value[2] > array[index][2] ) {
        dupBuffer[ n - 4 ] = value[2];
        dupBuffer[ n - 8 ] = value[2];
        dupBuffer[ n++   ] = value[2];

      } else {
        dupBuffer[n++] = array[index][2];
      }

      dupBuffer[n++] = 255;


    })


  }



  effects.posht = function (chunk, dupBuffer, opts, paramsArray) {
    

    var h = opts.height, w = opts.width;
    var paramsArray = paramsArray || chunk;


    for( var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        var index = (i*w*4) + (j*4);
        var rgb = {r: paramsArray[index], g: paramsArray[index+1], b: paramsArray[index+2]};
        var colorvalue = rgb.r + rgb.b + rgb.b;
        
        if (j % (w-1) === 0 ) {
          dupBuffer[index+0] = chunk[index+0]
          dupBuffer[index+1] = chunk[index+1]
          dupBuffer[index+2] = chunk[index+2]
          dupBuffer[index+3] = 255;
          continue;
        }
        // Purple - Yellow
        if (colorvalue > 100 &&  (j > 20) && (j + 21) < w) { // purple
          dupBuffer[index+0] = (chunk[index - (19*4)+1]  +  chunk[index - (4 *4)+0]) / 2;
          dupBuffer[index+1] = (chunk[index + (20*4)+2]  +  chunk[index - (19*4)+1]) / 2;
          dupBuffer[index+2] = (chunk[index - (4 *4)+0]  +  chunk[index + (20*4)+2]) / 2;
          dupBuffer[index+3] = 255; 
        } else if (colorvalue > 50  && (j > 20) && (j + 21) < w){
          // cyan-red
          dupBuffer[index+0] = (chunk[index - (13*4)+2] + chunk[index - (13*4)+2])  / 2;
          dupBuffer[index+1] = (chunk[index + (15*4)+0] + chunk[index + (4 *4)+1])  / 2;
          dupBuffer[index+2] = (chunk[index + (4 *4)+1] + chunk[index + (15*4)+0])  / 2;
          dupBuffer[index+3] = 255; 
        } else if ( (j > 11) && ((j + 11) < w ) ) {
          // Orange - blue
          dupBuffer[index+0] = (chunk[index + (7  *4)+2] + chunk[index + (4  *4)+0]) / 2;
          dupBuffer[index+1] = (chunk[index + (4  *4)+0] + chunk[index + (7  *4)+2]) / 2;
          dupBuffer[index+2] = (chunk[index - (10 *4)+1] + chunk[index - (10 *4)+1]) / 2;
          dupBuffer[index+3] = 255; 
        } else {
          dupBuffer[index+0] = (chunk[index+0] + chunk[index+1]) / 2;
          dupBuffer[index+1] = (chunk[index+1] + chunk[index+2]) / 2;
          dupBuffer[index+2] = (chunk[index+2] + chunk[index+0]) / 2;
          dupBuffer[index+3] = 255;
        }
      }
    }
  }


  effects.losht = function (chunk, dupBuffer, opts, paramsArray) {
    
    var h = opts.height, w = opts.width;
    var paramsArray = paramsArray || chunk;

    for( var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        var index = (i*w+j)*4; 
        var rgb = {r: paramsArray[index], g: paramsArray[index+1], b: paramsArray[index+2]};
        var colorvalue = rgb.r + rgb.b + rgb.b;
        
        if (j % (w-1) === 0 ) {
          dupBuffer[index+0] = chunk[index+0]
          dupBuffer[index+1] = chunk[index+1]
          dupBuffer[index+2] = chunk[index+2]
          dupBuffer[index+3] = 255;
          continue;
        }

        if (colorvalue > 100 && (j > 20) && (j + 21) < w ) {
          dupBuffer[index+0] = (chunk[index - (19*4)+1]  +  chunk[index - (20 *4)+0]) / 2;
          dupBuffer[index+1] = (chunk[index + (20*4)+2]  +  chunk[index - (4*4)+1]) / 2;
          dupBuffer[index+2] = (chunk[index - (4 *4)+0]  +  chunk[index + (19*4)+2]) / 2;
          dupBuffer[index+3] = 255; 
        } else if (colorvalue > 50 && (j > 20) && (j + 21) < w ){

          dupBuffer[index+0] = (chunk[index - (13*4)+2] + chunk[index - (15*4)+2])  / 2;
          dupBuffer[index+1] = (chunk[index + (15*4)+0] + chunk[index + (4*4)+1])  / 2;
          dupBuffer[index+2] = (chunk[index + (4 *4)+1] + chunk[index + (13 *4)+0])  / 2;
          dupBuffer[index+3] = 255; 
        } else if ( (j > 11) && ((j + 11) < w ) ) {

          dupBuffer[index+0] = (chunk[index + (7  *4)+2] + chunk[index + (4  *4)+0]) / 2;
          dupBuffer[index+1] = (chunk[index + (4  *4)+0] + chunk[index + (10  *4)+2]) / 2;
          dupBuffer[index+2] = (chunk[index - (10 *4)+1] + chunk[index - (7 *4)+1]) / 2;
          dupBuffer[index+3] = 255; 
        } else {
          dupBuffer[index+0] = (chunk[index+0] + chunk[index+1]) / 2;
          dupBuffer[index+1] = (chunk[index+1] + chunk[index+2]) / 2;
          dupBuffer[index+2] = (chunk[index+2] + chunk[index+0]) / 2;
          dupBuffer[index+3] = 255;
        }
      }
    }

  }


  effects.fosht = function (chunk, dupBuffer, opts, paramsArray) {
   
    var h = opts.height, w = opts.width;
    var paramsArray = paramsArray || chunk;

   

    for( var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        var index = (i*w+j)*4; 
        var rgb = {r: paramsArray[index], g: paramsArray[index+1], b: paramsArray[index+2]};
        var colorvalue = rgb.r + rgb.b + rgb.b;
        
        if (j % (w-1) === 0 ) {
          dupBuffer[index+0] = chunk[index+0]
          dupBuffer[index+1] = chunk[index+1]
          dupBuffer[index+2] = chunk[index+2]
          dupBuffer[index+3] = 255;
          continue;
        }
        // Purple - Yellow
        if (colorvalue > 100 && (j > 20) && (j + 21) < w ) {
          dupBuffer[index+0] = (chunk[index - (19*4)+1]  +  chunk[index - (4 *4)+0]) / 2;
          dupBuffer[index+1] = (chunk[index + (20*4)+2]  +  chunk[index - (19*4)+1]) / 2;
          dupBuffer[index+2] = (chunk[index - (4 *4)+0]  +  chunk[index + (20*4)+2]) / 2;
          dupBuffer[index+3] = 255; 
        } else if (colorvalue > 50 && (j > 20) && (j + 21) < w ){
          // cyan-red
          dupBuffer[index+0] = (chunk[index - (13*4)+2] + chunk[index + (4 *4)+1])  / 2;
          dupBuffer[index+1] = (chunk[index + (15*4)+0] + chunk[index - (13*4)+2])  / 2;
          dupBuffer[index+2] = (chunk[index + (4 *4)+1] + chunk[index + (15*4)+0])  / 2;
          dupBuffer[index+3] = 255; 
        } else if ( (j > 11) && ((j + 10) < w) ) {
          // Orange - blue
          dupBuffer[index+0] = (chunk[index + (7  *4)+2] + chunk[index - (10 *4)+1]) / 2;
          dupBuffer[index+1] = (chunk[index + (4  *4)+0] + chunk[index + (7  *4)+2]) / 2;
          dupBuffer[index+2] = (chunk[index - (10 *4)+1] + chunk[index + (4  *4)+0]) / 2;
          dupBuffer[index+3] = 255; 
        } else {
          dupBuffer[index+0] = (chunk[index+0] + chunk[index+2]) / 2;
          dupBuffer[index+1] = (chunk[index+1] + chunk[index+0]) / 2;
          dupBuffer[index+2] = (chunk[index+2] + chunk[index+1]) / 2;
          dupBuffer[index+3] = 255;
        }
      }
    }

  }



  effects.smosht = function (chunk, dupBuffer, opts, paramsArray) {

    var h = opts.height, w = opts.width;
    var paramsArray = paramsArray || chunk;
    for( var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        var index = (i*w*4) + (j*4);
        var rgb = {r: paramsArray[index], g: paramsArray[index+1], b: paramsArray[index+2]};
        var colorvalue = rgb.r + rgb.b + rgb.b;
        
        if (j % (w-1) === 0 ) {
          dupBuffer[index+0] = chunk[index+0]
          dupBuffer[index+1] = chunk[index+1]
          dupBuffer[index+2] = chunk[index+2]
          dupBuffer[index+3] = 255;
          continue;
        }
        if (colorvalue > 100) {
          dupBuffer[index+0] = chunk[index - (19*4)+1] || 255;
          dupBuffer[index+1] = chunk[index + (20*4)+2] || 0;
          dupBuffer[index+2] = chunk[index - (4 *4)+0] || 255;
          dupBuffer[index+3] = 255; 
        } else if (colorvalue > 50){
          dupBuffer[index+0] = chunk[index - (13*4)+2] || 255;
          dupBuffer[index+1] = chunk[index + (15*4)+0] || 255;
          dupBuffer[index+2] = chunk[index + (4 *4)+1] || 0;
          dupBuffer[index+3] = 255; 
        } else {
          dupBuffer[index+0] = chunk[index + (7*4)+2] || 0;
          dupBuffer[index+1] = chunk[index + (4*4)+0] || 255;
          dupBuffer[index+2] = chunk[index - (10 *4)+1] || 255;
          dupBuffer[index+3] = 255; 
        }
      }
    }
  }



  effects.slosh = function (chunk, dupBuffer, opts) {

    var h = opts.height, w = opts.width;
    var colorObj = colorObjectFromColorString(opts.color),
      colR = colorObj.r || 255,
      colG = colorObj.g || 255,
      colB = colorObj.b || 255;


    for( var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        var index = (i*w*4) + (j*4);
        var rgb = {r: chunk[index], g: chunk[index+1], b: chunk[index+2]};
        var colorvalue = rgb.r + rgb.b + rgb.b;
        
        if (j % (w-1) === 0 ) {
          dupBuffer[index+0] = chunk[index+0]
          dupBuffer[index+1] = chunk[index+1]
          dupBuffer[index+2] = chunk[index+2]
          dupBuffer[index+3] = 255;
          continue;
        }
        if (colorvalue > 100) {
          dupBuffer[index+0] = chunk[index - (19*4)+1] || 255;
          dupBuffer[index+1] = chunk[index + (20*4)+2] || 0;
          dupBuffer[index+2] = chunk[index - (4 *4)+0] || 255;
          dupBuffer[index+3] = 255; 
        } else if (colorvalue > 50){
          dupBuffer[index+0] = chunk[index - (13*4)+2] || 255;
          dupBuffer[index+1] = chunk[index + (15*4)+0] || 255;
          dupBuffer[index+2] = chunk[index + (4 *4)+1] || 0;
          dupBuffer[index+3] = 255; 
        } else {
          dupBuffer[index+0] = chunk[index + (7*4)+2] || 0;
          dupBuffer[index+1] = chunk[index + (4*4)+0] || 255;
          dupBuffer[index+2] = chunk[index - (10 *4)+1] || 255;
          dupBuffer[index+3] = 255; 
        }
      }
    }
  }




  effects.smoshz = function (chunk, dupBuffer, opts) {

    var h = opts.height, w = opts.width;
    for( var i = 0; i < h; ++i) {
      for (var j = 0; j < w; ++j) {
        var index = (i*w*4) + (j*4);
        var rgb = {r: chunk[index], g: chunk[index+1], b: chunk[index+2]};
        var colorvalue = rgb.r + rgb.b + rgb.b;
        
        if (j % (w-1) === 0 ) {
          dupBuffer[index+0] = chunk[index+0];
          dupBuffer[index+1] = chunk[index+1];
          dupBuffer[index+2] = chunk[index+2];
          dupBuffer[index+3] = 255;
          continue;
        }
        if (colorvalue > 100) {
          dupBuffer[index+0] = chunk[index - (19*4)+0] || 255;
          dupBuffer[index+1] = chunk[index + (20*4)+1] || 0;
          dupBuffer[index+2] = chunk[index - (4 *4)+2] || 255;
          dupBuffer[index+3] = 255; 
        } else if (colorvalue > 50){
          dupBuffer[index+0] = chunk[index - (13*4)+0] || 255;
          dupBuffer[index+1] = chunk[index + (15*4)+1] || 255;
          dupBuffer[index+2] = chunk[index + (4 *4)+2] || 0;
          dupBuffer[index+3] = 255; 
        } else {
          dupBuffer[index+0] = chunk[index + (7 *4)+0] || 0;
          dupBuffer[index+1] = chunk[index + (4 *4)+1] || 255;
          dupBuffer[index+2] = chunk[index - (10*4)+2] || 255;
          dupBuffer[index+3] = 255; 
        }
      }
    }
  }





  effects.slip_stream = function (chunk, dupBuffer, opts) {


    var h = opts.height, w = opts.width, index, value;

    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        dupBuffer[ index  ] = chunk[index - 3] + 0x05;
        dupBuffer[index +1] = chunk[index - 2] + 0x05;
        dupBuffer[index +2] = chunk[index - 1] + 0x05;
        dupBuffer[index +3] = 0xFF;
      }
    }

  }





  effects.sleep = function (chunk, dupBuffer, opts) {


    var h = opts.height, w = opts.width, index, value;
    var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;
    
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        value = chunk[index] + chunk[index+1] + chunk[+2];
        if (value > 100 && (y + 7) < w ) {
          dupBuffer[ index  ] = chunk[index + 29] || 100;
          dupBuffer[index +1] = chunk[index + 18] || 100;
          dupBuffer[index +2] = chunk[index +  4] || 100;
          dupBuffer[index +3] = 0xFF;
        } else if (value < 50 && (y + 7) < w ) {
          dupBuffer[ index  ] = chunk[index + 21] || 200;
          dupBuffer[index +1] = chunk[index + 10] || 200;
          dupBuffer[index +2] = chunk[index +  4] || 200;
          dupBuffer[index +3] = 0xFF;
        } else  {
          dupBuffer[ index  ] = chunk[index + 30] || 15;
          dupBuffer[index +1] = chunk[index + 16] || 15;
          dupBuffer[index +2] = chunk[index +  6] || 15;
          dupBuffer[index +3] = 0xFF;
        }
      }
    }

    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        value = chunk[index] + chunk[index+1] + chunk[+2];
        if (value > 600 ) {
          dupBuffer[ index  ] = 0xFF;
          dupBuffer[index +1] = 0xFF;
          dupBuffer[index +2] = 0xFF;
          dupBuffer[index +3] = 0xFF;
        } else if (value > 400 ) {
          dupBuffer[ index  ] = colR;
          dupBuffer[index +1] = colG;
          dupBuffer[index +2] = colB;
          dupBuffer[index +3] = 0xFF;
        } else if (value > 200 ) {
          dupBuffer[ index  ] = dupBuffer[index - 3] + 0x05;
          dupBuffer[index +1] = dupBuffer[index - 2] + 0x05;
          dupBuffer[index +2] = dupBuffer[index - 1] + 0x05;
          dupBuffer[index +3] = 0xFF;
        } else  {
          dupBuffer[ index  ] = dupBuffer[index+1] + 0x01;
          dupBuffer[index +1] = dupBuffer[index+2] + 0x01;
          dupBuffer[index +2] = dupBuffer[index+3] + 0x01;
          dupBuffer[index +3] = 0xFF;
        }
      }
    }
    

  }





  effects.stalt = function (chunk, dupBuffer, opts, paramsArray) {

    var h = opts.height, w = opts.width;
    var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;
    var paramsArray = paramsArray || chunk;

    for (var x = h; --x;) {
      for (var y = w; --y;) {
        var index = (x*w*4) + (y*4);
        var colorvalue = paramsArray[index+0] + paramsArray[index+1] + paramsArray[index+2];


        if (y % (w-1) === 0 || y === w) {
          dupBuffer[index+0] = chunk[index+0];
          dupBuffer[index+1] = chunk[index+1];
          dupBuffer[index+2] = chunk[index+2];
          dupBuffer[index+3] = 255;
          continue;
        }

        if (colorvalue > 600) {
          dupBuffer[index+0] = 0;
          dupBuffer[index+1] = 0;
          dupBuffer[index+2] = 0;
          dupBuffer[index+3] = 255;
        } else if (colorvalue > 400) {
          dupBuffer[index+0] = colR;
          dupBuffer[index+1] = colG;
          dupBuffer[index+2] = colB;
          dupBuffer[index+3] = 255;
        } else if (colorvalue > 200) {
          dupBuffer[index+0] = chunk[index + (7*4) - 3 ] || 100 + 5; // 4 - 1 = -3
          dupBuffer[index+1] = chunk[index + (4*4) - 2 ] || 100 + 5; // 4 - 2 = -2
          dupBuffer[index+2] = chunk[index + (1*4) - 1 ] || 100 + 5; // 4 - 3 = -1
          dupBuffer[index+3] = 255;
        } else if (colorvalue > 100) {
          dupBuffer[index+0] = chunk[index + (7*4)+1] || 100;
          dupBuffer[index+1] = chunk[index + (4*4)+2] || 100;
          dupBuffer[index+2] = chunk[index + (1*4)+0] || 100;
          dupBuffer[index+3] = 255; 
        } else if (colorvalue > 50){
          dupBuffer[index+0] = chunk[index + (3*4)+2] || 15;
          dupBuffer[index+1] = chunk[index + (5*4)+0] || 15;
          dupBuffer[index+2] = chunk[index + (9*4)+1] || 15;
          dupBuffer[index+3] = 255; 
        } else {
          dupBuffer[index+0] = chunk[index + (7*4)+2] || 15;
          dupBuffer[index+1] = chunk[index + (4*4)+0] || 15;
          dupBuffer[index+2] = chunk[index + (1*4)+2] || 15;
          dupBuffer[index+3] = 255; 
        }
      }
    }
  }


  // Sleep without sleep
  effects.bonk = function (chunk, dupBuffer, opts) {

    var coloredPixels = [], l = chunk.length, i = 0, n = 0;
    while (i < l) {
      coloredPixels[n++] = [ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]];
      i += 4;
    }

    var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 100 ) {
        dupBuffer[n++] = (array[index + 7] && array[index + 7][1]) || 100;
        dupBuffer[n++] = (array[index + 4] && array[index + 4][2]) || 100;
        dupBuffer[n++] = (array[index + 1] && array[index + 1][0]) || 100;
        dupBuffer[n++] = 255;
        // chunk[n++] = (array[index + 1] && array[index + 1][0]) || 100;
      } else if ( (value[0] + value[1] + value[2]) > 200 )  {
        dupBuffer[n++] = (array[index + 5] && array[index + 5][1]) || 200;
        dupBuffer[n++] = (array[index + 2] && array[index + 2][2]) || 200;
        dupBuffer[n++] = (array[index + 1] && array[index + 1][0]) || 200;
        dupBuffer[n++] = 255;
        // chunk[n++] = (array[index + 1] && array[index + 1][0]) || 200;
      } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
        dupBuffer[n++] = (array[index + 3] && array[index + 3][2]) || 15;
        dupBuffer[n++] = (array[index + 5] && array[index + 5][0]) || 15;
        dupBuffer[n++] = (array[index + 9] && array[index + 9][1]) || 15;
        dupBuffer[n++] = 255;
        // chunk[n++] = (array[index + 9] && array[index + 9][1]) || 15;
      } else {
        dupBuffer[n++] = (array[index + 7] && array[index + 7][2]) || 15;
        dupBuffer[n++] = (array[index + 4] && array[index + 4][0]) || 15;
        dupBuffer[n++] = (array[index + 1] && array[index + 1][2]) || 15;
        dupBuffer[n++] = 255;
        // chunk[n++] = (array[index + 1] && array[index + 1][2]) || 15;
      }
    })
  }



  // Bonk moving backwards
  effects.blink = function (chunk, dupBuffer, opts) {

    var coloredPixels = [], l = chunk.length, i = 0, n = 0;
    while (i < l) {
      coloredPixels[n++] = [ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]];
      i += 4;
    }

    var n = 0;
    coloredPixels.forEach(function(value, index, array) {
      if ( (value[0] + value[1] + value[2]) > 100 ) {
        dupBuffer[n++] = (array[index + 17] && array[index + 17][1]) || 100;
        dupBuffer[n++] = (array[index - 14] && array[index - 14][2]) || 100;
        dupBuffer[n++] = (array[index + 10] && array[index + 10][0]) || 100;
        dupBuffer[n++] = 255;
        // dupBuffer[n++] = (array[index + 1] && array[index + 1][0]) || 100;
      } else if ( (value[0] + value[1] + value[2]) > 200 )  {
        dupBuffer[n++] = (array[index + 20] && array[index + 20][1]) || 200;
        dupBuffer[n++] = (array[index - 7] && array[index - 7][2]) || 200;
        dupBuffer[n++] = (array[index + 12] && array[index + 12][0]) || 200;
        dupBuffer[n++] = 255;
        // dupBuffer[n++] = (array[index + 1] && array[index + 1][0]) || 200;
      } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
        dupBuffer[n++] = (array[index + 3] && array[index + 3][2]) || 15;
        dupBuffer[n++] = (array[index - 5] && array[index - 5][0]) || 15;
        dupBuffer[n++] = (array[index + 9] && array[index + 9][1]) || 15;
        dupBuffer[n++] = 255;
        // dupBuffer[n++] = (array[index + 9] && array[index + 9][1]) || 15;
      } else {
        dupBuffer[n++] = (array[index + 4] && array[index + 4][2]) || 15;
        dupBuffer[n++] = (array[index + 4] && array[index + 4][0]) || 15;
        dupBuffer[n++] = (array[index + 11] && array[index + 11][2]) || 15;
        dupBuffer[n++] = 255;
        // dupBuffer[n++] = (array[index + 1] && array[index + 1][2]) || 15;
      }
    })
  }




  effects.blosh = function (chunk, dupBuffer, opts) {
   
    var coloredPixels = [], length = chunk.length, i = 0, n = 0;

    var colorObj = colorObjectFromColorString(opts.color),
        colR = colorObj.r || 255,
        colG = colorObj.g || 255,
        colB = colorObj.b || 255;

    while (i < length ) {
      coloredPixels[++n] = [ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]];
      i += 4;
    }

    var n = 0;
      coloredPixels.forEach(function(value, index, array) {
        var cache = absdetail(value);
          dupBuffer[n]   = cache[2];
          dupBuffer[n+1] = cache[2];
          dupBuffer[n+2] = cache[2];
          dupBuffer[n+3] = cache[3];
          n+=4;
      })
    //azwf
    var i = 0;
    var n = 0;
    while (i < length ) {
      coloredPixels[++n] = [ dupBuffer[i+0], dupBuffer[i+1], dupBuffer[i+2], dupBuffer[i+3]];
      i += 4;
    }
    var n = 0;
      coloredPixels.forEach(function(value, index, array) {
        if ( (value[0] + value[1] + value[2]) > 100 ) {
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[3];
        } else if ( (value[0] + value[1] + value[2]) > 200 )  {
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[3];
        } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[3];
        } else {
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[3];
        }
      })

    var i = 0;
    var n = 0;
    while (i < length ) {
      coloredPixels[++n] = [ dupBuffer[i+0], dupBuffer[i+1], dupBuffer[i+2], dupBuffer[i+3]];
      i += 4;
    }
    var n = 0;
      coloredPixels.forEach(function(value, index, array) {
        if ( (value[0] + value[1] + value[2]) > 100 ) {
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = 0xff;
        } else if ( (value[0] + value[1] + value[2]) > 200 )  {
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = 0xff;
        } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
          dupBuffer[n++] = value[3];
          dupBuffer[n++] = value[3];
          dupBuffer[n++] = value[3];
          dupBuffer[n++] = 0xff;
        } else {
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = 0xff;
        }
      })

    var i = 0;
    var n = 0;
    while (i < length ) {
      coloredPixels[++n] = [ dupBuffer[i+0], dupBuffer[i+1], dupBuffer[i+2], dupBuffer[i+3]];
      i += 4;
    }
    var n = 0;
    var testobj = [0,0,0,0,0];
      coloredPixels.forEach(function(value, index, array) {
        if ( (value[0] + value[1] + value[2]) > 100 ) {
          testobj[0]++;
          dupBuffer[n++] = (array[index - 19] && array[index - 19][1]) || colG;
          dupBuffer[n++] = (array[index + 20] && array[index + 20][2]) || colR;
          dupBuffer[n++] = (array[index - 4] && array[index - 4][0])   || colG;
          dupBuffer[n++] = 255;
        } else if ( (value[0] + value[1] + value[2]) > 200 )  {
          testobj[1]++;
          dupBuffer[n++] = colR;
          dupBuffer[n++] = colG;
          dupBuffer[n++] = colB;
          dupBuffer[n++] = 255;
        } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
          testobj[2]++;
          dupBuffer[n++] = (array[index + 13] && array[index + 13][2]) || colR;
          dupBuffer[n++] = (array[index - 15] && array[index - 15][0]) || colG;
          dupBuffer[n++] = (array[index + 9] && array[index + 9][1])   || colR;
          dupBuffer[n++] = 255;
         } else if ( (value[0] + value[1] + value[2]) > 50 && (value[0] + value[1] + value[2]) < 250  ) {
          testobj[3]++;
          dupBuffer[n++] = (array[index - 13] && array[index - 13][2]) || colG;
          dupBuffer[n++] = (array[index + 15] && array[index + 15][0]) || colG;
          dupBuffer[n++] = (array[index + 4] && array[index + 4][1])   || colR;
          dupBuffer[n++] = 255;
        } else {
          testobj[4]++;
          dupBuffer[n++] = (array[index + 7] && array[index + 7][1])   || colR;
          dupBuffer[n++] = (array[index + 4] && array[index + 4][2])   || colG;
          dupBuffer[n++] = (array[index - 10] && array[index - 10][0]) || colG;
          dupBuffer[n++] = 255;
        }
    })
   
  }



  effects.blish = function (chunk, dupBuffer, opts) {
    
    var coloredPixels = [], length = chunk.length, i = 0, n = 0;
    while (i < length ) {
      coloredPixels[++n] = [ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]];
      i += 4;
    }


    // abdetail
    var n = 0;
      coloredPixels.forEach(function(value, index, array) {
        var cache = absdetail(value);
          dupBuffer[n]   = cache[2];
          dupBuffer[n+1] = cache[2];
          dupBuffer[n+2] = cache[2];
          dupBuffer[n+3] = cache[3];
          n+=4;
      })
    //azwf
    var i = 0;
    var n = 0;
    while (i < length ) {
      coloredPixels[++n] = [ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]];

      i += 4;
    }
    var n = 0;
      coloredPixels.forEach(function(value, index, array) {
        if ( (value[0] + value[1] + value[2]) > 100 ) {
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[3];
        } else if ( (value[0] + value[1] + value[2]) > 200 )  {
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[3];
        } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[0];
          dupBuffer[n++] = value[3];
        } else {
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[3];
        }
      })
    // sharpers
    var i = 0;
    var n = 0;
    while (i < length ) {
      coloredPixels[++n] = [ chunk[i+0], chunk[i+1], chunk[i+2], chunk[i+3]];

      i += 4;
    }
    var n = 0;
      coloredPixels.forEach(function(value, index, array) {
        if ( (value[0] + value[1] + value[2]) > 100 ) {
          dupBuffer[n++] = value[2] ;
          dupBuffer[n++] = value[2] ;
          dupBuffer[n++] = value[2] ;
          dupBuffer[n++] = value[3] ;
        } else if ( (value[0] + value[1] + value[2]) > 200 )  {
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[1];
          dupBuffer[n++] = value[3];
        } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 400  ) {
          dupBuffer[n++] = value[3];
          dupBuffer[n++] = value[3];
          dupBuffer[n++] = value[3];
          dupBuffer[n++] = value[3];
        } else {
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[2];
          dupBuffer[n++] = value[3];
        }
      })
    //smosh
    var i = 0;
    var n = 0;
   
    while (i < length ) {
      coloredPixels[++n] = [ dupBuffer[i+0], dupBuffer[i+1], dupBuffer[i+2], dupBuffer[i+3]];
      i += 4;
    }
    var n = 0;
      coloredPixels.forEach(function(value, index, array) {
        if ( (value[0] + value[1] + value[2]) < 100 ) {
          dupBuffer[n++] = value[0] > 100 && value[0] < 250  ? (array[index - 19] && array[index - 19][1]) || 255 : (array[index + 13] && array[index + 13][2]) || 0;
          dupBuffer[n++] = value[1] > 100 && value[0] < 250  ? (array[index + 20] && array[index + 20][2]) || 0   : (array[index - 15] && array[index - 15][0]) || 255;
          dupBuffer[n++] = value[2] > 100 && value[0] < 250  ? (array[index - 4]  && array[index - 4][0])  || 255  : (array[index + 9]  && array[index + 9][1]) || 0;
          dupBuffer[n++] = value[3];
        } else if ( (value[0] + value[1] + value[2]) < 200 )  {
          dupBuffer[n++] = 255;
          dupBuffer[n++] = 255;
          dupBuffer[n++] = 255;
          dupBuffer[n++] = value[3];
        } else if ( (value[0] + value[1] + value[2]) > 50 && (value[0] + value[1] + value[2]) < 400  ) {
          dupBuffer[n++] = value[0] > 100 && value[0] < 250  ? (array[index + 13] && array[index + 13][2]) || 0   : (array[index - 19] && array[index - 19][1]) || 255;
          dupBuffer[n++] = value[1] > 100 && value[0] < 250  ? (array[index - 15] && array[index - 15][0]) || 255 : (array[index + 20] && array[index + 20][2]) || 0;
          dupBuffer[n++] = value[2] > 100 && value[0] < 250  ? (array[index + 9]  && array[index + 9][1])  || 0   : (array[index - 4]  && array[index - 4][0])  || 255;
          dupBuffer[n++] = value[3];
         } else if ( (value[0] + value[1] + value[2]) < 50 && (value[0] + value[1] + value[2]) > 250  ) {
          dupBuffer[n++] = value[0] > 100 && value[0] < 250  ? (array[index - 13] && array[index - 13][2]) || 255 : (array[index - 13] && array[index - 13][1]) || 255;
          dupBuffer[n++] = value[1] > 100 && value[1] < 250  ? (array[index + 15] && array[index + 15][0]) || 255 : (array[index + 15] && array[index + 15][2]) || 255;
          dupBuffer[n++] = value[2] > 100 && value[2] < 250  ? (array[index + 4]  && array[index + 4][1]) || 0    : (array[index + 4]  && array[index + 4][0])  || 0;
          dupBuffer[n++] = value[3];
        } else {
          dupBuffer[n++] = (array[index + 7] && array[index + 7][1]) || 0;
          dupBuffer[n++] = (array[index + 4] && array[index + 4][2]) || 255;
          dupBuffer[n++] = (array[index - 10] && array[index - 10][0]) || 255;
          dupBuffer[n++] = value[3];
        }
    })
   
  }


  effects.old_sharp = function (chunk, dupBuffer, opts) {  
    var h = opts.height, w = opts.width, index;

    var value, r, g, b;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index+1];
        b = chunk[index+2];
        value = r + g + b;
        if (value > 100) {
          dupBuffer[index]   = b;
          dupBuffer[index+1] = r;
          dupBuffer[index+2] = g;
        } else {
          dupBuffer[index] = g;
          dupBuffer[index+1] = g;
          dupBuffer[index+2] = g;
        }
        
      }
    }

  }



  effects.old_radioactive = function (chunk, dupBuffer, opts) {  
    var h = opts.height, w = opts.width, index;

    var value, r, g, b;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index+1];
        b = chunk[index+2];
        value = r + g + b;
        if (value > 100) {
          dupBuffer[index]   = g;
          dupBuffer[index+1] = g;
          dupBuffer[index+2] = g;
        } else if (value < 50) {
          dupBuffer[index]   = r;
          dupBuffer[index+1] = r;
          dupBuffer[index+2] = r;
        } else {
          dupBuffer[index]   = g;
          dupBuffer[index+1] = r;
          dupBuffer[index+2] = b;
        }
        
      }
    }

  }




  effects.old_colorizer = function (chunk, dupBuffer, opts) {  
    var h = opts.height, w = opts.width, index;

    var value, r, g, b;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index+1];
        b = chunk[index+2];
        value = r + g + b;
        if ( ((value > 100) || (value < 50))  && w > y + 4 ) {
          dupBuffer[index]   = chunk[index +  6]; // 1
          dupBuffer[index+1] = chunk[index + 10]; // 2
          dupBuffer[index+2] = chunk[index + 14]; // 3
        } else {
          dupBuffer[index]   = g;
          dupBuffer[index+1] = r;
          dupBuffer[index+2] = b;
        }
        
      }
    }

  }




  effects.old_colorizer_high = function (chunk, dupBuffer, opts) {  
    var h = opts.height, w = opts.width, index;

    var value, r, g, b;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index+1];
        b = chunk[index+2];
        value = r + g + b;
        if (value > 100 && w > y + 8 ) {
          dupBuffer[index]   = chunk[index + 29]; // 7
          dupBuffer[index+1] = chunk[index + 18]; // 4 
          dupBuffer[index+2] = chunk[index +  4]; // 1 
        } else if (value < 50 && w > y + 10 ) {
          dupBuffer[index]   = chunk[index + 14]; // 3
          dupBuffer[index+1] = chunk[index + 20]; // 5 
          dupBuffer[index+2] = chunk[index + 37]; // 9
        } else if (w > y + 8) {
          dupBuffer[index]   = chunk[index + 30]; // 7
          dupBuffer[index+1] = chunk[index + 16]; // 5
          dupBuffer[index+2] = chunk[index +  6]; // 1
        } else {
          dupBuffer[index]   = r;
          dupBuffer[index+1] = g;
          dupBuffer[index+2] = b;
        }
        
      }
    }

  }



  effects.old_rainblo = function (chunk, dupBuffer, opts) {  
    var h = opts.height, w = opts.width, index;

    var value, r, g, b;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index+1];
        b = chunk[index+2];
        value = r + g + b;
        if (value > 100 && 0 > y - 8 ) {
          dupBuffer[index]   = chunk[index - 29]; // 7
          dupBuffer[index+1] = chunk[index - 18]; // 4
          dupBuffer[index+2] = chunk[index -  4]; // 1
        } else if (value < 50 && 0 > y - 10 ) {
          dupBuffer[index]   = chunk[index - 14]; // 3
          dupBuffer[index+1] = chunk[index - 20]; // 5
          dupBuffer[index+2] = chunk[index - 37]; // 9
        } else if (0 > y - 8) {
          dupBuffer[index]   = chunk[index - 30]; // 7
          dupBuffer[index+1] = chunk[index - 16]; // 4
          dupBuffer[index+2] = chunk[index -  6]; // 1
        } else {
          dupBuffer[index]   = r;
          dupBuffer[index+1] = g;
          dupBuffer[index+2] = b;
        }
        
      }
    }

  }




  effects.old_fishbowl = function (chunk, dupBuffer, opts) {  
    var h = opts.height, w = opts.width, index;

    var value, r, g, b;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index+1];
        b = chunk[index+2];
        value = r + g + b;
        if ( (value > 100) && (0 > y - 10) && (w > y + 8 ) ) {
          dupBuffer[index]   = chunk[index - 29]; // 7
          dupBuffer[index+1] = chunk[index + 18]; // 4
          dupBuffer[index+2] = chunk[index - 40]; // 10
        } else if (value < 50 && (0 > y - 5) && (w > y + 10 ) ) {
          dupBuffer[index]   = chunk[index + 14]; // 3 
          dupBuffer[index+1] = chunk[index - 20]; // 5
          dupBuffer[index+2] = chunk[index + 37]; // 9
        } else {
          dupBuffer[index]   = b;
          dupBuffer[index+1] = r;
          dupBuffer[index+2] = g;
        }
        
      }
    }

  }


  effects.old_destabil_light = function (chunk, dupBuffer, opts) {  
    var h = opts.height, w = opts.width, index;

    var value, r, g, b;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index+1];
        b = chunk[index+2];
        value = r + g + b;
        if ( value > 100 ) {
          dupBuffer[index]   = g;
          dupBuffer[index+1] = r;
          dupBuffer[index+2] = b;
        } else if (value < 50 && (0 > y - 5) && (w > y + 10 ) ) {
          dupBuffer[index]   = chunk[index + 14]; // 3
          dupBuffer[index+1] = chunk[index - 20]; // 5
          dupBuffer[index+2] = chunk[index + 46]; // 9
        } else if ( (0 > y - 40)  &&  (w  > y + 8) && (0 > y - 11) ) {
          dupBuffer[index]   = chunk[index + 29]; // 7
          dupBuffer[index+1] = chunk[index + 18]; // 4
          dupBuffer[index+2] = chunk[index - 40]; // 10
        } else {
          dupBuffer[index]   = r;
          dupBuffer[index+1] = g;
          dupBuffer[index+2] = b;
        }
        
      }
    }

  }



  effects.old_destabil_heavy = function (chunk, dupBuffer, opts) {  
    var h = opts.height, w = opts.width, index;

    var value, r, g, b;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index+1];
        b = chunk[index+2];
        value = r + g + b;
        if ( value > 100 ) {
          dupBuffer[index]   = g;
          dupBuffer[index+1] = r;
          dupBuffer[index+2] = b;
        } else if (value < 50 && (0 > y - 15) && (w > y + 14 ) ) {
          dupBuffer[index]   = chunk[index + 54]; // 13
          dupBuffer[index+1] = chunk[index - 60]; // 15
          dupBuffer[index+2] = chunk[index + 37]; // 9
        } else if ( (value > 50)  && (0 > y - 14) && (w > y + 15) ) {
          dupBuffer[index]   = chunk[index - 54]; // 13
          dupBuffer[index+1] = chunk[index + 60]; // 15
          dupBuffer[index+2] = chunk[index + 17]; // 4
        } else if ( (0 > y - 11)  &&  (w  > y + 8) ) {
          dupBuffer[index]   = chunk[index + 29]; // 7
          dupBuffer[index+1] = chunk[index + 18]; // 4
          dupBuffer[index+2] = chunk[index - 40]; // 10
        } else {
          dupBuffer[index]   = b;
          dupBuffer[index+1] = r;
          dupBuffer[index+2] = g;
        }
        
      }
    }

  }




  effects.old_blainebow = function (chunk, dupBuffer, opts) {  
    
    var h = opts.height, w = opts.width, index;
    var value, r, g, b;
    for (var x = 0; x < h; ++x) {
      for (var y = 0; y < w; ++y) {
        index = (x * w + y) * 4;
        r = chunk[index];
        g = chunk[index+1];
        b = chunk[index+2];
        value = r + g + b;
        if ( value > 100 && (0 > y - 20) && (w > y + 21 ) ) {
          dupBuffer[index]   = chunk[index - 77]; // 19
          dupBuffer[index+1] = chunk[index + 82]; // 20
          dupBuffer[index+2] = chunk[index - 16]; // 4
        } else if (value < 50 && (0 > y - 15) && (w > y + 14 ) ) {
          dupBuffer[index]   = chunk[index + 54]; // 13
          dupBuffer[index+1] = chunk[index - 60]; // 15
          dupBuffer[index+2] = chunk[index + 37]; // 9
        } else if ( (value > 50)  && (0 > y - 14) && (w > y + 15) ) {
          dupBuffer[index]   = chunk[index - 54]; // 13
          dupBuffer[index+1] = chunk[index + 60]; // 15
          dupBuffer[index+2] = chunk[index + 17]; // 4
        } else if ( (0 > y - 10)  &&  (w  > y + 8) ) {
          dupBuffer[index]   = chunk[index + 29]; // 7
          dupBuffer[index+1] = chunk[index + 18]; // 4
          dupBuffer[index+2] = chunk[index - 40]; // 10
        } else {
          dupBuffer[index]   = b;
          dupBuffer[index+1] = r;
          dupBuffer[index+2] = g;
        }
        
      }
    }

  }





  effects.old_av = function (chunk, dupBuffer, opts) {  
    var l = chunk.length, index = 0, meanSet;

    meanSet = meanPixel(chunk);

    while (index < l) {
      dupBuffer[index]   = Math.abs( chunk[index]   - meanSet[0] );
      dupBuffer[index+1] = Math.abs( chunk[index+1] - meanSet[1] );
      dupBuffer[index+2] = Math.abs( chunk[index+2] - meanSet[2] );
      index += 4;
    }

  }





  effects.old_av_av = function (chunk, dupBuffer, opts) {  
    var l = chunk.length, index = 0, meanSet;

    meanSet = meanPixel(chunk);

    while (index < l) {
      dupBuffer[index]   = Math.abs( (chunk[index]   + meanSet[0]) / 2 >>> 0 );
      dupBuffer[index+1] = Math.abs( (chunk[index+1] + meanSet[1]) / 2 >>> 0 );
      dupBuffer[index+2] = Math.abs( (chunk[index+2] + meanSet[2]) / 2 >>> 0 );
      index += 4;
    }

  }





  effects.old_reverse_great_color = function (chunk, dupBuffer, opts) {  
    var l = chunk.length, index = 0;

    while (index < l) {
      dupBuffer[l - index]   = chunk[index+4];
      dupBuffer[l - index+1] = chunk[index+3];
      dupBuffer[l - index+2] = chunk[index+4];
      index += 4;
    }

  }



  effects.old_and_mix_great_color = function (chunk, dupBuffer, opts) {  
    var l = chunk.length, index = 0;

    while (index < l) {
      dupBuffer[index+2] = chunk[index+4];
      dupBuffer[index+1] = (index&1) ?  chunk[index+2] : chunk[index-2];
      dupBuffer[index+4] = (index&1) ?  chunk[index+6] : chunk[index-6];
      index += 4;
    }

  }



  effects.old_and_mix_red_cyan = function (chunk, dupBuffer, opts) {  
    var l = chunk.length, index = 0;

    while (index < l) {
      dupBuffer[index]   = chunk[index+1];
      dupBuffer[index+1] = chunk[index+2];
      dupBuffer[index+2] = (index&1) ?  chunk[index+1] : chunk[index+2];
      index += 4;
    }

  }



  effects.old_and_mix_purple_green = function (chunk, dupBuffer, opts) {  
    var l = chunk.length, index = 0;

    while (index < l) {
      dupBuffer[index]   = (index&1) ? dupBuffer[index+1] : chunk[index+2];
      dupBuffer[index+1] = (index&1) ? dupBuffer[index+2] : dupBuffer[index-1];
      dupBuffer[index+2] = dupBuffer[index+2];
      index += 4;
    }

  }


  effects.old_and_mix_yellow_blue = function (chunk, dupBuffer, opts) {  
    var l = chunk.length, index = 0;

    while (index < l) {

      dupBuffer[index+1] = (index&1) ? dupBuffer[index+1] : dupBuffer[index+2];
      dupBuffer[index+2] = (index&1) ? dupBuffer[index+2] : dupBuffer[index-1];
      index += 4;
    }

  }




  effects.old_zoom_burn = function (chunk, dupBuffer, opts, paramsArray) {
    
    // resize by 3x

    var opts = opts || {};
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var length = pixels.length;

    function zoomBurnData32LSB_1st(u32c) {
      var r = (u32c &0xff);
      var g = (u32c >> 8) &0xff;
      var b = (u32c >> 16) &0xff;

      r = (r + 0x10) % 255;
      g = Math.abs(g - b)
      b = (g + b) % 255;

      return (255 << 24) | (b << 16) | (g << 8) | r;

    }

    function zoomBurnData32LSB_2nd(u32c) {
      var r = (u32c &0xff);
      var g = (u32c >> 8) &0xff;
      var b = (u32c >> 16) &0xff;

      r = (r + 0x69) % 256;
      g = Math.abs(g - 0x05);
      b = (b + 0x01) % 256;

      return (255 << 24) | (b << 16) | (g << 8) | r;

    }

    function zoomBurnData32MSB_1st(u32c) {
      var r = (u32c >> 24) &0xFF;
      var g = (u32c >> 16) &0xff;
      var b = (u32c >>  8) &0xff;

      r = (r + 0x10) % 256;
      g = Math.abs(g - b);
      b = (g + b) % 256;

      return (r << 24) | (g << 16) | (b << 8) | 255;
    }

    function zoomBurnData32MSB_2nd(u32c) {
      var r = (u32c >> 24) &0xFF;
      var g = (u32c >> 16) &0xff;
      var b = (u32c >>  8) &0xff;

      r = (r + 0x69) % 256;
      g = Math.abs(g - 0x05);
      b = (b + 0x01) % 256;

      return (r << 24) | (g << 16) | (b << 8) | 255;
    }

    var i = 0, n = 0;

    if (isLSB()) {
      while (n < length) {
        clone[n++] = pixels[i];
        clone[n++] = zoomBurnData32LSB_1st(pixels[i]);
        clone[n++] = zoomBurnData32LSB_2nd(pixels[i]);
        i++;
      }
    } else {
      while (n < length) {
        clone[n++] = pixels[i];
        clone[n++] = zoomBurnData32MSB_1st(pixels[i]);
        clone[n++] = zoomBurnData32MSB_2nd(pixels[i]);
        i++;
      }
    }
  }






  effects.old_zoom_twine = function (chunk, dupBuffer, opts, paramsArray) {
    
    // resize by 3x

    var opts = opts || {};
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var length = pixels.length;

    function zoomTwineData32LSB_1st(u32c) {
      var r = (u32c &0xff);
      var g = (u32c >> 8) &0xff;
      var b = (u32c >> 16) &0xff;

      r = (r + g) % 256;
      g = (g + g) % 256;
      b = (b + g) % 256;

      return (255 << 24) | (b << 16) | (g << 8) | r;

    }

    function zoomTwineData32LSB_2nd(u32c) {
      var r = (u32c &0xff);
      var g = (u32c >> 8) &0xff;
      var b = (u32c >> 16) &0xff;

      r = (r + b) % 256;
      g = Math.abs(g - r);
      b = (b + g) % 256;


      return (255 << 24) | (b << 16) | (g << 8) | r;

    }

    function zoomTwineData32MSB_1st(u32c) {
      var r = (u32c >> 24) &0xFF;
      var g = (u32c >> 16) &0xff;
      var b = (u32c >>  8) &0xff;

      r = (r + g) % 256;
      g = (g + g) % 256;
      b = (b + g) % 256;

      return (r << 24) | (g << 16) | (b << 8) | 255;
    }

    function zoomTwineData32MSB_2nd(u32c) {
      var r = (u32c >> 24) &0xFF;
      var g = (u32c >> 16) &0xff;
      var b = (u32c >>  8) &0xff;

      r = (r + b) % 256;
      g = Math.abs(g - r);
      b = (b + g) % 256;

      return (r << 24) | (g << 16) | (b << 8) | 255;
    }

    var i = 0, n = 0;

    if (isLSB()) {
      while (n < length) {
        clone[n++] = pixels[i];
        clone[n++] = zoomTwineData32LSB_1st(pixels[i]);
        clone[n++] = zoomTwineData32LSB_2nd(pixels[i]);
        i++;
      }
    } else {
      while (n < length) {
        clone[n++] = pixels[i];
        clone[n++] = zoomTwineData32MSB_1st(pixels[i]);
        clone[n++] = zoomTwineData32MSB_2nd(pixels[i]);
        i++;
      }
    }
  }




  effects.old_zoom_mash = function (chunk, dupBuffer, opts, paramsArray) {
    
    // old zaap

    var opts = opts || {};
    var pixels = new Uint32Array(chunk.buffer);
    var clone = new Uint32Array(dupBuffer.buffer);
    var length = pixels.length;

    function zoomMashData32LSB_1st(u32c) {
      var r = (u32c &0xff);
      var g = (u32c >> 8) &0xff;
      var b = (u32c >> 16) &0xff;

      r = r - r / 2 >>> 0;
      g = g - g / 2 >>> 0;
      b = b - b / 2 >>> 0 ;

      return (255 << 24) | (b << 16) | (g << 8) | r;

    }

    function zoomMashData32LSB_2nd(u32c) {
      var r = (u32c &0xff);
      var g = (u32c >> 8) &0xff;
      var b = (u32c >> 16) &0xff;

      r = (r + r / 2 >>> 0) % 256;
      g = (r + r / 2 >>> 0) % 256;
      b = (r + r / 2 >>> 0) % 256;

      return (255 << 24) | (b << 16) | (g << 8) | r;

    }

    function zoomMashData32MSB_1st(u32c) {
      var r = (u32c >> 24) &0xFF;
      var g = (u32c >> 16) &0xff;
      var b = (u32c >>  8) &0xff;
      
      r = r - r / 2 >>> 0;
      g = g - g / 2 >>> 0;
      b = b - b / 2 >>> 0 ;

      return (r << 24) | (g << 16) | (b << 8) | 255;
    }

    function zoomMashData32MSB_2nd(u32c) {
      var r = (u32c >> 24) &0xFF;
      var g = (u32c >> 16) &0xff;
      var b = (u32c >>  8) &0xff;
      
      r = (r + r / 2 >>> 0) % 256;
      g = (r + r / 2 >>> 0) % 256;
      b = (r + r / 2 >>> 0) % 256;

      return (r << 24) | (g << 16) | (b << 8) | 255;
    }

    var i = 0, n = 0;

    if (isLSB()) {
      while (n < length) {
        clone[n++] = pixels[i];
        clone[n++] = zoomMashData32LSB_1st(pixels[i]);
        clone[n++] = zoomMashData32LSB_2nd(pixels[i]);
        i++;
      }
    } else {
      while (n < length) {
        clone[n++] = pixels[i];
        clone[n++] = zoomMashData32MSB_1st(pixels[i]);
        clone[n++] = zoomMashData32MSB_2nd(pixels[i]);
        i++;
      }
    }
  }


 return effects;
 
}



// ===============================

// Notes: 
/*
  Bring over AZWF, Sharpers, Fishbowl, etc, etc
  Speed up blish, blosh, blink, sleep, slope, slip

*/





