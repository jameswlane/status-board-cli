import * as extend from 'extend';
import * as fs from 'fs';
import * as path from 'path';

const debug = require('debug')('config-manager');

export default function (configFileName: any) {

  function readConfigIfExists(fileName) {
    if (!path.extname(fileName)) {
      fileName = fileName + '.js';
    }
    if (fs.existsSync(fileName)) {
      return require(fileName);
    }
    return {};
  }

  function readEnv() {
    const key = 'ATLASBOARD_CONFIG_' + configFileName;
    debug('ENV key', key);
    if (process.env[key]) {
      debug('ENV configuration found for', key);
      try {
        const configValue = JSON.parse(process.env[key]);
        if (typeof configValue === 'object') {
          return JSON.parse(process.env[key]);
        } else {
          throw new Error('ENV configuration key ' + key + ' could not be serialized into an object: ' + process.env[key]);
        }
      } catch (e) {
        throw new Error('ENV configuration key ' + key + ' contains invalid JSON: ' + process.env[key]);
      }
    }
  }

  const localConfigFilePath = path.join(process.cwd(), 'config', configFileName);
  const atlasboardConfigFilePath = path.join(__dirname, '../config/', configFileName);

  return extend(
    readConfigIfExists(atlasboardConfigFilePath),
    readConfigIfExists(localConfigFilePath),
    readEnv(),
  );
}
