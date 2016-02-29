/* eslint-env node */
'use strict';

module.exports = function(grunt) {
    var pkg = require('../../package.json');

    grunt.config.merge({
        // Compiles Handlebars hbs templates into JavaScript (JST)
        copy: {
            precompileJst: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>',
                    dest: '<%= env.DIR_TMP %>',
                    src: ['assets/scripts/precompiledJst.js']
                }]
            }
        },

        handlebars: {
            precompileJst: {
                options: {
                    //amd: ['handlebars'],
                    namespace: 'JST',
                    // Registers all files that start with '_' as a partial.
                    partialRegex: /^_/,
                    // Shortens the file path for the templates.
                    processName: function(filePath) { // input:  src/templates/_header.hbs
                        return filePath.slice(filePath.indexOf('template'), filePath.lastIndexOf('.')); // output: templates/_header
                    },
                    // Shortens the file path for the partials.
                    processPartialName: function(filePath) { // input:  src/templates/_header.hbs
                        return filePath.slice(filePath.indexOf('template'), filePath.lastIndexOf('.')); // output: templates/_header
                    }
                },
                files: {
                    '<%= env.DIR_SRC %>/assets/scripts/precompiledJst.js': '<%= env.DIR_TMP %>/templates/precompile/**/*.hbs'
                }
            }
        },

        // Injects version number.
        'string-replace': {
            precompileJst: {
                options: {
                    replacements: [{
                        pattern: /@@version/g,
                        replacement: pkg.version
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>/templates/precompile/',
                    dest: '<%= env.DIR_TMP %>/templates/precompile/',
                    src: ['**/*.hbs']
                }]
            }
        }
    });

    grunt.registerTask('precompileJst', [
        'string-replace:precompileJst',
        'handlebars:precompileJst',
        'copy:precompileJst'
    ]);
};
