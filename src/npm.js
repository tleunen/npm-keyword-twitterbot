'use strict';

var request = require('request');

module.exports = {
    getModules: function(keywords, callback) {
        if(!Array.isArray(keywords)) {
            keywords = [keywords];
        }

        var requestUrl = 'https://registry.npmjs.org/-/all/since?stale=update_after&startkey=' + ( Date.now() - 1800000);
        request({url: requestUrl, json: true}, function(err, resp, body) {

            var modules = Object.keys(body)
            // remove _updated key & unwanted modules based on keywords
            .filter(function(key) {
                var moduleKeywords = body[key]['keywords'] || [];

                var keywordsIntersect = keywords.filter(function(k) {
                    return moduleKeywords.indexOf(k) != -1;
                });

                return key != '_updated' && keywordsIntersect.length > 0;
            })
            // get module content
            .map(function(key) {
                return {
                    name: body[key]['name'],
                    description: body[key]['description'],
                    version: body[key]['dist-tags']['latest'],
                    homepage: body[key]['homepage'],
                    npmUrl: 'https://www.npmjs.org/package/' + body[key]['name']
                };
            });

            callback(modules);
        });
    }
};