
  "use strict";

  // importScripts('./effects.js');
  // importScripts('./blends.js');
  inportScripts('./target.js');

  var effects = effectsCode();
  var blends = blendsCode();

  var buffer1; // Main
  var buffer2; // Work
  var buffer3; // Restore
  var buffer4; // Sample
  var queue = [];
  var that = this;

  // ===================================
  // Wrapper around buffer to protect against API changes
  function loadBuffer1(buf) {
    // console.log("data loaded!")
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

/*

  onmessage = function (e) {
    console.log("Message recieved from main script");
    var workerResult = "Result: "+ (e.data[0] + e.data[1]);
    console.log("Comin back atcha");
    postMessage(workerResult);
  }
*/
    this.onmessage = messageDelegation;


    function messageDelegation (e) {
      e.preventDefault();
      e.stopPropagation();
      switch(e.data.command) {
        case 'bootstrap':
          bootstrap();
          break;
        case 'init':
          // handleMessage('connected!');
          break;
        case 'loadBuffers':
          if (e.data.buffer && e.data.buffer.length > 0) {          
            loadBuffer1(e.data.buffer);
            loadBuffer2(e.data.buffer);
            loadBuffer3(e.data.buffer);
            that.postMessage({
              command: 'successfulLoad'
            });
          } else {
            // console.log("no bueno")
            that.postMessage({
              command: 'error',
              msg: 'canvas data not loaded!'
            });
          }
          break;
        case 'loadSample' :
          if (e.data.buffer && e.data.buffer.length > 0) {
            loadBuffer4(e.data.buffer);
            that.postMessage({
              command: 'successfulSample'
            });
          } else {
            that.postMessage({
              command: 'error',
              msg: 'Sample data not loaded!'
            });
          }
          break;
        case 'addToQueue':
          addToQueue(e.data.opts);
          that.postMessage({
            command: 'successfulQueue'
          });
          break;
        case 'runEffect':
          runEffect();
          break;
        default:
          defaultMessage();
          break;
      }
    }

    function bootstrap() {
      var lists = {
        effects: Object.keys(effects),
        blends: Object.keys(blends)
      };
      that.postMessage({
        command: 'bootstrapped',
        lists: lists
      });
    }



    function defaultMessage() {
      console.log("Do not understand last command");
    }



    // ===========================================
    // Wrapper around queue to protect API changes
    function pingQueue() {
      return (queue.length > 0);
    }

    function retrieveQueue() {
      return queue;
    }

    function addToQueue(opts) {
      queue.push(opts);
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

    function handleMessage (msg) {
      that.postMessage({
        command: 'message',
        message: msg
      });
    }

    function handleError (msg) {
      that.postMessage({
        command: 'error',
        msg: msg
      });
    }



// ========================================
// EFFECT RUNNER
// ========================================
  function runEffect() {
    // console.log("Run this effect plox")
    if ( buffer1 == undefined || buffer1.length == 0 || buffer2 == undefined || buffer2.length == 0) {
      handleError("No image data available");
      return;
    }

    for (var i = 0, l = queue.length; i < l; ++i) {
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
    // console.log(that);
    that.postMessage({
      command: 'returnData',
      buffer: buffer1
    });

  }


  