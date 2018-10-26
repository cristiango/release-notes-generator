var args = require('args');

args
    .option('milestone', "Milestone title for witch CHANGELOG will be generated", 'v8.5.2', toString)
    .option('username', 'GitHub username used for finding repository', 'eVisionSoftware')
    .option('repo', 'Repository name. Togeder with username will compose URL where to extract information from', 'PermitVision')
    .option('accesstoken', "Optional access token used to call github api. If thi is not provided then we look into environment variables GITHUB_TOKEN", process.env.GITHUB_TOKEN)
    .example('node generate -m v8.5.1', "Geneates CHANGELOG.md for milestone v8.5.1")
    .example('node listmilestones -u facebook -r react list', 'Lists all milestones in https://github.com/facebook/react');

module.exports = args.parse(process.argv);