module.exports = {
    hooks: {
        'before:bump': ['npm test'],
        'after:bump': ['npm run build'],
    },
    git: {
        requireCleanWorkingDir: true,
        requireBranch: 'master',
        commitMessage: 'chore: release ${version} \n\n${changelog}',
        tagName: 'v${version}',
    },
    github: {
        release: true,
    },
    npm: {
        publish: false,
    },
    plugins: {
        '@release-it/conventional-changelog': {
            preset: {
                name: 'conventionalcommits',
                types: [
                    { type: 'feat', section: 'Features' },
                    { type: 'feature', section: 'Features' },
                    { type: 'fix', section: 'Bug Fixes' },
                    { type: 'perf', section: 'Performance Improvements' },
                    { type: 'revert', section: 'Reverts' },
                    { type: 'docs', section: 'Documentation' },
                    { type: 'chore', section: 'Miscellaneous Chores' },
                    { type: 'refactor', section: 'Code Refactoring' },
                    { type: 'test', section: 'Tests' },
                    { type: 'build', section: 'Build System' },
                    { type: 'ci', section: 'Continuous Integration' },
                    { type: 'config', section: 'Configuration changes' },
                ],
            },
            infile: 'CHANGELOG.md',
        },
    },
};
