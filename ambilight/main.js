/*
 * Ambilight for windows !
 */


/*
 * External Dependencies
 */
var net = require('net');
var jimp = require('jimp');
var chroma = require('chroma-js');
var colorthief = require('color-thief-jimp');


/*
 * Internal Dependencies
 */
var commands = require('./commands');
var image = require('./image');
var clean = require('./cleanup').Cleanup(function () {
    clearInterval(interval);
    commands.light_off(client);
});

/*
 * Globals
 */
var client = new net.Socket();
var interval = null;

/*
 * Config
 */
const config = {
    'bridge_ip_adress': '192.168.137.205',
    'screenshot_path': './tmp/shot.jpg',
    'screenshot_rate': 250
};

/*
 * Main instance
 */
client.connect(5577, config.bridge_ip_adress, function () {

    commands.light_on(client);

    interval = setInterval(function () {

        image.capture(config.screenshot_path, function (err, imagePath) {
            jimp.read(imagePath, function (err, image) {
                var rgb = colorthief.getPalette(image, 2, 1);
                rgb = chroma.mix(rgb[0], rgb[1], 0.5, 'rgb').saturate(2).rgb();
                commands.set_color(client, rgb[0], rgb[1], rgb[2], 1);
            });
        });

    }, config.screenshot_rate);

});

