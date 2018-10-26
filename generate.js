var _ = require('lodash');
var fs = require('fs');
const { fetchAll } = require('./httpClient');

const flags = require('./parseArgs');

if (!flags.milestone) {
    console.log("milestone is not provided");
    args.showHelp();
    process.exit(1);
}

console.log(`Generating CHANGELOG.md for milestone ${flags.milestone}`);

var logger = fs.createWriteStream('output.md', {
    flags: 'w'
})
logger.write("# Changelog\r\n");

const forMilestone = flags.milestone;

const getSpecificMilestone = async (name) => {
    const url = `https://api.github.com/repos/${flags.username}/${flags.repo}/milestones\?state=all`
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



const getIssuesForMilestone = async (milestoneNumber) => {
    const closedIssuesForMilestoneURL = `https://api.github.com/repos/${flags.username}/${flags.repo}/issues\?milestone=${milestoneNumber}\&state\=closed`

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
        console.error(`Milestone ${forMilestone} was not found in https://github.com/${flags.username}/${flags.repo}/milestones`);
        process.exit(1);
    }

    const labelsToExclude = ['wontfix', 'Maintenance'];

    const issues = await getIssuesForMilestone(milestone.number);
    const issuesFixed = issues
        .filter(i => _.intersection(i.labels.map(l => l.name), labelsToExclude).length == 0)
        .filter(i => !i.pull_request);

    logger.write(`## ${issues[0].milestone.title}\r\n`);

    const bugs = issuesFixed.filter(i =>
        _.intersection(i.labels.map(l => l.name), ['bug']).length > 0);
    const enhancements = _.xorBy(issuesFixed, bugs, x => x.id);

    if (enhancements.length) {
        logger.write(`### Enhancements \r\n`)
        writeToFile(enhancements);
    }

    if (bugs.length) {
        logger.write(`### Bugs\r\n`);
        writeToFile(bugs);
    }

    logger.end();
}

allTheWork();
