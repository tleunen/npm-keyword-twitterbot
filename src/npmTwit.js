'use strict';

var Twit = require('twit');

function NPMTwit(opts) {
    this.twit = new Twit({
        consumer_key:         opts.consumer_key,
        consumer_secret:      opts.consumer_secret,
        access_token:         opts.access_token,
        access_token_secret:  opts.access_token_secret
    });

    this.tweetHashTags = opts.tweet_hashtags;
    this.tweetUrlLength = -1;
    this.useHomepageUrl = opts.use_homepage_url;
}

NPMTwit.prototype.tweetModules = function(modules) {
    // get the t.co length before starting the process
    this.twit.get('help/configuration',  function (err, data, response) {
        if(err) throw err;

        this.tweetUrlLength = data['short_url_length_https'];

        modules.forEach(function (module) {
            // send tweet
            this.twit.post('statuses/update', { status: this._getTweetMessage(module) }, function (err, data, response) {
               if(err) throw 'Error Twit: ', err;
            });
        }, this);
    }.bind(this));
};

NPMTwit.prototype._getTweetMessage = function(module) {
    var content = [
        module.name,
        '(' + module.version + ')',
        '',
        '',
        this.tweetHashTags
    ];

    var lnAvailable = content.reduce(function(prev, curr) {
        return prev - curr.length;
    }, 140 - this.tweetUrlLength - (content.length - 1) );

    // put back the description and url
    content[2] = (this.useHomepageUrl ? module.homepage : module.npmUrl) || module.npmUrl;
    content[3] = (module.description.length > lnAvailable)
        ? module.description.substring(0, lnAvailable-3) + '...'
        : module.description;

    return content.join(' ');
};

module.exports = NPMTwit;