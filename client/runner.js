;(function (window, effects, blends) {

  "use strict";

  var buffer1; // Main
  var buffer2; // Work
  var buffer3; // Restore
  var buffer4; // Sample
  var queue = [];
  // var blends = blends || {};
  // var effects = effects || {};
  var imageLoader = document.querySelector('#imageloader');
  var canvas = document.querySelector('#ultros');
  var ctx = canvas.getContext('2d');
  var canvasstats = document.querySelector('#canvasstats');
   


  // Web Worker interface
  var GlitchWorker;
  attachWebWorker();

  function workerDelegation (e) {
    e.stopPropagation();
    e.preventDefault();
    switch (e.data.command) {
      case 'bootstrapped':
        bootstrapEffects(e.data.lists.effects);
        bootstrapBlends(e.data.lists.blends);
        break;
      case 'successfulLoad': 
        handleMessage("Successfully loaded Image data");   
        toggleLoader();
        fileChosen();
        break;
      case 'successfulSample':
        handleMessage('Successfully loaded Sample data');
        toggleLoader();
        fileChosen();
        break;
      case 'successfulQueue':
        GlitchWorker.postMessage({
          command: 'runEffect'
        });
        break;
      case 'returnData':
        // handleMessage('Effect run');
        updateCanvas(e.data.buffer);
        cleanUp();
        break;
      case 'lists':
        buildLists(e.data.lists);
        break;
      case 'message':
        handleMessage(e.data.msg);
        break;
      case 'error':
        handleError(e.data.msg);
        break;
    }
  } 

  function attachWebWorker () {
    if (window.Worker) {
      try {
        GlitchWorker = new Worker('../client/worker.js');
        GlitchWorker.onmessage = workerDelegation;
        GlitchWorker.onerror = function(e) {
          console.log(e);
        };
        GlitchWorker.postMessage({
          command: 'init'
        });
        
      } catch (e) {
        GlitchWorker = false;
        handleMessage('No web worker support');
      }
    } else  {
      GlitchWorker = false;
      handleMessage('No web worker support')
    }
    
  }
  
  function updateCanvas (buf) {
    var canvas = document.querySelector('#ultros');
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var imageData = ctx.getImageData(0, 0, w, h);
    var data = imageData.data;

    for ( var i = 0, dl = data.length; i < dl; ++i ) {
      data[i] = buf[i];
    }
    ctx.putImageData(imageData, 0, 0);
    

  }

    // ====================================================
    // Canvas toBlob Polyfill
    // ====================================================

    if (!HTMLCanvasElement.prototype.toBlob) {
     Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function (callback, type, quality) {

        var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
            len = binStr.length,
            arr = new Uint8Array(len);

        for (var i=0; i<len; i++ ) {
         arr[i] = binStr.charCodeAt(i);
        }

        callback( new Blob( [arr], {type: type || 'image/png'} ) );
      }
     });
    }

    // ===========================================
    // Wrapper around Worker to prevent API changes
    function getAllEffectsNames(obj) {

    }


    // ===========================================
    // Wrapper around queue to protect API changes
    function pingQueue(e) {
      if (GlitchWorker) {
         
      } else {
        return (queue.length > 0);   
      }
    }

    function retrieveQueue() {
      return queue;
    }

    function addToQueue(opts) {
      if (GlitchWorker) {
        GlitchWorker.postMessage({
          command: 'addToQueue',
          opts: opts
        });

      } else {
        queue.push(opts);  

      }
    }

    function removeLastFromQueue() {
      return queue.pop();
    }

    function resetQueue() {
      queue = [];
    }

    function replayQueue() {
      // TODO: Redo last action
    }


    function saveQueue() {

      var text = saltString + "\n";
      var q = retrieveQueue();

      q.forEach(function(v,i) {
        text += queueToCSV(v);
        text += "\n";
      });

      var a = document.querySelector('#a');
      var csv = new Blob(text, {type: "text/csv"});
      a.href = URL.createObjectURL(csv);
      a.download = "effect.csv";

    }

    function loadQueueFromText(text) {
      var lines = text.split('\n'), obj;
      if (lines[0] != saltString) {
        handleError('CSV is not compatible');
        return;
      }
      for (var i = 1, l = lines.length; i < l; ++i) {
        addToQueue( csvToQueue(lines[i]) );
      }
      displayQueue();
    }

    function queueToCSV(obj) {
      return "" + 
      obj.effect    + "," +
      obj.order     + "," +
      obj.channel   + "," +
      obj.threshold + "," +
      obj.depth     + "," +
      obj.xspace    + "," +
      obj.yspace    + "," +
      obj.weight    + "," +
      obj.stroke    + "," +
      obj.color;
    }

    function csvToQueue(string) {
      var n = string.split(','), 
          obj = {};
      obj.effect    = parseInt(n[0], 0);
      obj.order     = parseInt(n[1], 0);
      obj.channel   = parseInt(n[2], 0);
      obj.threshold = parseInt(n[3], 0);
      obj.depth     = parseInt(n[4], 0);
      obj.xspace    = parseInt(n[5], 0);
      obj.yspace    = parseInt(n[6], 0);
      obj.weight    = parseInt(n[7], 0);
      obj.stroke    = parseInt(n[8], 0);
      obj.color     = parseInt(n[9], 0);
      return obj;
    }




    // ===================================
    // Wrapper around buffer to protect against API changes
    function loadBuffer1(buf) {
      buffer1 = Uint8Array.from(buf);      
    }

    function loadBuffer2(buf) {
      buffer2 = Uint8Array.from(buf);
    }

    function loadBuffer3(buf) {
      buffer3 = Uint8Array.from(buf);    
    }

    function loadBuffer4(buf) {
      buffer4 = Uint8Array.from(buf);
    }



    // ===================================
    // Wrapper around messages to protect against API changes
    function handleMessage(msg) {
      console.log(msg);
    }

    function handleError(err) {
      console.error("%c " + err, "background-color:#EE1122;color:#EEFFEE;");
      // window.alert(err);
    }
  
    function handleSuccess(msg) {
      console.log("%c" + msg, "background-color:#00FF77;color:#EEEEEE;");
    }



    // ===================================
    // Wrapper around options to protect against API changes
    function getOptions() {   
      var form = document.forms[0],
          canvas = document.querySelector('#ultros'),
          options = {};
      options.filename  = form.imageloader.files[0].name; 
      options.height    = canvas.height;
      options.width     = canvas.width;
      options.length    = canvas.width * canvas.height * 4;
      options.effect    = form.effect.value;
      options.blend     = form.blend.value;
      // options.effect    = form.effect.value.charCodeAt();
      options.order     = parseInt(form.order.value, 10);
      options.channel   = parseInt(form.channel.value, 10);
      options.threshold = parseInt(form.threshold.value, 10);
      options.depth     = parseInt(form.depth.value, 10);
      options.xspace    = parseInt(form.xspace.value, 10);
      options.yspace    = parseInt(form.yspace.value, 10);
      options.weight    = parseInt(form.weight.value, 10);
      options.stroke    = parseInt(form.stroke.value, 10);
      options.color     = parseInt("ff" + form.color.value.slice(1), 16);
      return options;
    }

    function setOptions(obj) {
      var form = document.forms[0];
      form.effect.value    = obj.effect;
      form.blend.value    = obj.blend;
      // form.effect.value    = String.fromCharCode(obj.effect); 
      form.order.value     = obj.order;
      form.channel.value   = obj.channel;
      form.threshold.value = obj.threshold;
      form.depth.value     = obj.depth;
      form.xspace.value    = obj.xspace; 
      form.yspace.value    = obj.yspace; 
      form.weight.value    = obj.weight; 
      form.stroke.value    = obj.stroke; 
      if (isLSB()) {
        // LSB architecture
        form.color.value     = "#" + (obj.color.toString(16)).slice(2); 
      } else {
        // MSB architecture
        form.color.value     = "#" + (obj.color.toString(16)).slice(0,6);   
      }

    }

    function resetOptions() {
      var form = document.forms[0];
      // form.effect.value    = 'noop';
      form.order.value     = 4;
      form.channel.value   = 0;
      form.threshold.value = 50;
      form.depth.value     = 1.0;
      form.xspace.value    = 5; 
      form.yspace.value    = 5; 
      form.weight.value    = 5; 
      form.stroke.value    = 5; 
      form.color.value     = "#FFFFFF"; 
    }


    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function betweenThreshold(n, start, finish) {
      return ( (n  < start) || ( n > finish) );
    }

    function notBetweenThreshold(n, s, f) {
      return ( (n === null) || (typeof n != "number") || !(isNumeric(n)) || n < s || n > f );
    }

    function notAColorString(colorString) {
      return ((colorString.length < 6) || (typeof colorString != "string") || !!(colorString.match(/[^0123456789ABCDEFabcdef]/gi)));
    }

    // This is used
    function verifyOptions(obj) {
      var form = document.forms[0],
          canvas = document.querySelector('#ultros'),
          obj = obj || {},
          n = true;


        // Uses fall through for performance, catches each check on the way
        switch(true) {
          // Make sure filename matches
          case (obj.filename !== form.imageloader.files[0].name) :
            obj.filename = form.imageloader.files[0].name;
            obj.width = canvas.width;
            obj.height = canvas.height;

          // Make sure effect matches a defined effect
          case ( (obj.effect == null) ||  (Object.keys(effects).indexOf(obj.effect) == -1) ):
            obj.effect = "noop";

          // Make sure blend matches a defined blend
          case ( (obj.blend == null) ||  (Object.keys(blends).indexOf(obj.blend) == -1) ):
            obj.blend = "copy";

          // Make sure order is a byte between 0 and 5
          case ( notBetweenThreshold(obj.order, 0, 6) ):
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
          
          case ( notAColorString(obj.color) ):
            obj.color = "FFFFFF";
          default: n = false;
          break;
        }

    }




  function examimeEffect(functionString) {
    var hasNoise, hasDepth, hasXspace, hasYspace;

    hasDepth = functionString.match(/opts\.depth/) ? true : false;
    hasYspace = functionString.match(/opts\.yspace/) ? true : false; 
    hasXspace = functionString.match(/opts\.xspace/) ? true : false; 
  
  }

  function verifyFileSize (id) {
    var file = document.querySelector('#imageloader').files[0]
    var file = document.querySelector('#sampleloader');

    var size = file.size;
  }

  function compressFileSize () {

  }


  // ==========================================
  // UI Building
  // ==========================================

  function bootstrapEffects (eanames) {
    // eanames must be an array of effects names
    var effectList = eanames || Object.keys(effects);
    var effectBar = document.querySelector('#effect');
    var select = document.createElement('select');
    var option;
    for( var i = 0, el = effectList.length; i < el; ++i) {
      option = document.createElement('option');
      option.value = effectList[i];
      option.text = effectList[i].slice(0,1).toUpperCase() + effectList[i].slice(1);
      select.add(option);
      option = null;
    }
    effectBar.parentNode.replaceChild(select, effectBar);
    select.id   = "effect";
    select.name = "effect";
  }

  function bootstrapBlends (banames) {
    // banames must be an array of blends names
    var blendList = banames || Object.keys(blends);
    var blendBar = document.querySelector('#blend');
    var select = document.createElement('select');
    var option;
    for( var i = 0, el = blendList.length; i < el; ++i) {
      option = document.createElement('option');
      option.value = blendList[i];
      option.text = blendList[i].slice(0,1).toUpperCase() + blendList[i].slice(1);
      select.add(option);
      option = null;
    }
    blendBar.parentNode.replaceChild(select, blendBar);
    select.id   = "blend";
    select.name = "blend";
  }


  function determineFileSize(sizeinbytes) {
    var ext = ["bytes", "kb", "mb", 'gb', 'tb', 'pb'];
    fSize = sizeinbytes; i=0;while(fSize>900){fSize/=1024;i++;};
    return Math.round(fSize* 100)/100  + ext[i];
  }
 


  function zoomInCanvas(incr) {
    // TODO Zoom In
    var w = canvas.width, h = canvas.height,
        curwidth  = parseInt(canvas.style.width.replace("px", "")),
        curheight= parseInt(canvas.style.height.replace("px", ""));
    curheight += Math.round(h * .10);
    canvas.style.height = curheight + "px";
    curwidth += Math.round(w * .10);
    canvas.style.width = curwidth  + "px";
  }


  function zoomOutCanvas(decr) {
    // TODO Zoom out
    var w = canvas.width, h = canvas.height,
        curwidth  = parseInt(canvas.style.width.replace("px", "")),
        curheight= parseInt(canvas.style.height.replace("px", ""));
    curheight -= Math.round(h * .10);
    canvas.style.height = curheight + "px";
    curwidth -= Math.round(w * .10);
    canvas.style.width = curwidth  + "px";
  }


  function zoomInSampleCanvas(incr) {
    var canvas = document.querySelector('#bablyos');
    var w = canvas.width, h = canvas.height,
        curwidth  = parseInt(canvas.style.width.replace("px", "")),
        curheight= parseInt(canvas.style.height.replace("px", ""));
    curheight += Math.round(h * .10);
    canvas.style.height = curheight + "px";
    curwidth += Math.round(w * .10);
    canvas.style.width = curwidth  + "px";
  }

  function zoomOutSampleCanvas(decr) {
    var canvas = document.querySelector('#bablyos');
    var w = canvas.width, h = canvas.height,
        curwidth  = parseInt(canvas.style.width.replace("px", "")),
        curheight= parseInt(canvas.style.height.replace("px", ""));
    curheight -= Math.round(h * .10);
    canvas.style.height = curheight + "px";
    curwidth -= Math.round(w * .10);
    canvas.style.width = curwidth  + "px";
  }


  function zoomReset () {
    var w = canvas.width, h = canvas.height;
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
  }

  function debugEvent(e) {
    console.log(e);
    console.log(e.parentNode);
    console.log(e.parentNode.parentNode);
  }


  

// ========================================
// EFFECT RUNNER
// ========================================
  function runEffect(callback) {
    var canvas = document.querySelector('#ultros');
    var w = canvas.width, h = canvas.height;
    var imageData = ctx.getImageData(0, 0, w, h);
    var data = imageData.data;

    if ( buffer1 == undefined || buffer1.length == 0 || buffer2 == undefined || buffer2.length == 0) {
      handleError("No image data available")
      return;
    }
    for (var i = 0, l = queue.length; i < l; ++i) {
      verifyOptions(queue[i]);
      switch(queue[i].order) {
        case 0: 
          // Run
          effects[ queue[i].effect ](buffer1, buffer2, queue[i]);
          blends[ queue[i].blend](buffer2, buffer1, queue[i]);
          break;
        case 1:
          effects[ queue[i].effect ](buffer2, buffer1, queue[i]);
          blends[ queue[i].blend](buffer1, buffer2, queue[i]);
          break;
        case 2:
          effects[ queue[i].effect ](buffer1, buffer1, queue[i]);
          break;
        case 3:
          effects[ queue[i].effect ](buffer2, buffer2, queue[i]);
          break;
        case 4:
          effects[ queue[i].effect ](buffer3, buffer1, queue[i]);
          break;
        case 5:
          // Restore
          effects[ queue[i].effect ](buffer3, buffer2, queue[i]);
          blends[ queue[i].blend](buffer2, buffer1, queue[i]);
          break;
        case 6:
          // Second Restore
          effects[ queue[i].effect ](buffer4, buffer2, queue[i]);
          blends[ queue[i].blend](buffer2, buffer1, queue[i]);
        default:
          effects[ queue[i].effect ](buffer1, buffer2, queue[i]);
          break;
      }
    }
    for (var i = 0, dl = data.length; i < dl; ++i ) {
      data[i] = buffer1[i];
    }
    ctx.putImageData(imageData, 0, 0);
    callback();
  }

  function queueEffect(e) {
    e.preventDefault();
    e.stopPropagation();
    var form = document.forms[0],
        options = {};
        options.height = canvas.height;
        options.width = canvas.width;
        options.length = canvas.width * canvas.height * 4;
        // options.effect = form.effect.value.charCodeAt();
        options.effect = form.effect.value;
        options.blend = form.blend.value;
        options.order  = form.order.value;
        options.channel = form.channel.value;
        options.threshold = form.threshold.value;
        options.depth = form.depth.value;
        options.xspace = form.xspace.value;
        options.yspace = form.yspace.value;
        options.weight = form.weight.value;
        options.stroke = form.stroke.value;
        options.color = (form.color.value.split(1));
        queue.push(options);

  }



  // ===============================================
  // UI changes
  function updateCanvasStats (w,h) {
    var heading = document.createElement('h3'),
        heightP = document.createElement('p'),
        widthP  = document.createElement('p'),
        cs = document.querySelector('#canvasstats'),
        c = cs.cloneNode();
        
        // DONT ADD MORE
        while(c.firstChild) c.removeChild(c.firstChild);
        heading.innerText = document.querySelector('#imageloader').files[0].name;
        heightP.innerText = "Height: " + h + "px";
        widthP.innerText  = "Width: " +  w + "px";

        c.appendChild(heading);
        c.appendChild(heightP);
        c.appendChild(widthP);

        cs.parentNode.replaceChild(c, cs);
        cs = null;
  }


  function displayQueue(ql) {
    var queue = ql || window.queue;
    var qDisplay = document.querySelector('#queue');
    var docFrag  = document.createDocumentFragment();
    var instruction = Object.keys(getOptions());
    for (var i = 0, ql= queue.length; i < ql; ++i) {
    var section = document.createElement('section'),
        figureFront = document.createElement('figure'),
        figureBack = document.createElement('figure'),
        flipButtonFront = document.createElement('p'),
        flipButtonBack = document.createElement('p'),
        buttonTextFront = document.createTextNode('>'),
        buttonTextBack = buttonTextFront.cloneNode(),
        deleteButton  = document.createElement('button'),
        deleteText = document.createTextNode('Delete'),
        editButton = document.createElement('button'),
        editText = document.createTextNode('Edit'),
        cardAction = document.createElement('div'),
        card = document.createElement('div'),
        dl = document.createElement('dl'),
        dtText, ddText, dt, dd;
        
        section.setAttribute('class', 'queue-wrap');
        card.setAttribute('class', 'card');
        cardAction.setAttribute('class', 'card-action');
        figureFront.setAttribute('class', 'card-front');
        figureBack.setAttribute('class', 'card-back');
        flipButtonFront.setAttribute('class', 'flip-button');
        flipButtonBack.setAttribute('class', 'flip-button');
        editButton.setAttribute('class', 'edit-queue');
        deleteButton.setAttribute('class', 'delete-queue');

      var queueObject = queue[i];
      for (var j = 0, il = instruction.length; j < il; ++j ) {
        var currentField = instruction[j];
        dt = document.createElement('dt');
        dd = document.createElement('dd');
        section.dataset[currentField] = queueObject[instruction[j]];
        dtText = document.createTextNode(currentField[0].toUpperCase() + currentField.slice(1));
        ddText = document.createTextNode(queueObject[instruction[j]]);
        dt.appendChild(dtText);
        dd.appendChild(ddText);
        dl.appendChild(dt);
        dl.appendChild(dd);
      }

      flipButtonFront.appendChild(buttonTextFront);
      flipButtonBack.appendChild(buttonTextBack);

      figureFront.appendChild(flipButtonFront);
      figureFront.appendChild(dl);

      figureBack.appendChild(flipButtonBack);
      figureBack.appendChild(cardAction);

      editButton.appendChild(editText);
      cardAction.appendChild(editButton);

      deleteButton.appendChild(deleteText);
      cardAction.appendChild(deleteButton);

      card.appendChild(figureFront);
      card.appendChild(figureBack);

      section.appendChild(card);
      /*
        <section class="queue-wrap" data-height="150" data-width="300" data-length="180000" data-effect="mettoizi" data-order="0" data-channel="0" data-threshold="1" data-depth="1" data-xspace="5" data-yspace="5" data-weight="5" data-stroke="5" data-color="4294967295">
          <div class="card">
            <figure class="card-front">
              <p class="flip-button">></p>
              <dl>
                <dt>Height</dt>   <dd >150</dd>
                <dt>Width</dt>    <dd >300</dd>
                <dt>Length</dt>   <dd >180000</dd>
                <dt>Effect</dt>   <dd contentEditable="true" > mettoizi</dd>
                <dt>Order</dt>    <dd contentEditable="true" > 0</dd>
                <dt>Channel</dt>  <dd contentEditable="true" > 0</dd>
                <dt>Threshold</dt><dd contentEditable="true" > 1</dd>
                <dt>Depth</dt>    <dd contentEditable="true" > 1</dd>
                <dt>Xspace</dt>   <dd contentEditable="true" > 5</dd>
                <dt>Yspace</dt>   <dd contentEditable="true" > 5</dd>
                <dt>Weight</dt>   <dd contentEditable="true" > 5</dd>
                <dt>Stroke</dt>   <dd contentEditable="true" > 5</dd>
                <dt>Color</dt>    <dd contentEditable="true" > 4294967295</dd>
              </dl>
              <img>
            </figure>
            <figure class="card-back">
              <p class="flip-button">></p>
              <div class="card-action">
                <button class="download-img">Edit</button>
                <button class="delete-img">Delete</button>
              </div>
            </figure>
          </div>
      </section>
      */
      docFrag.appendChild(section);
    }

    while (qDisplay.firstChild) {
      qDisplay.removeChild(qDisplay.firstChild);
    }
    qDisplay.appendChild(docFrag);

  }


  function scaleImgToFitImgBar (w, h) {
    var cache = [], longedge;
    cache[0] = 200;
    cache[1] = Math.round(h / (w / 200));
    return cache;
  }


  function buildImage() {
    var canvas = document.querySelector('#ultros');
    var imageBar = document.querySelector('#imagebar');
    canvas.toBlob(function(blob) {
      var imgMaterial, filename, filesize, ratio, url, h,w;
          filename = "glitcher" + new Date().toISOString().slice(17,19) + (Math.random()).toString().slice(2) +'.png';
      var imgAnchor = document.createElement('a');
          imgAnchor.setAttribute('data-saved', 'false');
          h = canvas.height;
          w = canvas.width;
          ratio = scaleImgToFitImgBar(w, h);
      var newImg = new Image();
          newImg.width = ratio[0];   // change this
          newImg.height = ratio[1]; // change this
          newImg.setAttribute('class', 'glitched-image');
          imgMaterial = canvas.toDataURL('image/png');
          url = URL.createObjectURL(blob) // add blob
          imgAnchor.setAttribute('href', imgMaterial);
          imgAnchor.setAttribute('download', filename);
          newImg.setAttribute('src', imgMaterial);
          newImg.src = url;
          imgAnchor.appendChild(newImg);
          
          // console.log(blob.size);
          // console.log(blob);

      var imgWrap, card, cardFront, cardBack,flipButton1, flipButton2, cardAction,
          downloadButton, deleteButton, buttonText1, buttonText2, deleteText, downloadText;
          
          imgWrap = document.createElement('section');
          imgWrap.setAttribute('class', 'img-wrap');
          imgWrap.setAttribute('style', 'height:' + ratio[1] + 'px; width:' + ratio[0] + 'px;');

          card    = document.createElement('div');
          card.setAttribute('class', 'card');
          
          cardFront = document.createElement('figure');
          cardFront.setAttribute('class', 'card-front');

          cardBack  = document.createElement('figure'); 
          cardBack.setAttribute('class', 'card-back');
          cardBack.setAttribute('style', 'background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(255, 16, 116, 0.45) ), url(' + url +') no-repeat 50% 50%;');

          buttonText1 = document.createTextNode('>');
          buttonText2 = buttonText1.cloneNode();

          flipButton1 = document.createElement('p');
          flipButton1.setAttribute('class', 'flip-button');

          flipButton2 = document.createElement('p');
          flipButton2.setAttribute('class', 'flip-button');

          cardAction = document.createElement('div');
          cardAction.setAttribute('class', 'card-action');

          downloadText = document.createTextNode('Download');
          downloadButton = document.createElement('button');
          downloadButton.setAttribute('class', 'download-img');

          deleteText = document.createTextNode('Delete');
          deleteButton   = document.createElement('button');
          deleteButton.setAttribute('class', 'delete-img');
          
          downloadButton.appendChild(downloadText);
          cardAction.appendChild(downloadButton);
          
          deleteButton.appendChild(deleteText);
          cardAction.appendChild(deleteButton);

          flipButton1.appendChild(buttonText1);
          cardFront.appendChild(flipButton1);
          cardFront.appendChild(imgAnchor);

          flipButton2.appendChild(buttonText2);
          cardBack.appendChild(flipButton2);
          cardBack.appendChild(cardAction);

          card.appendChild(cardFront);
          card.appendChild(cardBack);

          imgWrap.appendChild(card);
          imageBar.appendChild(imgWrap);

          /*
              <section class="img-wrap">
                <div class="card">
                  <figure class="card-front">
                    <p class="flip-button">></p>
                    <a><img></a>
                  </figure>
                  <figure class="card-back">
                    <p class="flip-button">></p>
                    <div class="card-action">
                      <button class="download-img">Dowload</button>
                      <button class="delete-img">Delete</button>
                    </div>
                  </figure>
                </div>
              </section>
          */
    });

  }

  function rebuildForm () {
    var section = document.createElement('section');
    Array.prototype.forEach.call(document.forms[0], function(el) {
      var type = el.type;
      // console.log(type);
      switch (true) {
        case type === 'range':
          buildRange(el, section);
          break;
        case type === 'color':
          buildColorPicker(el, section);
        default: 
          break;
      }
      
    });

    document.querySelector('#options').appendChild(section);

  }

  function buildColorPicker (element, docFrag) {
    var wrapDiv  = document.createElement('div'),
        label    = document.createElement('label'),
        inputDiv = document.createElement('div'),
        thumbDiv = document.createElement('div'),
        // shadowColor = document.createElement('input'),
        elName   = element.name,
        elValue  = element.value;

        // shadowColor.setAttribute('class', 'shadow-color');
        // shadowColor.setAttribute('type', 'color');
        // shadowColor.value = elValue;

        wrapDiv.setAttribute('class', 'input-wrap');

        label.setAttribute('for', elName + "-div");
        label.setAttribute('id', elName + "-div-label");
        label.setAttribute("class", "div-label");
        label.setAttribute('role', 'label');
        label.innerText = elName.slice(0,1).toUpperCase() + elName.slice(1) + ": " + elValue;

        inputDiv.setAttribute('role', 'input');
        inputDiv.setAttribute('class', 'colorpicker');
        inputDiv.setAttribute('name', elName + "-div");
        inputDiv.setAttribute('id', elName + "-div");
        inputDiv.dataset.type = "color";
        inputDiv.dataset.value = elValue;

        thumbDiv.setAttribute('class', 'color-thumb');


        wrapDiv.appendChild(label);
        inputDiv.appendChild(thumbDiv);
        // inputDiv.appendChild(shadowColor);
        wrapDiv.appendChild(inputDiv);

        docFrag.appendChild(wrapDiv);



  }

  function buildRange (element, docFrag) {
    var wrapDiv  = document.createElement('div'),
        label    = document.createElement('label'),
        inputDiv = document.createElement('div'),
        thumbDiv = document.createElement('div'),
        elName = element.name,
        elValue = element.value;

        wrapDiv.setAttribute('class', 'input-wrap');

        label.setAttribute("for", elName + "-div");
        label.setAttribute("id", elName + "-div-label");
        label.setAttribute("class", "div-label");
        label.setAttribute("role", "label");
        label.innerText = elName.slice(0,1).toUpperCase() + elName.slice(1) + ": " + elValue;

        inputDiv.setAttribute('role', "input");
        inputDiv.setAttribute('class', "range");
        inputDiv.setAttribute('name', elName +"-div");
        inputDiv.setAttribute('id', elName + "-div");
        inputDiv.dataset.type = "range";
        inputDiv.dataset.min = element.min;
        inputDiv.dataset.max = element.max;
        inputDiv.dataset.step = element.step;
        inputDiv.dataset.value = elValue;

        thumbDiv.setAttribute('class', "range-thumb");

        wrapDiv.appendChild(label);
        inputDiv.appendChild(thumbDiv);
        wrapDiv.appendChild(inputDiv);

        docFrag.appendChild(wrapDiv);

        /*
        <div class="test" id="gamma-div">
            <label for="lightness" id="gamma-label">
              Lightness: <span>0</span>
            </label>

          <div role="input" class="range grey" id="lightness" data-type="range" data-min="0" data-max="2" data-step="0.1" data-value="0">
            <div class="range-thumb white"></div>
          </div>
        </div>
        */
  }

  function verifyNumber(number) {
    var n = new Number(number);
    if (isNaN(n)) {
      return 0;
    }
    return parseInt(number, 10);
  }

  function findTotalSteps (width, max, step) {
    var n = width / (max / step)  || 0.1; 
    return n;
  }

  function findCurrentStep(width, max, step, currentwidth) {
    var current = currentwidth / findTotalSteps(width, max, step);
    return current;
  }

  function updateLabelValue(id, value) {
    var text = id.replace('-div', "");
    document.querySelector('#'+id+"-label").innerText = text.slice(0,1).toUpperCase() + text.slice(1) + ": " + value;
  }

  function updateOrginalFormValue (id, value) {
    var form = document.forms[0];
        form[id].value = value;
  }

  function selectColor(el, e) {     
    var form = document.forms[0],
        node = el.parentNode,
        value, name, shadow;

        name = node.id.replace('-div', "");
  
        form[name].addEventListener('change', changeit, false);

        function changeit () {
          value = form[name].value;
          node.setAttribute('data-value', value);
          el.style = "background-color:" + value + ";";
          updateLabelValue(node.id, value)
          form[name].removeEventListener('change', changeit, false);
        }
        form["color"].click(e);
  }


  function moveTargetRange (el, e) {
    var child = el.children[0],
        value, moveBy, rect;
        rect = el.getBoundingClientRect();
        moveBy = ( e.x - rect.left );
        // fucking floating point numbers, man
        value = parseFloat((Math.round(findCurrentStep(rect.width, parseFloat(el.dataset.max), parseFloat(el.dataset.step), moveBy )) * el.dataset.step).toPrecision(2)); ;
        child.style.width = moveBy + "px";
        child.innerText = moveBy + " " + value;
        el.setAttribute('data-value', value);
        updateLabelValue(el.id, value);
        updateOrginalFormValue(el.id.replace("-div", ""), value);
  }

  function moveParentRange (el, e) {
    var node = el.parentNode,
        value, moveBy, rect;
        rect = node.getBoundingClientRect();
        moveBy = ( e.x - rect.left );
        value = parseFloat((Math.round(findCurrentStep( rect.width, parseFloat(node.dataset.max), parseFloat(node.dataset.step), moveBy)) * node.dataset.step).toPrecision(2));;
        el.style.width = moveBy + "px";
        el.innerText = moveBy + " " + value;
        node.setAttribute('data-value',  value);
        updateLabelValue(node.id, value);
        updateOrginalFormValue(node.id.replace("-div", ""), value);
        
  }


  function promode () {
    // Dont show effects
    document.querySelector('#effects').classList.add('invisible');
    // Dont show blends
    document.querySelector('#blends').classList.add('invisible');
    // Return controls
    document.querySelector('#controls').classList.remove('invisible');
    // Show original file inputs
    document.querySelector('#fileinputs').classList.remove('hidden');
    // Switch options for controls in display menu
    document.querySelector('#te').dataset.toggle = "controls"
    // Reflect this change in the menu
    document.querySelector('#te').innerHTML = "<p>Controls</p>";
    // Most of the menu is no longer needed
    document.querySelector('#de').classList.add('hidden');
    document.querySelector('#tq').classList.add('hidden');
    // Move buttons back onto controls
    var btns = document.querySelector('#button-bar').children[0];
    document.forms[0].appendChild(btns);

  }


  // =====================================
  // EVENTS DECORATORS
  function loadBufferFromFile (e, canvasID, callback) {
    var canvas = document.querySelector(canvasID),
        file = e.target.files[0],
        reader = new FileReader();

    if (!file) {
      handleError('Failed to load file');
    } else if (!file.type.match('image.*')) {
      handleError(file.name + ' is not a valid image file.');
    } else {
      reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
          checkImageSize(canvas,img);
          callback(canvas, img);
        }
        img.src = event.target.result;
      }
      reader.readAsDataURL(file);
    }
  }

  function useImageWorkerCallback (canvas, img) {
    var ctx = canvas.getContext('2d'),
        imageData, w = img.width, h = img.height;
    canvas.width  = w;
    canvas.height = h;
    canvas.style.width  = img.width + "px";
    canvas.style.height = img.height + "px";

    updateCanvasStats (w, h);

    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, w, h);

    GlitchWorker.postMessage({
      command: 'loadBuffers',
      buffer: imageData.data
    });


  }

  function useImageCallback (canvas, img) {
    var ctx = canvas.getContext('2d'),
        imageData, w = img.width, h = img.height;

    canvas.width  = w;
    canvas.height = h;
    canvas.style.width  = img.width + "px";
    canvas.style.height = img.height + "px";
    
    // you can hide this implementation as well
    updateCanvasStats (w,h);

    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, w, h);
    
    loadBuffer1(imageData.data);
    loadBuffer2(buffer1);
    loadBuffer3(buffer1);

    toggleLoader();
    fileChosen();

  }

  function useSampleCallback (canvas, img) {
    var ctx = canvas.getContext('2d'),
        mcanvas = document.querySelector('#ultros'),
        h = img.height,
        w = img.width,
        imageData;

        canvas.height = mcanvas.height;
        canvas.width  = mcanvas.width;
        // Both canvases are the same w/h, you can use either in the following
        ctx.drawImage(img, 0, 0, w, h, 0, 0, mcanvas.width, mcanvas.height);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        loadBuffer4(imageData.data);
        
        toggleLoader();
  }

  function useSampleWorkerCallback (canvas, img) {
   var ctx = canvas.getContext('2d'),
      mcanvas = document.querySelector('#ultros'),
      h = img.height,
      w = img.width,
      imageData;

      canvas.height = mcanvas.height;
      canvas.width  = mcanvas.width;
      // Both canvases are the same w/h, you can use either in the following
      ctx.drawImage(img, 0, 0, w, h, 0, 0, mcanvas.width, mcanvas.height);
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      

    GlitchWorker.postMessage({
      command: 'loadSample',
      buffer: imageData.data
    });


  }

  function checkImageSize(img, canvas) {
    // console.log(img, img.height, img.width);
    if (img.height > 2048 || img.width > 2048) {
      alert('HUGE IMAGE!');
      var shrinkmeCanvas = document.createElement('canvas');
      var sctx = shrinkmeCanvas.getContext('2d');
      var longEdge = img[(2880 < 2240 || 'height') || (2240 < 2880 || 'width')];
      var diff = longEdge - 2048;
      var perc = diff / longEdge;
      shrinkmeCanvas.width = Math.round(img.width * perc);
      shrinkmeCanvas.height = Math.round(img.height * perc);

      sctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, shrinkmeCanvas.width, shrinkmeCanvas.height);
      var imgData = sctx.getImageData(0, 0, shrinkmeCanvas.width, shrinkmeCanvas.height);

    }
  }


  function selectEffect (e) {
    var target = e.target,
        form = document.forms[0],
        element = e.target,
        effect;
        while (element.toString().match(/svg/gi))
          element = element.parentNode;
        if (element.classList.contains('box'))
          effect = element.dataset.effect;
        else
          return;

        // console.log("from: ",form.effect.value);
        form.effect.value = effect
        // console.log("to: ",form.effect.value);

  }

  function selectBlend (e) {
    var target = e.target,
        form = document.forms[0],
        element = e.target,
        blend;
        while (element.toString().match(/svg/gi))
          element = element.parentNode;
        if (element.classList.contains('box'))
          blend = element.dataset.blend;
        else
          return;

        // console.log("from:",form.blend.value);
        form.blend.value = blend
        // console.log("to:",form.blend.value);
  }

  // Main toggle command
  function toggleDisplay (el) {
    var toggleID, item;
    // if (el.dataset.toggle || el.parentNode.dataset.toggle) {
      toggleID = "#" + (el.dataset.toggle || el.parentNode.dataset.toggle);
      item = document.querySelector(toggleID);
      item.classList.toggle('hidden');
    // }
  }

  function hideDisplay (el) {
    var toggleID, item;
    toggleID = "#" + (el.dataset.hide || el.parentNode.dataset.hide);
    item = document.querySelector(toggleID);
    item.classList.toggle('expand');
  }

  function toggleSpecific (id) {
    var item = document.querySelector(id);
    item.classList.toggle('hidden');
  }

  function expandSpecific (id) {
    var item = document.querySelector(id);
    item.classList.toggle('expand');
  }

  function hideSpecific (id) {
    var item = document.querySelector(id);
    item.classList.add('hidden');

  }

  function showSpecific (id) {
    var item = document.querySelector(id);
    item.classList.remove('hidden');
  }

  // function showActive(e) {
  //   var target = e.target;
  //   target.classList.add('active');
  // }

  function disableActive() {
    var btnBar = document.querySelector('#button-bar');
    if (btnBar.querySelector('.active')) {
      btnBar.querySelector('.active').removeAttribute('disabled');
      btnBar.querySelector('.active').classList.remove('active'); 
    }
  }

  function disableScreens () {
    var screens = ['#effects', "#blends", "#options", "#imagebar", "#sample", "#info", "#filechooser"];
    for ( var i = 0, l = screens.length; i < l; ++i ) {
      hideSpecific(screens[i]);
    }

  }

  function deactiveButton (id) {
    var el = document.querySelector(id);
    el.setAttribute('disabled', true);
    el.classList.add('active');
  }

  function activateButton (id) {
    var el = document.querySelector(id);
    el.removeAttribute('disabled');
    el.classList.remove('active');

  }

  function closeMenu () {
    expandSpecific('#toggle');
    toggleSpecific('#open-toggle');
  }

  function toggleLoader() {
    toggleSpecific("#loader");
  }

  function toggleStage() {
    toggleSpecific('#stage');
  }

  function toggleEffects(){
    // hideSpecific('#blends');
    // showSpecific("#effects");
    toggleSpecific('#effects');
  }

  function toggleBlends() {
    toggleSpecific('#blends');
  }

  function toggleChooser() {
    toggleSpecific("#filechooser");
  }

  function toggleSampleDisplay () {
    toggleSpecific("#sample");
  }

  function toggleImageBar() {
    toggleSpecific("#imagebar");
  }

  function toggleQueueDisplay () {
    toggleSpecific("#queue")
  }

  function toggleControls () {
    toggleSpecific("#options");
  }

  function flipImageBox(e) {
    e.preventDefault();
    e.stopPropagation();
    var target = e.target.parentNode.parentNode
    if (target.classList.contains('flipped')) {
      target.classList.remove('flipped');
    } else {
      target.classList.add('flipped');
    }
  }


  function deleteImage(e) {
    var tar = e.target;
    var sectionEl = tar.parentNode.parentNode.parentNode.parentNode;
    var img = sectionEl.querySelector('img');
    if (sectionEl.dataset.saved || window.confirm("Are you sure you want to delete this image?")) {
      URL.revokeObjectURL(img.src);
      // Not implemented...yet
      // URL.revokeObjectURL("effectcsv");
      sectionEl.parentNode.removeChild(sectionEl);
    }
  }

  function downloadImage(e) {
    var tar = e.target;
    var sectionEl = tar.parentNode.parentNode.parentNode.parentNode;
    var img = sectionEl.querySelector('img');
    if (!sectionEl.dataset.saved) {
      sectionEl.dataset.saved = true;
    }
    sectionEl.querySelector('a').click();
  }

/*
  function loadQueueCSV (evt) {
    var file = evt.target.files[0]; 
    if (!file) {
      handleError('Failed to load file');
    } else if (!file.type.match('text.*')) {
      handleError(f.name + " is not a valid text file.");
    } else {
      var reader = new FileReader();
      reader.onload = function(e) { 
        // try { 
          var contents = e.target.result;
            handleMessage("Got the file.n" 
                  +"name: " + f.name + "n"
                  +"type: " + f.type + "n"
                  +"size: " + f.size + " bytesn"
                  + "starts with: " + contents.substr(1, contents.indexOf("n")) 
            );
            loadQueueFromText(contents);
          // } catch (e) {
            // handleError(e);
          // }
        }
        reader.readAsText(file);
      }
  }
  */
  
  function unloadAllImages() {
    var imageBar = document.querySelector('#imagebar');
    while(imageBar.firstElementChild) {
      if (imageBar.firstElementChild.querySelector('img')) {
        URL.revokeObjectURL(imageBar.firstElementChild.querySelector('img').src);
        URL.revokeObjectURL(imageBar.firstElementChild.querySelector('a').href);
      }
      imageBar.removeChild(imageBar.firstElementChild);
    }
  }

  function loadImage (e){
    toggleLoader();
    if (GlitchWorker)
      loadBufferFromFile(e, '#ultros', useImageWorkerCallback);
    else
      loadBufferFromFile(e, '#ultros', useImageCallback);
    // toggleLoader();
  }


  function loadSample (e){
    toggleLoader();
    if (GlitchWorker)
      loadBufferFromFile(e,'#bablyos', useSampleWorkerCallback);
    else
      loadBufferFromFile(e,'#bablyos',useSampleCallback);
    // toggleLoader();
  }

  function zoomInAction(e) {
    zoomInCanvas();
    zoomInSampleCanvas();
  }

  function zoomOutAction(e) {
    zoomOutCanvas();
    zoomOutSampleCanvas();
  }


  function queueAction(e) {
    e.preventDefault();
    e.stopPropagation();

    var opts = getOptions();

    addToQueue(opts);
    displayQueue();

  }
  // UI action goes here?
  function removeLastQueueAction(e) {
    e.preventDefault();
    e.stopPropagation();
    var lastOption = removeLastFromQueue();

    setOptions(lastOption);

  }

  function cleanUp () {
    toggleLoader();
    resetQueue();
    disableActive();
  }
 

  // NEW
  function glitchAction (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleLoader();
    runEffect(cleanUp); 
  }

  function runAction (e) {
    e.preventDefault();
    e.stopPropagation();
    // Effect overrides
    var opts = getOptions();
    opts.order = 0;
    toggleLoader();
    // Set active to indicate effect is still running
    deactiveButton('#i');
    verifyOptions(opts);
    addToQueue(opts);
    displayQueue();
    if (!GlitchWorker)
      runEffect(cleanUp); 
  }

  function restoreAction (e) {
    e.preventDefault();
    e.stopPropagation();
    // EFfect overrides
    deactiveButton('#d');
    var opts = getOptions();
    opts.order = 5;
    opts.effect = "copy";
    opts.blend = "copy";
    verifyOptions(opts);
    toggleLoader();
    addToQueue(opts);
    displayQueue();
    if (!GlitchWorker)
      runEffect(cleanUp);
  }

  function blendRestoreAction (e) {
    e.preventDefault();
    e.stopPropagation();
    deactiveButton('#b');
    var opts = getOptions();
    opts.order = 5;
    opts.effect = "copy";
    verifyOptions(opts);
    toggleLoader();
    addToQueue(opts);
    displayQueue();
    if(!GlitchWorker)
      runEffect(cleanUp); 
  }


  function sampleRestoreAction (e) {
    e.preventDefault();
    e.stopPropagation();
    deactiveButton('#p')
    var opts = getOptions();
    opts.order = 6;
    // For shitz n gigz
    opts.effect = "copy";
    verifyOptions(opts);
    toggleLoader();
    addToQueue(opts);
    displayQueue();
    if (!GlitchWorker)
      runEffect(cleanUp); 
  }


  function sampleAction (e) {
    e.preventDefault();
    e.stopPropagation();
    deactiveButton('#p');
    var opts = getOptions();
    opts.order = 6;
    // For shitz n gigz
    // opts.effect = "copy";
    verifyOptions(opts);
    toggleLoader();
    addToQueue(opts);
    displayQueue();
    if (!GlitchWorker)
      runEffect(cleanUp); 
  }

  function saveAction(e) {
    e.preventDefault();
    e.stopPropagation();

    buildImage();
    
  }



  function startApp () {
    toggleLoader();
    // toggleSpecific('#info')
    toggleSpecific('#filechooser');

  }

  function fileChosen () {
    toggleSpecific('#filechooser');
    toggleSpecific('#effects');
  }

  function effectChosen() {
    toggleSpecific('#effects');
    toggleSpecific('#blends');
  }

  function blendsChosen() {
    toggleSpecific("#blends");
  }


  // ===========================================
  // EVENT DELEGATION
  function navDelegation (e) {
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;

    disableScreens();
    if (target.dataset.toggle || target.parentNode.dataset.toggle)
      toggleDisplay(target);
    
    // if (target.dataset.hide || target.parentNode.dataset.hide)
    //   hideDisplay(target);
   
    closeMenu();

    // var nid = target.parentNode.id;
    // var id = target.id;
    // switch (true) {
    //   case id === "ce" || nid === 'ce':
    //     toggleStage(e);
    //     break;
    //   case id === "se" || nid === 'se':
    //     toggleSampleDisplay(e);
    //     break;
    //   case id === "te" || nid === 'te':
    //     toggleControls(e);
    //     break;
    //   case id === "ti" || nid === 'ti':
    //     toggleImageBar(e);
    //     break;
    //   case id === "tq" || nid === 'tq':
    //     toggleQueueDisplay(e);
    //     break;
    //   case id === "de" || nid === 'de':
    //     toggleChooser(e);
    //     break;
    //   default:
    //     break;
    // }
  }

  function menuOpener (e) {
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    document.querySelector('#toggle').classList.toggle('expand');
    if (target.dataset.toggle || target.parentNode.dataset.toggle)
      toggleDisplay(target);
      // hideDisplay(target);
  }

  function filechooserDelegation (e){
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    var id = target.id;
    switch(true) {
      case id === "filebutton":
        document.querySelector('#imageloader').click();
        break;
      case id === "samplebutton":
        document.querySelector('#sampleloader').click();
    }
    // document.querySelector("#"+target.id).click();
  }

  


  function optionsDelegation (e) {
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    var id = target.id;
    // console.log(target, e);
    switch(true) {
      case target.classList.contains('range'):
        moveTargetRange(target,e);
        break;
      case target.parentNode.classList.contains('range'):
        moveParentRange(target,e);
        break;
      case target.classList.contains('color-thumb'):
        selectColor(target, e);
      default:
        break;
    }

  }



  function imagebarDelegation(e) {
    var target = e.target;
    var classList = target.classList;
    switch(true) {
      case classList.contains('img-wrap'):
        // console.log('img-wrap');
        break;
      case classList.contains('card'):
        // console.log('card');
        break;
      case classList.contains('card-front'):
        // console.log('card-front');
        break;
      case classList.contains('card-back'):
        // console.log('card-back');
        break;
      case classList.contains('flip-button'):
        flipImageBox(e);
        // console.log('flip-button');
        break;
      case classList.contains('delete-img'):
        deleteImage(e);
        // console.log('delete-img');
        break;
      case classList.contains('download-img'):
        downloadImage(e);
        // console.log('download-img');
        break;
    }
  }

  function queuebarDelegation(e) {
    var target = e.target;
    var classList = target.classList;
    switch(true) {
      case classList.contains('queue-wrap'):
        // console.log('queue-wrap');
        break;
      case classList.contains('card'):
        // console.log('card');
        break;
      case classList.contains('card-front'):
        // console.log('card-front');
        break;
      case classList.contains('card-back'):
        // console.log('card-back');
        break;
      case classList.contains('flip-button'):
        flipImageBox(e);
        // console.log('flip-button');
        break;
      case classList.contains('delete-queue'):
        // console.log('delete-queue');
        break;
      case classList.contains('edit-queue'):
        // console.log('edit-queue');
        break;
    }
  }


  function selectBox (e, callback) {
    var element = e.target;
    // Follow the prototype chain upwards
    while(element.toString().match(/svg/gi))
      element = element.parentNode;

    if (element.classList.contains('box')) {
      if (element.classList.contains('selected')) {
        element.classList.toggle('selected');
      } else {
        if(element.parentNode.querySelector('.selected'))
          element.parentNode.querySelector('.selected').classList.toggle('selected');
        element.classList.toggle('selected');
      }
      callback();
    }
  }

  function effectDelegation (e) {
    selectBox(e, effectChosen);
    selectEffect(e);
  }

  function blendDelegation (e) {
    selectBox(e, blendsChosen);
    selectBlend(e);
  }

  function bootstrapNames () {
    if (GlitchWorker) {
      GlitchWorker.postMessage({
        command: 'bootstrap'
      });
    } else {
      bootstrapEffects();
      bootstrapBlends();
      
    }
    rebuildForm();
  }

    function bootstrapApp() {
      bootstrapNames();      
      document.querySelector("#toggle").addEventListener('mouseup', navDelegation, true);
      document.querySelector("#open-toggle").addEventListener('mouseup', menuOpener, false);
      // document.querySelector('#ce').addEventListener('mouseup', toggleStage, false);
      // document.querySelector('#se').addEventListener('mouseup', toggleSampleDisplay, false);
      // document.querySelector('#te').addEventListener('mouseup', toggleControls, false);
      // document.querySelector('#ti').addEventListener('mouseup', toggleImageBar, false);
      // document.querySelector('#tq').addEventListener('mouseup', toggleQueueDisplay, false);
      document.querySelector('#filechooser').addEventListener('mouseup', filechooserDelegation, false);
      document.querySelector('#options').addEventListener('mouseup', optionsDelegation, false);
      document.querySelector('#imagebar').addEventListener('mouseup', imagebarDelegation, false);
      document.querySelector('#queue').addEventListener('mouseup', queuebarDelegation, false);
      document.querySelector('#effects').addEventListener('mouseup', effectDelegation, false);
      document.querySelector('#blends').addEventListener('mouseup', blendDelegation, false);
      document.querySelector('#imageloader').addEventListener('change', loadImage, false);
      document.querySelector('#sampleloader').addEventListener('change', loadSample, false);
      // document.querySelector('#m').addEventListener('change', liveTyping, false);
      document.querySelector('#zi').addEventListener('mouseup', zoomInAction, false);
      document.querySelector('#zo').addEventListener('mouseup', zoomOutAction, false);
      document.querySelector('#q').addEventListener('mouseup', queueAction, false);
      document.querySelector('#p').addEventListener('mouseup', sampleAction, false);
      document.querySelector('#s').addEventListener('mouseup', saveAction, false);
      document.querySelector('#r').addEventListener('mouseup', glitchAction, false);
      document.querySelector('#i').addEventListener('mouseup', runAction, false);
      document.querySelector('#d').addEventListener('mouseup', restoreAction, false);
      document.querySelector('#b').addEventListener('mouseup', blendRestoreAction, false);
      // document.forms[0].addEventListener('submit', glitchAction, false);
      // socket.on('glitched', receiveGlitchData);
      // socket.on('reset', resetGlitchAction);
      // socket.on('connected', connectAction);
      // socket.on('message', messageAction);
      // socket.on('error', errorAction);
      startApp();
    }


    function teardownApp() {
      var leave = window.confirm("You have unsaved images, are you sure you want to exit?");
      if (leave) {    
        var main = document.querySelector('#main');
        document.querySelector("#toggle").removeEventListener('mouseup', navDelegation, false);
        document.querySelector("#open-toggle").removeEventListener('mouseup', menuOpener, false);
        // document.querySelector('#ce').removeEventListener('mouseup', toggleStage, false);
        // document.querySelector('#se').removeEventListener('mouseup', toggleSampleDisplay, false);
        // document.querySelector('#te').removeEventListener('mouseup', toggleControls, false);
        // document.querySelector('#ti').removeEventListener('mouseup', toggleImageBar, false);
        // document.querySelector('#tq').removeEventListener('mouseup', toggleQueueDisplay, false);
        document.querySelector('#filechooser').removeEventListener('mouseup', filechooserDelegation, false);
        document.querySelector('#options').removeEventListener('mouseup', optionsDelegation, false);
        document.querySelector('#imagebar').removeEventListener('mouseup', imagebarDelegation, false);
        document.querySelector('#queue').removeEventListener('mouseup', queuebarDelegation, false);
        document.querySelector('#effects').removeEventListener('mouseup', effectDelegation, false);
        document.querySelector('#blends').removeEventListener('mouseup', blendDelegation, false);        
        document.querySelector('#imageloader').removeEventListener('change', loadImage, false);
        document.querySelector('#sampleloader').removeEventListener('change', loadSample, false);
        document.querySelector('#zi').removeEventListener('mouseup', zoomInAction, false);
        document.querySelector('#zo').removeEventListener('mouseup', zoomOutAction, false);
        document.querySelector('#q').removeEventListener('mouseup', queueAction, false);
        document.querySelector('#p').removeEventListener('mouseup', sampleAction, false);
        document.querySelector('#s').removeEventListener('mouseup', saveAction, false);
        document.querySelector('#r').removeEventListener('mouseup', glitchAction, false);
        document.querySelector('#i').removeEventListener('mouseup', runAction, false);
        document.querySelector('#d').removeEventListener('mouseup', restoreAction, false);
        document.querySelector('#b').removeEventListener('mouseup', blendRestoreAction, false);
        // document.forms[0].removeEventListener('submit', glitchAction, false);
        unloadAllImages();
        while (main.firstElementChild) {
          main.removeChild(main.firstElementChild);
        }
      }
      
    }



window.resetQueue = resetQueue;
window.toggleLoader = toggleLoader;
window.zoomOutCanvas = zoomOutCanvas;
window.zoomInCanvas = zoomInCanvas;
window.zoomReset = zoomReset;
window.teardown = teardownApp;
window.onload = bootstrapApp;
window.onunload = teardownApp;
window.promode = promode

window.gl = GlitchWorker;


})(window, effectsCode(), blendsCode());




/* OLD Code*/

// OLD load image
      /*var canvasstats = document.querySelector('#canvasstats'),
          canvas = document.querySelector('#ultros'),
          ctx = canvas.getContext('2d'),
          file = e.target.files[0],
          reader = new FileReader();
      
      if (!file) {
        handleError('Failed to load file');
      } else if (!file.type.match('image.*')) {
        handleError(file.name + ' is not a valid image file.');
      } else {
        reader.onload = function(event) {
          // try {
            var img = new Image();
            img.onload = function(){
              var imageData, w = img.width, h = img.height;
              canvas.width = w;
              canvas.height = h;
              canvas.style.width = img.width + "px";
              canvas.style.height = img.height + "px";
              canvasstats.innerHTML = "<p>Height: " + h + "px</p><p>Width: " +  w + "px</p>";
              ctx.drawImage(img,0,0);
              imageData = ctx.getImageData(0, 0, w, h );
              loadBuffer1(imageData.data);
              loadBuffer2(buffer1);
              loadBuffer3(buffer1);
            }
            img.src = event.target.result;
          // } catch (err) {
            // handleError(err);
          // }
        }
        reader.readAsDataURL(file);           
      }*/
/*
      // Old load sample
      var mcanvas = document.querySelector('#ultros'),
          canvas = document.querySelector('#bablyos'),
          ctx = canvas.getContext('2d'),
          file = e.target.files[0],
          reader = new FileReader();
      
      if (!file) {
        handleError('Failed to load file');
      } else if (!file.type.match('image.*')) {
        handleError(file.name + ' is not a valid image file.');
      } else {
        reader.onload = function(event) {
          // try {
            var img = new Image();
            img.onload = function(){
              var imageData, w = img.width, h = img.height;
              canvas.width = mcanvas.width;
              canvas.height = mcanvas.height;
              
              // This canvas is not rendered
              // canvas.style.width = img.width + "px";
              // canvas.style.height = img.height + "px";
              
              // This does not need to update canvas stats
              // canvasstats.innerHTML = "<p>Height: " + h + "px</p><p>Width: " +  w + "px</p>";
              
              ctx.drawImage(img,0,0, w, h, 0, 0, canvas.width, canvas.height);
              imageData = ctx.getImageData(0, 0, mcanvas.width, mcanvas.height );
              loadBuffer4(imageData.data);
              
              // loadBuffer2(buffer1);
              // loadBuffer3(buffer1);
            }
            img.src = event.target.result;
          // } catch (err) {
            // handleError(err);
          // }
        }
        reader.readAsDataURL(file);           
      }
      */

   // EVEN OLDER handle image code
  /*function handleImage(e){
    // if (/.*(jpg|jpeg|png|gif)/gi.test(e.target.files[0].name) ){

    var reader = new FileReader();
    reader.onload = function(event){
        // console.log(e, e.target.files[0].name)

        try {

          var img = new Image();
          img.onload = function(){
            var imageData, w = img.width, h = img.height;
              canvas.width = w;
              canvas.height = h;
              canvas.style.width = w + "px";
              canvas.style.height = h + "px";
              canvasstats.innerHTML = "<p>Height: " + canvas.height + "px</p><p>Width: " +  canvas.width + "px</p>";
              ctx.drawImage(img,0,0);
              imageData = ctx.getImageData(0, 0, w, h);
              loadBuffer1(imageData.data);
              loadBuffer2(buffer1);
          }
          img.src = event.target.result;
        } catch (err) {
          alert('There was an arror!', err);
        }
    }
    reader.readAsDataURL(e.target.files[0]);     
  }*/


/*
  function loadBufferFromOriginal(readerID, canvasID) {
    // use id here
    var file = document.querySelector('#imageloader').files[0];
    var reader = new FileReader();
    
    reader.onload = function(evt) {
      // try {
        var img = new Image();
        img.onload = function fillBufferWithRestoreData(e) {
          var canvas = document.querySelector('#magnos'),
              ctx = canvas.getContext('2d');
              w = img.width, h = img.height,
              imageData;
          
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img,0,0);
          // imageData = ctx.getImageData(getStartX(), getStartY(), w, h);
          imageData = ctx.getImageData(0, 0, w, h);
          loadBuffer1(imageData.data);
        }
        img.src = event.evt.result;
      
      // } catch (err) {
      //     alert('There was an arror!', err);
      //   }
    }
    reader.readAsDataURL(file); 
  }

  function loadBufferFromExternal(id) {
    // use id here
    var file = document.querySelector(id).files[0];
    reader.readAsDataURL(e.target.files[0]); 
    // TODO Load image buffer


  }
*/

/*
    function verifyOptions(obj) {
      if (obj.filename !== document.forms[0].imageloader.files[0].name ) {
        obj.filename = document.forms[0].imageloader.files[0].name;
        obj.width  = document.querySelector('#ultros').width;
        obj.height  = document.querySelector('#ultros').height;
        obj.length  = obj.width * obj.height * 4;
      }
      obj.effect = (obj.effect === null ) ? 'noop' : obj.effect;
      obj.order  = (obj.order === null ) ? '1' : obj.order;
      obj.channel = ( !(obj.channel < 8) || !(obj.channel > 0) ) ? 0 : obj.channel;
      obj.threshold = ( !(obj.threshold > 0) || !(obj.threshold < 256) ) ? 50 : obj.threshold;     
      obj.depth = ( !(obj.depth > 0) || !(obj.depth < 256) ) ? 1.0 : obj.depth;     
      obj.xspace = ( !(obj.xspace > 0) || !(obj.xspace < 256) ) ? 50 : obj.xspace;     
      obj.yspace = ( !(obj.yspace > 0) || !(obj.yspace < 256) ) ? 50 : obj.yspace;     
      obj.weight = ( !(obj.weight > 0) || !(obj.weight < 256) ) ? 50 : obj.weight;     
      obj.stroke = ( !(obj.stroke > 0) || !(obj.stroke < 256) ) ? 50 : obj.stroke;     
      if (isLSB()) {
        // LSB architecture
        obj.color =  ( !(obj.color > 0xFF000000) || !(obj.color < 0xFFFFFFFF) ) ? 0xFFFFFFFF : obj.color;
      } else {
        // MSB architecture
        obj.color =  ( !(obj.color > 0x000000FF) || !(obj.color < 0xFFFFFFFF) ) ? 0xFFFFFFFF : obj.color;     
      }
    }
    */


/*

  function testBoth(obj) {
    return [parseInt(obj), parseFloat(obj)]
  }


*/



/*
  OLD
  function glitchAction(e) {
    e.preventDefault();
    // e.stopPropagation();
    var params = {};
    var canvas = document.querySelector('#ultros');
    var m = document.querySelector('#m');
    var ctx = canvas.getContext('2d');
    var dataURL = canvas.toDataURL();
    var imgData;

    beginWork();
    
    params.png = dataURL;
    params.options = retrieveQueue();

    socket.emit('glitch', params);
    
    resetQueue();

    handleMessage( m.value );
    m.value = '';

    return false;

  }
  */


    // function liveTyping() {
    //   var m = document.querySelector('#m'), cache;
    //   setTimeout(function() { 
    //     if (m.value != cache) {
    //       socket.emit('typing');     
    //     }
    //   }, 100);
    // }



/*

  function deleteImage(e) {
    e.preventDefault();
    e.stopPropagation();
    var tar = e.target;
    if (e.target.dataset.saved == true) {
      URL.revokeObjectURL("image");
      URL.revokeObjectURL("effectcsv");
      e.parent.removeChild(e);
    }
  }

  function downloadImage(e) {
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    target.dataset.saved = true;
    // Find download link, do click
  }*/


/*


  function hideControls(e) {
    e.preventDefault();
    e.stopPropagation();
    var form = document.forms[0];
    if (form.classList.contains('hidden')) {
      form.classList.remove('hidden');
    } else {
      form.classList.add('hidden');
    }
  }



*/

/*


  function moveThumb(e) {
    var tar = e.target, value, moveBy, rect;
    if ( (tar.classList && tar.classList.contains('range') ) || e.target.parentNode.classList.contains('range') ) {
      if (tar.classList.contains('range')) {
        rect = tar.getBoundingClientRect();
          moveBy = ( e.x - rect.left );
          // fucking floating point numbers, man
          value = parseFloat((Math.round(findCurrentStep(rect.width, parseFloat(tar.dataset.max), parseFloat(tar.dataset.step), moveBy )) * tar.dataset.step).toPrecision(2)); ;
          tar.setAttribute('data-value', value);
          tar.children[0].style.width = moveBy + "px";
          tar.children[0].innerText = moveBy + " " + value;
        } else {
          rect = tar.parentNode.getBoundingClientRect();
          moveBy = ( e.x - rect.left );
          value = parseFloat((Math.round(findCurrentStep( rect.width, parseFloat(tar.parentNode.dataset.max), parseFloat(tar.parentNode.dataset.step), moveBy)) * tar.parentNode.dataset.step).toPrecision(2));;
          tar.style.width = moveBy + "px";
          tar.innerText = moveBy + " " + value;
          tar.parentNode.setAttribute('data-value',  value);
          
        }
      } else {
        return;
      }
  }


*/

/*
  function toggleLoader() {
    var loader = document.querySelector('#loader');
    if (loader.classList.contains('hidden')) {
      loader.classList.remove('hidden');
    } else {
      loader.classList.add('hidden');
    }
  }


  function toggleStage(e) {
    e.preventDefault();
    e.stopPropagation();
    var stage = document.querySelector('#stage');
    if (stage.classList.contains('hidden')) {
      stage.classList.remove('hidden');
    } else {
      stage.classList.add('hidden');
    }
  }  

  function toggleChooser(e) {
    e.preventDefault();
    e.stopPropagation();
    var chooser = document.querySelector('#filechooser');
    if (chooser.classList.contains('hidden')) {
      chooser.classList.remove('hidden');
    } else {
      chooser.classList.add('hidden');
    }
  }  

  function toggleSampleDisplay(e) {
    e.preventDefault();
    e.stopPropagation();
    var sampleBar = document.querySelector('#sample');
    if (sampleBar.classList.contains('hidden')) {
      sampleBar.classList.remove('hidden');
    } else {
      sampleBar.classList.add('hidden');
    }
  }  


  function toggleImageBar(e) {
    e.preventDefault();
    e.stopPropagation();
    var imageBar = document.querySelector('#imagebar');
    if (imageBar.classList.contains('hidden')) {
      imageBar.classList.remove('hidden');
    } else {
      imageBar.classList.add('hidden');
    }
  }

  function toggleQueueDisplay (e) {
    e.preventDefault();
    e.stopPropagation();
    var queueDisplay = document.querySelector('#queue');
    if (queueDisplay.classList.contains('hidden')) {
      queueDisplay.classList.remove('hidden');
    } else {
      queueDisplay.classList.add('hidden');
    }
  }

  function toggleControls(e) {
    e.preventDefault();
    e.stopPropagation();
    var controls = document.querySelector('#options')
    // var form = document.forms[0];
    if (controls.classList.contains('hidden')) {
      controls.classList.remove('hidden');
    } else {
      controls.classList.add('hidden');
    }
  }
*/


/*
  ADD THIS TOO
  document.addEventListener('click', function addOrSubtract(e) {
    var tar = e.target, className;
    if (tar.classList.contains('edit-plus')) {
      tar.parentNode.dataset.text = tar.parentNode.querySelector('.edit-area').innerText = verifyNumber(tar.parentNode.querySelector('.edit-area').innerText) + 1;
      tar.contentEditable = false;
    }
    if (tar.classList.contains('edit-minus')) {
      tar.parentNode.dataset.text = tar.parentNode.querySelector('.edit-area').innerText = verifyNumber(tar.parentNode.querySelector('.edit-area').innerText) - 1;
      tar.contentEditable = false;
    }
  })
*/

