const npm = require('./npm');
const NPMTwit = require('./npmTwit');
const semver = require('semver');
const fs = require('fs');
const defaults = require('lodash.defaults');

function getCacheObject(filepath) {
    if (fs.existsSync(filepath)) {
        return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }
    return {};
}

module.exports = opts => {
    const options = defaults(opts, {
        twitter_consumer_key: '',
        twitter_consumer_secret: '',
        twitter_access_token: '',
        twitter_access_token_secret: '',
        tweet_hashtags: '',
        use_homepage_url: false
    });

    const cacheFilePath = options.cache_filepath || `${__dirname}/cache_modules.json`;
    const cacheObject = getCacheObject(cacheFilePath);

    const npmTwit = new NPMTwit({
        consumer_key: options.twitter_consumer_key,
        consumer_secret: options.twitter_consumer_secret,
        access_token: options.twitter_access_token,
        access_token_secret: options.twitter_access_token_secret,
        tweet_hashtags: options.tweet_hashtags,
        use_homepage_url: options.use_homepage_url
    });

    npm.getModules(options.npm_keyword)
    .then(npmModules => {
        console.log(`modules: ${npmModules.length}`);

        // retrieve only newer version of modules
        const updatedModules = npmModules.filter(mod =>
            !({}.hasOwnProperty.call(cacheObject, mod.name)) ||
            semver.gt(mod.version, cacheObject[mod.name])
        );

        console.log(`updated modules: ${updatedModules.length}`);

        if (true || updatedModules.length > 0) {
            // tweet
            npmTwit.tweetModules(updatedModules);

            // add the updated modules to the cache
            const newCacheObj = updatedModules.reduce((cache, mod) => {
                cache[mod.name] = mod.version; // eslint-disable-line no-param-reassign
                return cache;
            }, cacheObject);

            // save cache
            fs.writeFileSync(cacheFilePath, JSON.stringify(newCacheObj), 'utf8');
        }
    })
    .catch(err => console.error(err));
};
