

function sequenceFrames(frameNo) {
  return ("0".repeat(10)).slice(parseInt(frameNo,10).toString().length) + parseInt(frameNo,10).toString();
}





module.exports =  {
  sequenceFrames : sequenceFrames
}