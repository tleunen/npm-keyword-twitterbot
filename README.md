# npm-keyword-twitterbot
![npm][npm-version-image]

This library allows you to automatically tweet new NPM modules based on keywords.

## Usage

```js
require('npm-keyword-twitterbot')({
    // Specify a local file to keep the cache.
    local_cache_file: __dirname + '/cache_modules.json',

    // S3 settings to save the file on your S3 bucket
    s3_region: 'us-east-1',
    s3_access_key: '',
    s3_secret_access_key: '',
    s3_bucket_name: '',
    s3_file_key: 'npm-keyword-twitterbot/cache_modules.json',

    // Twitter key/secret for the app
    twitter_consumer_key: '',
    twitter_consumer_secret: '',

    // Twitter tokens for the user
    twitter_access_token: '',
    twitter_access_token_secret: '',

    npm_keyword: [
        'keyword1',
        'keyword2'
    ],

    // Enable this to use the homepage url set in package.json instead of the npm url
    use_homepage_url: true,

    tweet_hashtags: ''
});
```

## Example

The [ReactJSnpm](https://twitter.com/ReactJSnpm) twitter bot is an example of bot using this script.

Have a bot? Send a PR!

## How to use

* Create a Twitter app for your bot: https://apps.twitter.com/
* Create a specific Twitter user for your bot and retrieve its tokens.
* Create a bot like the one in the `usage` section.
* Add a cron job to start your bot. The cron job should run the script at least every 30 minutes.

## License

MIT, see [LICENSE.md](/LICENSE.md) for details.

[npm-version-image]: https://img.shields.io/npm/v/npm-keyword-twitterbot.svg
