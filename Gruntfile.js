module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    paths: {
      src: {
        serverjs: 'server/**/*.js',
        dbjs: 'db/**/*.js',
        clientjs: 'client/src/*.js'
      },
      dest: {
        minClient: 'prod/src/minified.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    
    jshint: {
      options: {
        // options here to override JSHint defaults
        jshintrc: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      },
      server: ['<%= paths.src.serverjs %>', '<%= paths.src.dbjs %>'],
      client: ['<%= paths.src.clientjs %>']
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      client: {
        src: '<%= paths.src.clientjs %>',
        dest: '<%= paths.dest.minClient %>'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');

  // Default task(s).
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['syntaxTest','minify']);
  grunt.registerTask('syntaxTest', ['jshint:server', 'jshint:client']);
  grunt.registerTask('minify', ['uglify:target']);
};
