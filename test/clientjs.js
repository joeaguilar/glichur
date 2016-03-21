
"use strict";

effects = effectsCode();
blends = blendsCode();

/*

    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function notBetweenThreshold(n, s, f) {
      return ( (n == null) || (typeof n != "number") || !(isNumeric(n)) || n < s || n > f );
    }

     function notAColorString(colorString) {
      return ((colorString.length < 6) || (typeof colorString != "string") || !!(colorString.match(/[^0123456789ABCDEFabcdef]/gi)));
    }

    var isNumericConfig = [
      {args:["s"], expect: false},
      {args:[0], expect: true},
      {args:[1000], expect: true},
      {args:[4545646], expect: true},
      {args:[0xFFFF], expect: true},
      {args:["0x" + "FFFF" >> 0], expect: true},
      {args:[Infinity], expect: true},
      {args:[-Infinity], expect: true},
      {args:[NaN], expect: false},

    ]

    var notBetweenThreshConfig = [
      {args:[0,1,100], expect: true},
      {args:[1,1,100], expect: false},
      {args:[15,1,100], expect: false},
      {args:["101",1,100], expect: true},
      {args:[101,1,1000], expect: true},
      {args:[11101,1,1000], expect: true},
      {args:[11101,0,255], expect: true},
      {args:[11101,255,255], expect: true},
      {args:[254,254,255], expect: false},
    ]

    var notAColorStringConfig = [
      {args:["FFFFFF"], expect: false},
      {args:["squad"],  expect: true},
      {args:["fff"],    expect: true},
      {args:["rrrr11"], expect: true},
      {args:[112355],   expect: true},
      {args:["111111"], expect: false},
      {args:["1cea11"], expect: false}
    ]

    function testPrimitive(cb, config ) {
      var config = config || [];
      config.forEach(function(v, i) {
        var args = v.args || [],
            result = false;
        try {
          if (v.expect == ( result = cb.apply(null,args) ) ) {
            handleSuccess("Test run "+i+" passed with result: " + result);
          } else {
            handleError("Test run "+i+" failed with result: " + result +". Expected " + v.expect);
          }

        } catch (e) {
          handleError("Error in function: " + e );
        }
        
      })
    }

    function handleError(err) {
      console.error(err);
    }

    function handleMessage(msg) {
      console.log(msg);
    }
*/
// testPrimitive(notBetweenThreshold, notBetweenThreshConfig)
// testPrimitive(notAColorString, notAColorStringConfig)






function printMessage(msg, cls) {
  // var testMessages = document.querySelector('#testmessage');
  var text = document.createElement('p');
  var message = document.createTextNode(msg);
      text.setAttribute('class', cls);
      text.appendChild(message);
  return text;
}

function printError(msg) {
  return printMessage.apply(null, [msg, 'error']);
}

function printSuccess(msg) {
  return printMessage.apply(null, [msg, 'success']);
}

function printWarning(msg) {
  return printMessage.apply(null, [msg, 'warning']);
}


function hideAllType(cls) {
  [].slice.call(document.querySelectorAll('.' + cls )).forEach(function(el, i) {
    el.classList.toggle('hidden');
  })
}

function preventEventBubble (e) {
  e.stopPropagation();
  e.preventDefault();
}

function toggleButtonText(selector, text1, text2) {
  if (document.querySelector(selector).innerHTML == text1) {
    document.querySelector(selector).innerHTML = text2;
  } else {
    document.querySelector(selector).innerHTML = text1;
  }
  
}

function hideAllErrors(e) {
  preventEventBubble(e);
  hideAllType('error');
  toggleButtonText('#hideerror', "Hide Errors", "Show Errors");
}



function hideAllSucess(e) {
  preventEventBubble(e);
  hideAllType('success');
  toggleButtonText('#hidesuccess', "Hide Successes", "Show Successes");
}


function hideAllWarning(e) {
  preventEventBubble(e);
  hideAllType('warning');
  toggleButtonText('#hidewarning', "Hide Warnings", "Show Warnings");
}


function updateResultsFromString(resultString) {
  var results = document.querySelector('#footerholder'),
      p = document.createElement('p');
      p.innerHTML = resultString;
      // t = document.createTextNode(resultString);
      // p.appendChild(t);

      results.appendChild(p);
}


function updateResultsFromElement(resultElement) {
  var results = document.querySelector('#footerholder');
      results.appendChild(resultElement);
}

function generateTestBuffers() {

}

function drawToCanvas(w, h) {
  var canvas = document.querySelector('#phrayros');
      canvas.height = h;
      canvas.width  = w;
  var ctx  = canvas.getContext('2d');
  var imgData = ctx.getImageData(0,0, w, h);
  var data = imgData.data;

  ctx.fillRect(10, 10, 70, 70);

  ctx.fillStyle = "#aaaa17";
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(100, 125);
  ctx.lineTo(100, 25);
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.strokeRect(90, 90, 190, 190);

  for (var x = 0; x < 10; ++x) {
    var s = new Path2D("M"+ (2 * x) + " " + (2 * x) + " h " + (x * 4) + " v " + (x * 6) + " h -" + (x * 4) +" Z");
    ctx.fillStyle = "#" + Number(16*(x+8) ).toString(16) + Number(16*(x+4)).toString(16) + Number(16*(x+2)).toString(16);
    ctx.fill(s)
  }


  for (var x = 0; x < 10; ++x) {
    var s = new Path2D("M-"+ (4 * x) + " " + (4 * x) + " h " + (x * 6) + " v " + (x * 6) + " h -" + (x * 6) +" Z");
    ctx.fillStyle = "#" + Number(16*(x+2) ).toString(16) + Number(16*(x+7)).toString(16) + Number(16*(x+5)).toString(16);
    ctx.fill(s)
  }


  for (var x = 0; x < 12; ++x) {
    var s = new Path2D("M"+ (4 * (x+12) ) + " " + (4 * (x+19) ) + " h " + (x * 6) + " v " + (x * 6) + " h -" + (x * 6) +" Z");
    ctx.fillStyle = "#" + Number(16*(x+9) ).toString(16) + Number(16*(x+2)).toString(16) + Number(16*(x+9)).toString(16);
    ctx.fill(s)
  }

}


function handleError(name, err) {
  var message = "Error on " + name + ": " + err;
  console.error(message);
  console.error(err);
  return printError(message);
}

function handleWarning(name, time) {
  var message = "Function " + name + " is slow: " + time;
  console.warn(message);
  return printWarning(message);

}


function handleSuccess(name, time) {
  var message = "Function " + name + " finished in " + time;
  console.log(message);
  return printSuccess(message);

}

/*

function runTests(buffer1, buffer2, opts, effects) {
  var testMessages = document.querySelector('#testmessage'),
      testMessageHolder = document.querySelector('#messageholder'),
      now, later, total, node, finalMessage, startTime, endTime, totalTime;
  var incr = sucIncr = errIncr = warnIncr = 0;
  
  testMessageHolder.removeChild(testMessages);

  while (testMessages.firstChild) {
    testMessages.removeChild(testMessages.firstChild);
  }
  startTime = performance.now();
  Object.keys(effects).forEach(function(v,i) {
    ++incr;
    now   = performance.now();
    try {
      effects[v](buffer1, buffer2, opts);
      later = performance.now();
      total = later - now;
      if ( parseInt(total,10) > 1000 ) {
        ++warnIncr;
        node = handleWarning(v, total);
      } else {
        ++sucIncr;
        node = handleSuccess(v, total);
      }
    } catch (e) {
      ++errIncr;
      node = handleError(v,e);
    }
    testMessages.appendChild(node);
  })
  endTime = performance.now();
  totalTime = endTime - startTime;
  testMessageHolder.appendChild(testMessages);
  updateResultsFromElement( 
    buildFinalMessageElement(totalTime, incr, sucIncr, warnIncr, errIncr)
    );
  console.log("Total: %s, Successes: %s, Warnings: %s, Errors: %s", incr, sucIncr, warnIncr, errIncr );

}


*/

/*
  updateResultsFromString(
    "Total time: "+ totalTime + ", Total run: "+incr+", Successes: "+sucIncr+", Warnings: "+warnIncr+", Errors: " + errIncr
    ); 
*/  
/*

function buildFinalMessageElement(totalTime, runs, suc, warn, err) {
  var element = document.createElement('p');
  element.innerHTML = 'Total time: <span class="time">' + totalTime.toPrecision(4) +
  '</span>, Total runs: <span class="runs">'  + runs +
  '</span>, Successes: <span class="successnumber">'+ suc  +
  '</span>, Warnings: <span class="warningnumber">' + warn +
  '</span>, Errors: <span class="errornumber">'     + warn +
  '</span>';
  return element;

}*/


function runTests(buffer1, buffer2, opts, effects) {
  var testMessages = document.querySelector('#testmessage'),
      testMessageHolder = document.querySelector('#messageholder'),
      now, later, total, node, finalMessage, startTime, endTime, totalTime, testmessage;
  var incr=0,sucIncr=0,errIncr=0,warnIncr=0;
  
  testMessageHolder.removeChild(testMessages);

  // while (testMessages.firstChild) {
  //   testMessages.removeChild(testMessages.firstChild);
  // }
  startTime = performance.now();
  Object.keys(effects).forEach(function(v,i) {
    ++incr;
    now   = performance.now();
    try {
      effects[v](buffer1, buffer2, opts);
      later = performance.now();
      total = later - now;
      if ( parseInt(total,10) > 100 ) {
        ++warnIncr;
        node = handleWarning(v, total);
      } else {
        ++sucIncr;
        node = handleSuccess(v, total);
      }
    } catch (e) {
      ++errIncr;
      node = handleError(v,e);
    }
    testMessages.appendChild(node);
  });

  endTime = performance.now();
  totalTime = endTime - startTime;
  testMessageHolder.appendChild(testMessages);

  testmessage = 'Total time: <span class="time">' + totalTime.toPrecision(4) +
  '</span>, Total runs: <span class="runs">'  + incr +
  '</span>, Successes: <span class="successnumber">'+ sucIncr  +
  '</span>, Warnings: <span class="warningnumber">' + warnIncr +
  '</span>, Errors: <span class="errornumber">'     + errIncr +
  '</span>';

  updateResultsFromString(testmessage);
  console.log("Total: %s, Successes: %s, Warnings: %s, Errors: %s", incr, sucIncr, warnIncr, errIncr );

}



  // updateResultsFromString(); 
  



// function buildFinalMessageElement(totalTime, runs, suc, warn, err) {
//   var element = document.createElement('p');
//   element.innerHTML = 
//   return element;

// }



function getOptions(config) {   
    var canvas = document.querySelector('#phrayros'),
        options = {};
    // options.filename  = form.imageloader.files[0].name; 
    options.height    = canvas.height;
    options.width     = canvas.width;
    options.length    = canvas.width * canvas.height * 4;
    // options.effect =    form.effect.value
    // options.order     = parseInt(form.order.value, 10);
    // options.channel   = parseInt(form.channel.value, 10);
    options.threshold = config.threshold;
    options.depth     = config.depth;
    options.xspace    = config.xspace;
    options.yspace    = config.yspace;
    options.weight    = config.weight;
    options.stroke    = config.stroke;
    options.color     = config.color;
    return options;
  }


    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function betweenThreshold(n, start, finish) {
      return ( (n  < start) || ( n > finish) );
    }

    function notBetweenThreshold(n, s, f) {
      return ( (n == null) || (typeof n != "number") || !(isNumeric(n)) || n < s || n > f );
    }

    function notAColorString(colorString) {
      return ((colorString.length < 6) || (typeof colorString != "string") || !!(colorString.match(/[^0123456789ABCDEFabcdef]/gi)));
    }


    function verifyOptions(obj) {
      var form = document.forms[0],
          canvas = document.querySelector('#phrayros'),
          obj = obj || {},
          n = true;

        // Uses fall through for performance, catches each check on the way
        switch(true) {
          // Make sure filename matches
          // case (obj.filename !== form.imageloader.files[0].name) :
          //   obj.filename = form.imageloader.files[0].name;
          //   obj.width = canvas.width;
          //   obj.height = canvas.height;

          // Make sure effect matches a defined effect
          case ( (obj.effect == null) ||  (Object.keys(effects).indexOf(obj.effect) == -1) ):
            obj.effect = "noop";

          // Make sure blend matches a defined blend
          case ( (obj.blend == null) ||  (Object.keys(blends).indexOf(obj.blend) == -1) ):
            obj.blend = "copy";

          // Make sure order is a byte between 0 and 5
          case ( notBetweenThreshold(obj.order, 0, 5) ):
            obj.order = 0;

          // Make sure channel is a byte between 0 and 7
          case ( notBetweenThreshold(obj.channel, 0, 7) ):
            obj.channel = 0;

          // Make sure depth is an "8bit" float
          case ( notBetweenThreshold(obj.channel, 0, 255) ):
            obj.depth = 1.0;

          // Make sure threshold is a byte
          case ( notBetweenThreshold(obj.threshold, 0, 255) ):
            obj.threshold = 50;

          // Make sure xspace is a byte 
          case ( notBetweenThreshold(obj.xspace, 0, 255) ):
            obj.xspace = 10;

          // Make sure yspace is a byte 
          case ( notBetweenThreshold(obj.yspace, 0, 255) ):
            obj.yspace = 10;
          
          // Make sure weight is a byte 
          case ( notBetweenThreshold(obj.weight, 0, 255) ):
            obj.weight = 5;
          
          // Make sure stroke is a byte 
          case ( notBetweenThreshold(obj.stroke, 0, 255) ):
            obj.stroke = 5;
          
          // Make sure color is a color string
          case ( notAColorString(obj.color) ):
            obj.color = "FFFFFF";
          default: n = false;
          break;
        }
    }



function generateOptions () {
  var cache = [], crazyOption, reasonableOption, testopt1, testopt2, zeroOptions, negativeOptions;

  crazyOption = getOptions({threshold: 999, depth: 1234594, xspace: 2949444, yspace: 2949444, weight: 454649444, stroke: 9580459, color: "FF1166"});
  reasonableOption = getOptions({threshold: 50, depth: 10, xspace: 10, yspace: 10, weight: 50, stroke: 50, color: "ff1166"});    
  testopt1 = getOptions({threshold: 300, depth: 300, xspace: 300, yspace: 300, weight: 300, stroke: 300, color: "ffffff"});
  testopt2 = getOptions({threshold: 1, depth: 1, xspace: 1, yspace: 1, weight: 1, stroke: 1, color: "ffffff"});
  zeroOptions = getOptions({threshold: 0, depth: 0, xspace: 0, yspace: 0, weight: 0, stroke: 0, color: "ffffff"});
  negativeOptions = getOptions({threshold: -11, depth: -11, xspace: -10, yspace: -10, weight: -10, stroke: -10, color: "ffffff"});
  
  cache.push(crazyOption);
  cache.push(reasonableOption);
  cache.push(testopt1);
  cache.push(testopt2);
  cache.push(zeroOptions);
  cache.push(negativeOptions);

  return cache
}



function generateCanvasData() {
  drawToCanvas(400, 400);
}

function startTest () {

 var canvas = document.querySelector('#phrayros');
 var ctx  = canvas.getContext('2d');
 var imgData = ctx.getImageData(0,0, (canvas.width|| 300), (canvas.height || 150) );
 var data = imgData.data;
 var currentOption;
 var options = generateOptions();
  for ( var i = 0, l = options.length; i < l; ++i) {
    
    verifyOptions(options[i]);
    runTests(data, data, options[i], effects);
    runTests(data, data, options[i], blends);
    updateResultsFromString('<p>Option set #' + i + ' finished');
    
  }
  updateResultsFromString("<p>All test finished<p>");
}



// var testButton = document.createElement('button');
//     testButton.innerHTML = "Test";
//     testButton.addEventListener('mouseup', startTest, false);
// document.body.appendChild(testButton);

document.querySelector('#hidesuccess').addEventListener('mouseup', hideAllSucess, false);
document.querySelector('#hidewarning').addEventListener('mouseup', hideAllWarning, false);
document.querySelector('#hideerror').addEventListener('mouseup', hideAllErrors, false);
document.querySelector('#generatecanvas').addEventListener('mouseup', generateCanvasData, false);
document.querySelector("#runtest").addEventListener('mouseup', startTest, false);

