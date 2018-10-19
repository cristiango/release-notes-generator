var fetch = require("node-fetch");
var _ = require('lodash');
var fs = require('fs');
var parseLink = require('parse-link-header');

var logger = fs.createWriteStream('output.md', {
    flags: 'w'
})
logger.write("# Changelog\r\n");

const { GITHUB_TOKEN } = process.env;
if (!GITHUB_TOKEN) {
    console.error('Can\'t find GITHUB_TOKEN. Please configure your environment variables. Auth token should have repo scope. Generate new token here https://github.com/settings/tokens/new');
    process.exit(1);
}

const fetchOptsions = {
    headers: {
        "Authorization": `token ${GITHUB_TOKEN}`
    }
};

const forMilestone = process.argv.slice(2)[0];

const getSpecificMilestone = async (name) => {
    const url = "https://api.github.com/repos/eVisionSoftware/PermitVision/milestones\?state=all"
    try {
        const allMilestones = await fetchAll(url);
        const filter = allMilestones.filter(m => m.title === name);
        return filter[0]
    }
    catch (error) {
        console.error(error);
    }
    return result;
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

const getIssuesForMilestone = async (milestoneNumber) => {
    const closedIssuesForMilestoneURL = `https://api.github.com/repos/eVisionSoftware/PermitVision/issues\?milestone=${milestoneNumber}\&state\=closed`

    const response = await fetchAll(closedIssuesForMilestoneURL);
    return response;
}

const writeToFile = (issues) => {
    issues.map(issue => {
        logger.write(`- ${issue.title} [${issue.number}](${issue.html_url})\r\n`);
    });
}

const allTheWork = async () => {
    const milestone = await getSpecificMilestone(forMilestone);
    if (!milestone) {
        console.error(`Milestone ${milestoneTitle} was not found`);
        process.exit(1);
    }
    const issues = await getIssuesForMilestone(milestone.number);
    const issuesFixed = issues
        .filter(i => i.pull_request &&
                     i.labels.map(l => l.name).indexOf('wontfix') === -1 &&
                     i.labels.map(l => l.name).indexOf('Maintenance') === -1
                     );

    logger.write(`## ${issues[0].milestone.title}\r\n`);

    const enhancements = issuesFixed.filter(i => i.labels.map(l => l.name).includes('feature'))
    if (enhancements.length) {
        logger.write(`### Enhancements \r\n`)
        writeToFile(enhancements);
    }

    const bugs = issuesFixed.filter(i => i.labels.map(l => l.name).includes('bug'))
    if (bugs.length) {
        logger.write(`### Bugs\r\n`);
        writeToFile(bugs);
    }

    logger.end();
}

allTheWork();
