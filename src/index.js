'use strict';

var npm = require('./npm');
var NPMTwit = require('./npmTwit');
var semver = require('semver');
var fs = require('fs');

function getCacheObject(filepath) {
    if(fs.existsSync(filepath)) {
        return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }
    return {};
}

module.exports = function(options) {
    var cacheFilePath = options.cache_filepath || __dirname + '/cache_modules.json';
    var cacheObject = getCacheObject(cacheFilePath);

    var npmTwit = new NPMTwit({
        consumer_key:         options.consumer_key,
        consumer_secret:      options.consumer_secret,
        access_token:         options.access_token,
        access_token_secret:  options.access_token_secret,
        tweet_hashtags:       options.tweet_hashtags
    });

    npm.getModules(options.npm_keyword, function (npmModules) {
        console.log('modules: ' + npmModules.length);

        // retrieve only newer version of modules
        var updatedModules = npmModules.filter(function(module) {

            return !cacheObject.hasOwnProperty(module.name) ||
                semver.gt(module.version, cacheObject[module.name]);
        });

        console.log('updated modules: ' + updatedModules.length);

        if(updatedModules.length > 0) {
            // tweet
            npmTwit.tweetModules(updatedModules);

            // add the updated modules to the cache
            cacheObject = updatedModules.reduce(function (cache, module) {
                cache[module.name] = module.version;
                return cache;
            }, cacheObject);

            // save cache
            fs.writeFileSync(cacheFilePath, JSON.stringify(cacheObject), 'utf8');
        }
    });
};