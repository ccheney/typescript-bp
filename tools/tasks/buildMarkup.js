/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    var pkg = require('../../package.json');
    var shouldMinify = !grunt.option('dev');

    grunt.config.merge({
        hb: {
            buildMarkup: {
                options: {
                    bustCache: true,
                    data: '<%= env.DIR_SRC %>/assets/data/**/*.json',
                    helpers: [
                        '<%= env.DIR_NPM %>/handlebars-layouts/index.js'
                    ],
                    partials: [
                        '<%= env.DIR_SRC %>/**/*.hbs'
                    ]
                },
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>',
                    dest: '<%= env.DIR_TMP %>',
                    ext: '.html',
                    src: [
                        '**/*.hbs',
                        '!templates/**',
                        '!assets/vendor/**'
                    ]
                }]
            }
        },

        // Injects version numbers for cache busting.
        'string-replace': {
            buildMarkup: {
                options: {
                    replacements: [{
                        pattern: /@@version/g,
                        replacement: pkg.version
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_TMP %>',
                    dest: '<%= env.DIR_DEST %>',
                    src: ['**/*.html']
                }]
            }
        },

        // Replaces script and style tag references with a reference to a
        // single optimized output file.
        usemin: {
            html: ['<%= env.DIR_DEST %>/**/*.html']
        }
    });

    grunt.registerTask('buildMarkup',
        shouldMinify
            ? [
                'hb:buildMarkup',
                'string-replace:buildMarkup',
                'usemin'
            ]
            : [
                'hb:buildMarkup',
                'string-replace:buildMarkup'
            ]
    );
};
