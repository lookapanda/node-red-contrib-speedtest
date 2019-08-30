'use strict';

var speedTest = require('speedtest-net');

module.exports = exports = function(RED) {
    function SpeedTest(config) {
        var timeout = config.maxTime || 5 * 1000;
        RED.nodes.createNode(this, config);

        this.on('input', msg => {
            this.status({ fill: 'yellow', shape: 'dot', text: 'Requesting' });
            var test = speedTest({ maxTime: config.maxTime, serverId: config.serverId });

            test.on('data', data => {
                var reponse = Object.assign({}, data, { config: config });
                this.status({});
                this.send({ payload: reponse });
            });

            test.on('error', err => {
                this.status({ fill: 'red', shape: 'dot', text: err.message });
                this.error(err, msg);
            });

            test.on('downloadspeedprogress', speed => {
                this.send({ topic: 'downloadprogress', payload: speed });
            });

            test.on('uploadspeedprogress', speed => {
                this.send({ topic: 'uploadprogress', payload: speed });
            });
        });
    }

    RED.nodes.registerType('speedtest-with-progress', SpeedTest);
};
