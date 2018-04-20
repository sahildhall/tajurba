var config = require('./config.json');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
if (fs.existsSync(path.join(__dirname, 'local.config.js'))) {
    var localConfig = require('./local.config.js');
    config = _.merge(config, localConfig);
}
module.exports = config;
