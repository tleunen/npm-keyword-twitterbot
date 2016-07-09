const got = require('got');

module.exports = {
    getModules: kw => {
        const keywords = Array.isArray(kw) ? kw : [kw];
        const url = `https://registry.npmjs.org/-/all/since?stale=update_after&startkey=${Date.now() - 1800000}`;

        return got(url, { json: true })
        .then(({ body }) =>
            body.filter(mod => {
                const modKeywords = mod.keywords || [];
                const kwIntersect = keywords.filter(k => modKeywords.includes(k));
                return kwIntersect.length > 0;
            }).map(mod => ({
                name: mod.name,
                description: mod.description,
                version: mod['dist-tags'].latest,
                homepage: mod.homepage,
                npmUrl: `https://www.npmjs.org/package/${mod.name}`
            }))
        );
    }
};
