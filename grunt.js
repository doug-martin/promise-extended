/*global module:false*/
module.exports = function (grunt) {
    var fs = require('fs');

    // grunt doesn't natively support reading config from .jshintrc yet
    var jshintOptions = JSON.parse(fs.readFileSync('./.jshintrc'));

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
                ' Licensed <%= pkg.license %> */'
        },

        jshint: {
            options: jshintOptions,
            globals: jshintOptions.predef
        },

        lint: {
            files: [
                'array.js'
            ]
        },

        it: {
            all: {
                src: 'test/**/*.test.js',
                options: {
                    timeout: 3000, // not fully supported yet
                    reporter: 'dotmatrix'
                }
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', 'index.js'],
                dest: '<%= pkg.name %>.min.js'
            }
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint it'
        },
        uglify: {}
    });

    grunt.registerTask("promises-aplus", "run promises a plus test", function () {
        var done = this.async();
        var child = require("child_process").spawn("promises-aplus-tests", ["test/aplus-adapter"]);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        child.on("close", function (code) {
            if (code !== 0) {
                done(false);
            } else {
                done();
            }
        });
    });

    // Default task.
    grunt.registerTask('default', 'lint it promises-aplus min');
    grunt.loadNpmTasks('grunt-it');

};
