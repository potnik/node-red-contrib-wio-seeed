module.exports = function (RED) {
  const https = require('https');

  function WioWs2812(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.connection = RED.nodes.getCredentials(config.connection);

    if (node.connection) {
      this.on('input', function (msg) {
        var hexColors = [];
        var count = Math.min(((config.mode == 'auto') ? msg.payload : config.count), config.count);
        var colors = config.colors.split(',');

        var payloadint = (parseInt(msg.payload) ? parseInt(msg.payload) : 0);
        var request = '';
        var rmethod = 'POST';

        for (var i = 0; i < count; i++)
          if (colors[i]) hexColors.push(colors[i]);

        for (i = (hexColors.length - 1) ; i < config.count; i++)
          hexColors.push('000000');

        if (config.mode === 'clear') {
          request = 'clear/' + config.count + '/' + colors[1] + '/';
          // ((payloadint === 0) ? parseInt(config.led) : payloadint);
        } else if (config.mode === 'segment') {
          request = 'segment/' + config.pos + '/' + hexColors.join('') + '/ ';
        } else if (config.mode === 'rainbowon'){
          request = 'start_rainbow_flow/' + parseInt(config.count ) + '/' + parseInt(config.brightness) + '/' + parseInt(config.speed) +'/';
        } else if (config.mode === 'rainbowoff'){
          request = 'stop_rainbow_flow/';
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
  RED.nodes.registerType('wio-ws2812', WioWs2812);
};
