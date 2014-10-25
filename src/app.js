'use strict';

var Config = require('./config')
  , npm = require('./npm')
  , Twit = require('twit')
  , semver = require('semver')
  , fs = require('fs')
  ;

var T = new Twit({
    consumer_key:         Config.TWITTER_CONSUMER_KEY
  , consumer_secret:      Config.TWITTER_CONSUMER_SECRET
  , access_token:         Config.TWITTER_ACCESS_TOKEN
  , access_token_secret:  Config.TWITTER_ACCESS_TOKEN_SECRET
});

var cacheModules = JSON.parse(fs.readFileSync(Config.CACHE_FILE, 'utf8'));

// retrieve the modules
npm.getModules(Config.NPM_KEYWORD, function (npmModules) {
    console.log('modules: ' + npmModules.length);

    // get list of new/updated modules
    var updatedModules = [];
    npmModules.forEach(function (module) {
        if(!cacheModules.hasOwnProperty(module.name) ||
            semver.gt(module.latestVersion, cacheModules[module.name].latestVersion)
        ) {
            updatedModules.push(module);
        }
    });
    console.log('updated modules: ' + updatedModules.length);

    updatedModules.forEach(function (module) {
        // send tweet
        T.post('statuses/update', { status: getTweetMessage(module) }, function (err, data, response) {
            if(err) throw 'Error Twit: ', err;
        });
    });


    // save latest npm modules in the cache
    var npmModulesObj = npmModules.reduce(function(obj, module) {
        obj[module.name] = {
            description: module.description,
            latestVersion: module.latestVersion
        };
        return obj;
    }, {});
    fs.writeFileSync(Config.CACHE_FILE, JSON.stringify(npmModulesObj), 'utf8');
});


function getTweetMessage(module) {
    var msg = module.name + ' (' + module.latestVersion + ') ';
    var hashTags = ' ' + Config.TWEET_HASHTAG;

    var ln = 140 - msg.length - hashTags.length;
    var desc = module.description;
    if(desc.length > ln) {
        desc = desc.substring(0, ln-3) + '...';
    }

    return msg + desc + hashTags;
}