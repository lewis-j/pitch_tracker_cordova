//generate minified css and js for index, pitch_data, amd roster_edit

module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      sass: {
        files: 'app/src/styles/sass/*.scss',
        tasks: ['css'],
        options: {
          livereload: 35729
        }
      },
      concat: {
        files: ['app/src/scripts/*.js'],
        tasks: ['concat']
      },
      uglify: {
        files: 'app/src/scripts/compiled/*.js',
        tasks: ['uglify'],
        options: {
          livereload: true
        }
      },
      all: {
        files: ['**/*.html'],
        options: {
          livereload: true
        }
      }
    },

    concat: {
      options: {
        separator: '\n/*next file*/\n\n',
         sourceMap :true
      },
      index: {
        src: ['app/src/scripts/config.js','app/src/scripts/xml_calls.js','app/src/scripts/pouch_db_transfer.js','app/src/scripts/login_modal.js','app/src/scripts/user_interactions.js','app/src/scripts/index.js'],
        dest: 'app/src/scripts/compiled/main.js'
      },
      pitch_data: {
        src: ['app/src/scripts/config.js','app/src/scripts/menu_btn_pitch_data.js','app/src/scripts/login_modal.js','app/src/scripts/pitch_data.js'],
        dest: 'app/src/scripts/compiled/pitch_data_main.js'
      },
      roster_edit: {
        src: ['app/src/scripts/config.js','app/src/scripts/menu_btn_pitch_data.js', 'app/src/scripts/login_modal.js','app/src/scripts/user_interactions.js','app/src/scripts/roster_edit.js'],
        dest: 'app/src/scripts/compiled/roster_edit_main.js'
      }
    },

    uglify: {
      build: {
        files: {
          'app/dest/scripts/main.min.js': ['app/src/scripts/compiled/main.js'],
          'app/dest/scripts/pitch_data_main.min.js': ['app/src/scripts/compiled/pitch_data_main.js'],
          'app/dest/scripts/roster_edit_main.min.js': ['app/src/scripts/compiled/roster_edit_main.js'],

        }
      }
    },

   cssmin: {
    build: {
      src: 'app/src/styles/css/index.css',
      dest: 'app/dest/styles/index.min.css'
    },
    pitch_data: {
      src: 'app/src/styles/css/pitch_data.css',
      dest: 'app/dest/styles/pitch_data.min.css'
    },
    roster_edit: {
      src: 'app/src/styles/css/roster_edit.css',
      dest: 'app/dest/styles/roster_edit.min.css'
    }
  },

  sass: {
    dev: {
      files: {
         // destination     // source file
        'app/src/styles/css/index.css': 'app/src/styles/sass/index.scss',
        'app/src/styles/css/pitch_data.css': 'app/src/styles/sass/pitch_data.scss',
        'app/src/styles/css/roster_edit.css': 'app/src/styles/sass/roster_edit.scss',
              }
            }
          },
        });

  // Default task
  grunt.registerTask('default', ['js','watch']);
  grunt.registerTask('css', ['sass', 'cssmin']);
  grunt.registerTask('js', ['concat', 'uglify']);

  // Load up tasks
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');


};
