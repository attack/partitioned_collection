module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          base: '',
          port: 8888
        }
      }
    },

    watch: {
      files: ['src/**/.js', 'specs/*Spec.js'],
      tasks: 'jasmine:default:build'
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'spec/*Spec.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    jasmine: {
      default: {
        src: 'src/**/*.js',
        options: {
          specs: 'spec/*Spec.js',
          outfile: 'jasmine.html',
          keepRunner: true,
          vendor: [
            'public/javascripts/underscore.js',
            'public/javascripts/backbone.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('dev', ['jasmine:default:build', 'connect', 'watch']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('default', ['test']);
};
