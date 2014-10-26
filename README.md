# npm-keyword-twitterbot

[![NPM](https://nodei.co/npm/npm-keyword-twitterbot.png)](https://nodei.co/npm/npm-keyword-twitterbot/)

This node script allows you to automatically tweet new NPM packages based on a keyword.

## Example

The twitter bot [ReactJSComp](https://twitter.com/ReactJSComp), based on the keyword `react-component`, tweets new and updated modules related to React Components.

## How to use

* Create a Twitter app for your bot: https://apps.twitter.com/
* Update `src/config.js` with your Twitter info and your npm info
* Add a crontab to start the script `node src/app.js`

## License

MIT, see [LICENSE.md](http://github.com/tleunen/npm-keyword-twitterbot/blob/master/LICENSE.md) for details.