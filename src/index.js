const npm = require('./npm');
const NPMTwit = require('./npmTwit');
const semver = require('semver');
const fs = require('fs');
const defaults = require('lodash.defaults');
const AWS = require('aws-sdk');

function getCacheObject(options, s3) {
    if (s3) {
        const params = {
            Bucket: options.s3_bucket_name,
            Key: options.s3_file_key
        };

        return s3.getObject(params).promise()
        .then(response => JSON.parse(response.Body.toString('utf8')), err => {
            if (err.code === 'NoSuchKey') {
                return {};
            }
            throw err;
        });
    } else if (options.local_cache_file) {
        if (fs.existsSync(options.local_cache_file)) {
            return Promise.resolve(JSON.parse(fs.readFileSync(options.local_cache_file, 'utf8')));
        }
        return Promise.resolve({});
    }

    throw new Error('`local_cache_file` or `s3_*` options are required.');
}

function saveCacheObject(cacheObject, options, s3) {
    const cacheString = JSON.stringify(cacheObject);

    if (s3) {
        const params = {
            Bucket: options.s3_bucket_name,
            Key: options.s3_file_key,
            Body: cacheString,
            ContentType: 'application/json'
        };

        return s3.putObject(params).promise();
    }

    fs.writeFileSync(options.local_cache_file, cacheString, 'utf8');
    return Promise.resolve();
}

module.exports = opts => {
    const options = defaults(opts, {
        local_cache_file: '',
        s3_region: '',
        s3_access_key: '',
        s3_secret_access_key: '',
        s3_bucket_name: '',
        s3_file_key: '',
        twitter_consumer_key: '',
        twitter_consumer_secret: '',
        twitter_access_token: '',
        twitter_access_token_secret: '',
        tweet_hashtags: '',
        use_homepage_url: false
    });

    let s3;

    const isAWSEnabled = Object.keys(options).filter(o => o.startsWith('s3_')).every(k => !!options[k]);
    if (isAWSEnabled) {
        s3 = new AWS.S3({
            accessKeyId: options.s3_access_key,
            secretAccessKey: options.s3_secret_access_key,
            region: options.s3_region
        });
    }

    // get the cache
    return getCacheObject(options, s3)
    .then(cacheObject => {
        const npmTwit = new NPMTwit({
            consumer_key: options.twitter_consumer_key,
            consumer_secret: options.twitter_consumer_secret,
            access_token: options.twitter_access_token,
            access_token_secret: options.twitter_access_token_secret,
            tweet_hashtags: options.tweet_hashtags,
            use_homepage_url: options.use_homepage_url
        });

        return npm.getModules(options.npm_keyword)
        .then(npmModules => {
            console.log(`modules: ${npmModules.length}`);

            // retrieve only newer version of modules
            const updatedModules = npmModules.filter(mod =>
                !({}.hasOwnProperty.call(cacheObject, mod.name)) ||
                semver.gt(mod.version, cacheObject[mod.name])
            );

            console.log(`updated modules: ${updatedModules.length}`);

            if (updatedModules.length > 0) {
                // tweet
                npmTwit.tweetModules(updatedModules);

                // add the updated modules to the cache
                const newCacheObj = updatedModules.reduce((cache, mod) => {
                    cache[mod.name] = mod.version; // eslint-disable-line no-param-reassign
                    return cache;
                }, cacheObject);

                return saveCacheObject(newCacheObj, options, s3);
            }
            return Promise.resolve();
        });
    })
    .catch(err => console.error(err));
};
