'use strict';

var request = require('request')
  , JSONStream = require('JSONStream')
  , eventStream = require('event-stream')
  , querystring = require('querystring')
  ;

var registryUrl = 'https://registry.npmjs.org/';

function buildKeywordUrl(keyword) {
    return registryUrl + '-/_view/byKeyword?'+ querystring.stringify({
        startkey: '["' + keyword + '"]',
        endkey: '["' + keyword + '",{}]',
        group_level: 3
    });
}

function addModuleVersion(module, callback) {
    request({ url: registryUrl + module.name, json: true}, function (err, resp, body) {
        module.latestVersion = body['dist-tags']['latest'];
        callback(err, module);
    });
}

module.exports = {
    getModules: function(keyword, callback) {
        request({ url: buildKeywordUrl(keyword) })
            .on('error', function(err) { console.error('Error getModuleList: ', err); })
            .pipe(JSONStream.parse('rows.*.key'))
            .pipe(eventStream.mapSync(function(module) {
                return {
                    name: module[1],
                    description: module[2]
                }
            }))
            .pipe(eventStream.map(addModuleVersion))
            .on('error', function(err) { console.error('Error getModuleInfo: ', err); })
            .pipe(eventStream.writeArray(function (err, modules) {
                if(err) throw 'Error moduleList write: ', err;

                callback(modules);
            }));
    },

    getPackageUrl: function(packageName) {
        return 'https://www.npmjs.org/package/' + packageName;
    }
};