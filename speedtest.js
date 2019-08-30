'use strict';

var SpeedTest = require('fast-speedtest-api');

module.exports = exports = function(RED) {
    function SpeedTest(config) {
        RED.nodes.createNode(this, config);

        this.on('input', msg => {
            if (!config.token) {
                this.status({ fill: 'red', shape: 'dot', text: 'You must define app token' });
                return;
            }
            this.status({ fill: 'yellow', shape: 'dot', text: 'Requesting' });
            var test = new SpeedTest({ token: config.token, unit: SpeedTest.UNITS.Mbps });
            
            test.getSpeed().then(s => {
                this.status({});
                this.send({ payload: s });
            }).catch(e => {
                this.status({ fill: 'red', shape: 'dot', text: e.message });
            });
        });
    }

    RED.nodes.registerType('fast-speedtest', SpeedTest);
};
