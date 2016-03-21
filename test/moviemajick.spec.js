const assert = require('assert');
const mm = require("../lib/moviemajick.js");

assert( mm.sequenceFrames(0) === "0000000000" );

assert( mm.sequenceFrames(11010) === "0000011010" );

assert( mm.sequenceFrames("bigBaddaBoom") === "0000000NaN" );

assert( mm.sequenceFrames(77866610101001) === "77866610101001" );