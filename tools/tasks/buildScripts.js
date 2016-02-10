/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    var shouldMinify = !grunt.option('dev');

    // Help Grunt find the right plugins at runtime
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    // Clear out any previously generated usemin task configuration
    grunt.config.set('concat', undefined);
    grunt.config.set('uglify', undefined);

    grunt.config.merge({
        // Copies static files for non-optimized builds
        copy: {
            buildScripts: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>',
                    dest: '<%= env.DIR_DEST %>',
                    src: ['assets/{scripts,vendor}/**/*.{map,js}']
                }]
            }
        },

        browserify: {
            buildScripts: {
                options: {
                    preBundleCB: function(bundle) {
                        bundle.plugin('tsify', {
                            tsconfig: true
                        });
                    },
                    browserifyOptions: {
                        debug: shouldMinify ? false : true
                    }
                },
                files: {
                    '<%= env.DIR_SRC %>/assets/scripts/main.js': ['<%= env.DIR_SRC %>/assets/scripts/main.ts'],
                    '<%= env.DIR_SRC %>/assets/scripts/styleguide.js': ['<%= env.DIR_SRC %>/assets/scripts/StyleGuide.ts'],
                    '<%= env.DIR_SRC %>/assets/scripts/static.js': ['<%= env.DIR_SRC %>/assets/scripts/Static.ts']
                }
            }
        },

        clean: {
            buildScripts: [
                '<%= env.DIR_SRC %>/assets/scripts/main.js',
                '<%= env.DIR_SRC %>/assets/scripts/precompiledJst.js',
                '<%= env.DIR_SRC %>/assets/scripts/styleguide.js',
                '<%= env.DIR_SRC %>/assets/scripts/static.js'
            ]
        },

        concat: {
            options: {
                separator: ';',
            }
        },

        uglify: {
            options: {
                warnings: false,
                mangle: false
            }
        },

        // Searches for build comment blocks (`<!-- build:js -->`) and generates
        // the appropriate `concat` and `uglify` configuration.
        useminPrepare: {
            options: {
                root: '<%= env.DIR_SRC %>',
                staging: '<%= env.DIR_TMP %>',
                dest: '<%= env.DIR_DEST %>',
                flow: {
                    buildScripts: {
                        // Force js only
                        steps: { js: ['concat', 'uglifyjs'], css: [] },
                        post: {}
                    }
                }
            },
            buildScripts: ['<%= env.DIR_SRC %>/**/*.hbs']
        }
    });

    grunt.registerTask('scrub:buildScripts', function() {
        function scrub(name) {
            var config = JSON
                .stringify(grunt.config.get(name))
                .replace(/\?v=@@version/g, '');

            grunt.config.set(name, JSON.parse(config));
        }

        scrub('concat');
        scrub('uglify');
    });

    grunt.registerTask('buildScripts',
        shouldMinify
            ? [
                'browserify:buildScripts',
                'useminPrepare:buildScripts',
                'scrub:buildScripts',
                'concat:generated',
                'uglify:generated',
                'clean:buildScripts'
            ]
            : [
                'browserify:buildScripts',
                'copy:buildScripts',
                'clean:buildScripts'
            ]
    );
};
