# npm-keyword-twitterbot

[![NPM](https://nodei.co/npm/npm-keyword-twitterbot.png)](https://nodei.co/npm/npm-keyword-twitterbot/)

This library allows you to automatically tweet new NPM modules based on keywords.

## Usage

```
var NPMTwitterBot = require('npm-keyword-twitterbot');

new NPMTwitterBot({
    cache_filepath: __dirname + '/cache_modules.json',

    consumer_key: 'consumer_key',
    consumer_secret: 'consumer_secret',
    access_token: 'access_token',
    access_token_secret: 'access_token_secret',

    npm_keyword: [
        'keyword1',
        'keyword2'
    ],

    use_homepage_url: false, /* use homepage url set in package.json instead of npm url? */

    tweet_hashtags: "#MyhashTag"
});
```

## Example

The twitter bot [ReactJSnpm](https://twitter.com/ReactJSnpm), based on the keyword `react` and `react-component`, tweets new and updated ReactJS modules.

## How to use

* Create a Twitter app for your bot: https://apps.twitter.com/
* Create a bot like the one in the `usage` section.
* Add a cron job to start your bot. The cron job should run the script at least every 30 minutes.

## License

MIT, see [LICENSE.md](http://github.com/tleunen/npm-keyword-twitterbot/blob/master/LICENSE.md) for details.