
// Grunt Configs
var javascriptFiles =  ['./client/blends.js', './client/effects.js', './client/runner.js'];
var javascriptEffects = ['./client/blends.js', './client/effects.js'];
var javascriptConcat = './client/final.js';
var javascriptUgli = './client/<%pkg.name%>.min.js';

//concat
var concatConfig = {
  options: {
    seperator: ";"
  },
  dist: {
    src: javascriptFiles,
    dest: javascriptConcat
  }
}


// uglify
var uglifyOptions = {
  mangle: true,
  // compress: smallOptions,
  sourceMap : true,
  preserveComments: false,
  compress: {
    drop_console: true
  },
  banner: "/*! <%= pkg.name %> -v<%= pkg.version %>-<%-pkg.description%> -<%= grunt.template.today('yyyy-mm-dd') %> */",
  footer: "/*! <%= pkg.license %> by <%= pkg.author %> */",
  screwIE8: true
}

var smallOptions = {
  sequences: true,
  drop_debugger: true,
  drop_console: true,
  hoist_funs: true,
  warn: true
}

var uglifyTarget = {
  options: uglifyOptions,
  files: {
    './client/<%= pkg.name %>.min.js': [javascriptConcat]
  }
}

var compressOptions = { 
  mangle: false,
  compress: {
    sequences: true,
    drop_debugger: true,
    drop_console: true,
    hoist_funs: true,
    warn: true
  },
  preserveComments: false,
  banner: "/*! <%= pkg.name %> -v<%= pkg.version %>-<%-pkg.description%> -<%= grunt.template.today('yyyy-mm-dd') %> */",
  footer: "/*! <%= pkg.license %> by <%= pkg.author %> */",
  screwIE8: true
}

var uglifyCompress = {
  options: compressOptions,
  files: {
    './client/target.js': [javascriptEffects]
  }
}

// jshint
var jshintConfig = {
  options: jshintOptions,
  beforeconcat: javascriptFiles,
  afterconcat: javascriptUgli
}

var jshintOptions = {
  "esversion": 5,
  "shadow": false,
  "futurehostile": true,
  "notypeof": true,
  "unused": true,
  "eqnull": true,
  "eqeqeq": true,
  "undef": true,
  "asi": true
}

// Begin Grunt
module.exports = function (grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: concatConfig,
    uglify: {
      my_target: uglifyTarget,
      compress_only: uglifyCompress
      },
    jshint: jshintConfig
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('build', ['concat', 'uglify']);
  // grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('lul', ['concat']);
  grunt.registerTask('moo', ['uglify']);

}










