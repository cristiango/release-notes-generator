const flags = require('./parseArgs');
const { fetchAll } = require("./httpClient");

if (!flags.username) {
    console.log("username is required");
    process.exit(1);
}
if (!flags.repo) {
    console.log('repo is required');
    process.exit(1);
}

const printAllMilestones = async () => {
    console.log(`All milestones from https://github.com/${flags.username}/${flags.repo}/`)
    const url = `https://api.github.com/repos/${flags.username}/${flags.repo}/milestones\?state=all`
    try {
        const allMilestones = await fetchAll(url);
        allMilestones.map(m => console.log(m.title));
    }
    catch (error) {
        console.error(error);
    }
};

printAllMilestones();

