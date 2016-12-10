module.exports = function (RED) {
  const https = require('https');
  function WioLEDBar (config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.connection = RED.nodes.getCredentials(config.connection);

    // Configure the REST calls for each option in the dropdown
    // singleled: toggles a single led on/off
    // displaylevel: takes a float value and sets the diplay based on that
    // ledbrightness: takes an integer for the led and a float for the brightness
    if (node.connection) {
      this.on('input', function (msg) {
        var payloadint = (parseInt(msg.payload) ? parseInt(msg.payload) : 0);
        var payloadfloat = (parseFloat(msg.payload) ? parseFloat(msg.payload) : 0);
        var request = '';
        var rmethod = 'POST';
        if (config.mode === 'singleled') {
          request = 'toggle/' + ((payloadint === 0) ? parseInt(config.led) : payloadint);
        } else if (config.mode === 'displaylevel') {
          request = 'level/' + ((payloadfloat === 0) ? parseInt(config.level) : payloadfloat);
        } else if (config.mode === 'ledbrightness'){
          request = 'single_led/' + parseInt(config.led) + '/' + parseFloat(config.brightness);
        } else if (config.mode === 'orientation'){
          request = 'orientation/' + ((payloadint === 0) ? parseInt(config.orient) : payloadint);
        } else if (config.mode === 'bitconfig') {
          request = 'bits/' + ((payloadint === 0) ? parseInt(config.bitconfig) : payloadint);
        } else if (config.mode === 'bitstates'){
          request = 'bits';
          rmethod = 'GET';
        }

        node.status({ fill: 'blue', shape: 'dot', text: 'requesting' });
        var req = https.request({
          hostname: node.connection.server,
          port: 443,
          path: '/v1/node/' + config.port.replace(/:/g, '') + '/' +
          request + '?access_token=' + config.node,
          method: rmethod
        }, function (res) {
          msg.payload = '';
          res.on('data', function (chunk) {
            try { msg.payload = JSON.parse(chunk); }
            catch (e) { node.warn('api error'); }
            node.status({});
            node.send(msg);
          });
        });

        req.on('error', function (err) {
          msg.payload = err.toString();
          node.status({ fill: 'red', shape: 'ring', text: err.code });
          node.send(msg);
        });

        req.end();
      });
    } else {
      node.status({ fill: 'red', shape: 'ring', text: 'missing connection' });
    }
  }
  RED.nodes.registerType('wio-ledbar', WioLEDBar);
};
