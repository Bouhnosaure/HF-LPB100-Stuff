/*
 * External Dependencies
 */
var net = require('net');
var nssocket = require('nssocket');

/*
 * Internal Dependencies
 */
var commands = require('./commands');
var clean = require('./cleanup').Cleanup(function () {
    clearInterval(interval);
    commands.light_off(client);
});

/*
 * Globals
 */
var client = new nssocket.NsSocket();
var telnet = new nssocket.NsSocket();
var queue = [];
var interval = null;

/*
 * Config
 */
const config = {
    'bridge_ip_address': '192.168.137.67',
    'update_rate': 200
};

/*
 * Main instance
 */


client.connect(['ledclient'], 5577, config.bridge_ip_address, function () {
    telnet.connect(['telnetclient'], 3636, '127.0.0.1', function () {
        telnet.write(['telnetclient'], 'apikey:{7df99e4b-e418-4a6c-80cd-3cddc49e6c9a}' + "\n");
        init_transmit();
    });
});

var init_transmit = function () {

    commands.light_on(client);

    interval = setInterval(function () {
        telnet.write('getcolors' + "\n");
    }, config.update_rate);

};

telnet.on('data', function (data) {
    data = data.toString();
    if (data.indexOf("colors") === 0) {

        data = data.split('-');
        data = data[1].split(';');
        var rgb = data[0].split(',');

        commands.set_color(client, rgb[0], rgb[1], rgb[2], 1);
    }
});

