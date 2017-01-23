var exec = require('child_process').exec;
var os = require('os');
var fs = require('fs');
var path = require('path');
var util = require('util');

// freeware nircmd http://www.nirsoft.net/utils/nircmd.html
var nircmdc = path.resolve(__dirname, 'bin/nircmdc.exe');

function captureCommand(path) {
    return '"' + nircmdc + '" savescreenshot ' + path + ' 490 0 960 250'
}

exports.capture = function (filePath, callback) {
    exec(captureCommand(filePath), function (err) {
        // nircmd always exits with err even though it works
        if (err && os.platform() !== 'win32') callback(err);

        fs.exists(filePath, function (exists) {
            // check exists for success/fail instead
            if (!exists) {
                return callback(new Error('Screenshot failed'))
            }
            callback(null, filePath)
        })
    })
};
