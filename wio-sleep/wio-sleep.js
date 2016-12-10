module.exports = function (RED) {
  const https = require('https');
  function WioSleep (config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.connection = RED.nodes.getCredentials(config.connection);

    if (node.connection) {
      this.on('input', function (msg) {
        var payloadint = (parseInt(msg.payload) ? parseInt(msg.payload) : 0);
        var request = 'pm/sleep/' + ((payloadint === 0) ? parseInt(config.sleep) : payloadint);
        node.status({fill: 'blue', shape: 'dot', text: 'requesting'});
        var req = https.request({
          hostname: node.connection.server,
          port: 443,
          path: '/v1/node/' + request + '?access_token=' + config.node,
          method: 'POST'
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
          node.status({fill: 'red', shape: 'ring', text: err.code});
          node.send(msg);
        });

        req.end();
      });
    } else {
      node.status({fill: 'red', shape: 'ring', text: 'missing connection'});
    }
  }
  RED.nodes.registerType('wio-sleep', WioSleep);
};
