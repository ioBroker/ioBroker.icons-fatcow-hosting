// To use this file in WebStorm, right click on the file name in the Project Panel (normally left) and select "Open Grunt Console"

/** @namespace __dirname */
/* jshint -W097 */// jshint strict:false
/*jslint node: true */
"use strict";

module.exports = function (grunt) {
    // Project configuration.
    var pkg       = grunt.file.readJSON('package.json');
    var iopackage = grunt.file.readJSON('io-package.json');
    var version   = (pkg && pkg.version) ? pkg.version : iopackage.common.version;

    grunt.initConfig({

    });

    grunt.registerTask('updateList', function () {
        var fs = require('fs');
        var dir = fs.readdirSync(__dirname + '/www');
        var readme = '';
        var html = '<html><body style="background: grey"><table>';
        var htmlLineImg = '<tr>';
        var htmlLineName = '<tr>';
        var inLine = 6;
        var currentWord = "";
        var cur = 0;
        for (var i = 0; i < dir.length; i++) {
            cur++;
            var parts = dir[i].split('_');
            if ((currentWord && currentWord != parts[0]) || (!(cur % inLine))) {
                html += htmlLineImg + '</tr>';
                html += htmlLineName + '</tr>';
                htmlLineImg  = '<tr>';
                htmlLineName = '<tr>';
                if (currentWord && currentWord != parts[0]) {
                    html += '<tr style="height: 15px; background: lightblue"><td colspan="' + inLine + '" style="height: 15px"></td></tr>';
                    readme += '===========================\n';
                }

                currentWord = parts[0];
                cur = 0;
            }
            if (!currentWord) currentWord = parts[0]
            //readme += '![' + dir[i] + '](www/' + dir[i] + ')\n';
            readme += '![' + dir[i] + '](' + dir[i] + ')\n';

            htmlLineImg  += '<td style="text-align: center"><img src="' + dir[i] + '" width="64" height="64"></td>\n';
            htmlLineName += '<td style="text-align: center">' + dir[i] + '</td>\n';
        }
        html += htmlLineImg + '</tr>';
        html += htmlLineName + '</tr>';
        html += '</table></body></html>';
        grunt.file.write('ICONLIST.md', readme);
        grunt.file.write('www/index.html', html);
    });

    grunt.registerTask('updateReadme', function () {
        var readme = grunt.file.read('README.md');
        var pos = readme.indexOf('## Changelog\n');
        if (pos != -1) {
            var readmeStart = readme.substring(0, pos + '## Changelog\n'.length);
            var readmeEnd   = readme.substring(pos + '## Changelog\n'.length);

            if (iopackage.common && readme.indexOf(iopackage.common.version) == -1) {
                var timestamp = new Date();
                var date = timestamp.getFullYear() + '-' +
                    ('0' + (timestamp.getMonth() + 1).toString(10)).slice(-2) + '-' +
                    ('0' + (timestamp.getDate()).toString(10)).slice(-2);

                var news = "";
                if (iopackage.common.whatsNew) {
                    for (var i = 0; i < iopackage.common.whatsNew.length; i++) {
                        if (typeof iopackage.common.whatsNew[i] == 'string') {
                            news += '* ' + iopackage.common.whatsNew[i] + '\n';
                        } else {
                            news += '* ' + iopackage.common.whatsNew[i].en + '\n';
                        }
                    }
                }

                grunt.file.write('README.md', readmeStart + '### ' + iopackage.common.version + ' (' + date + ')\n' + (news ? news + '\n\n' : '\n') + readmeEnd);
            }
        }
    });

    grunt.registerTask('default', [
        'updateList',
        'updateReadme'
    ]);
};