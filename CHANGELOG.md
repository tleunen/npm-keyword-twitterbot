# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.0.1"></a>
## [3.0.1](https://github.com/tleunen/npm-keyword-twitterbot/compare/v3.0.0...v3.0.1) (2016-07-09)


### Bug Fixes

* Remove logs and return results in promise ([57b076b](https://github.com/tleunen/npm-keyword-twitterbot/commit/57b076b))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/tleunen/npm-keyword-twitterbot/compare/v2.1.0...v3.0.0) (2016-07-09)


### Bug Fixes

* Fix compatibility with Node 4 ([ce5df24](https://github.com/tleunen/npm-keyword-twitterbot/commit/ce5df24))


### Code Refactoring

* **bot:** Rewrite the entire script in ES2015 ([bc565e5](https://github.com/tleunen/npm-keyword-twitterbot/commit/bc565e5))


### Features

* **s3:** Add support for Amazon S3 ([1bd8681](https://github.com/tleunen/npm-keyword-twitterbot/commit/1bd8681))


### BREAKING CHANGES

* s3: The option `cache_filepath` has been renamed in
`local_cache_file`
* bot: Requires Node >= 4
