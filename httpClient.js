var fetch = require("node-fetch");
var _ = require('lodash');
var parseLink = require('parse-link-header');
const flags = require('./parseArgs');

const GITHUB_TOKEN = flags.accesstoken || process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
    console.error('Can\'t find GITHUB_TOKEN. Please configure your environment variables. Auth token should have repo scope. Generate new token here https://github.com/settings/tokens/new');
    process.exit(1);
}

const fetchOptsions = {
    headers: {
        "Authorization": `token ${GITHUB_TOKEN}`
    }
};

const fetchAll = async (url) => {
    if (!url) return;

    const response = await fetch(url, fetchOptsions);
    var data = await response.json();

    var responsePaging = parseLink(response.headers.get('link'));
    var nextPage = _.find(responsePaging, p => p.rel === "next");
    if (nextPage) {
        var nextResult = await fetchAll(nextPage.url);
        return _.concat(data, nextResult);
    }
    return data;
}

module.exports = {
    fetchAll
};