/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    grunt.config.merge({
        // Verifies that script files conform to set standards.
        jshint: {
            lintScripts: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: [
                    'Gruntfile.js',
                    '<%= env.DIR_SRC %>/assets/scripts/**/*.js'
                ]
            }
        },

        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            files: {
                src: ['<%= env.DIR_SRC %>/assets/scripts/**/*.ts', '!**/*.d.ts', '!**/_declare/**']
            }
        }
    });

    grunt.registerTask('lintScripts', [
        'force:on',
        'tslint',
        'force:reset'
    ]);
};
