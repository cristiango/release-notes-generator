# Github Release Notes Generator
### *What’s the point of a changelog?*

To make it easier for users and contributors to see precisely what notable changes have been made between milestones of the project.

## Installation

    git clone
    npm install

### GitHub token
GitHub only allows 50 unauthenticated requests per hour.

Therefore, it's recommended to run this script with authentication by using a **token**.

Here's how:

- [Generate a token here](https://github.com/settings/tokens/new?description=GitHub%20Changelog%20Generator%20token) - you only need "repo" scope for private repositories
- Set the `CHANGELOG_GITHUB_TOKEN` environment variable to your 40 digit token

You can set an environment variable by running the following command at the prompt, or by adding it to your shell profile (e.g., `~/.bash_profile` or `~/.zshrc`):

    export GITHUB_TOKEN="«your-40-digit-github-token»"

So, if you get a message like this:

``` markdown
API rate limit exceeded for github_username.
See: https://developer.github.com/v3/#rate-limiting
```

It's time to create this token! (Or, wait an hour for GitHub to reset your unauthenticated request limit.)


## Running
See the full help

    npm start

### Alternatives

Here is a [wikipage list of alternatives](https://github.com/skywinder/Github-Changelog-Generator/wiki/Alternatives) that I found. But none satisfied my requirements.

*If you know other projects, feel free to edit this Wiki page!*
