'use strict';

module.exports = BatchClient;

function BatchClient(channel, hosts) {
    this.channel = channel;
    this.hosts = hosts;

    this.key = new Buffer(42);
}

function Buffer(str) {
    this.str = str;
}
