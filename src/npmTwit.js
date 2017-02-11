const Twit = require('twit');

class NPMTwit {
  constructor(opts) {
    this.twit = new Twit({
      consumer_key: opts.consumer_key,
      consumer_secret: opts.consumer_secret,
      access_token: opts.access_token,
      access_token_secret: opts.access_token_secret,
    });

    this.tweetHashTags = opts.tweet_hashtags;
    this.tweetUrlLength = -1;
    this.useHomepageUrl = opts.use_homepage_url;
  }

  getTweetMessage(mod) {
    const content = [
      mod.name,
      `(${mod.version})`,
      '', // link
      '', // description
      this.tweetHashTags,
    ];

    const initialLn = 140 - this.tweetUrlLength - (content.length - 1);
    const lnAvailable = content.reduce((prev, curr) => prev - curr.length, initialLn);

    // put back the description and url
    content[2] = (this.useHomepageUrl ? mod.homepage : mod.npmUrl) || mod.npmUrl;
    if (mod.description) {
      content[3] = (mod.description.length > lnAvailable)
        ? `${mod.description.substring(0, lnAvailable - 1)}…`
        : mod.description;
    }

    return content.join(' ');
  }

  tweetModules(modules) {
    // get the t.co length before starting the process
    this.twit.get('help/configuration')
    .then(({ data }) => {
      this.tweetUrlLength = data.short_url_length_https;

      modules.forEach(mod => { // eslint-disable-line
        // send tweet
        this.twit.post(
            'statuses/update',
            { status: this.getTweetMessage(mod) },
        );
      });
    });
  }
}

module.exports = NPMTwit;
