const _ = require('lodash');

const finalizeCommand = function (command) {
    return command.concat(_.sum(command) & 0xff);
};

exports.light_on = function (client) {
    console.log('light on');
    client.write(Buffer.from(finalizeCommand([0x71, 0x23, 0x0f])));
};

exports.light_off = function (client) {
    console.log('light off');
    client.write(Buffer.from(finalizeCommand([0x71, 0x24, 0x0f])));
};

exports.set_color = function (client, red, green, blue, alpha, persist = true) {
    console.log('light set to : ' + red + ' ' + green + ' ' + blue + ' ' + alpha);
    client.write(Buffer.from(finalizeCommand([persist ? 0x31 : 0x41].concat(red, green, blue, alpha, 0x00, 0xf0, 0x0f))));
};