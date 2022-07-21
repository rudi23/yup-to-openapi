module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-max-line-length': [2, 'always', Infinity],
        'footer-max-line-length': [2, 'always', Infinity],
        'type-enum': [
            2,
            'always',
            ['build', 'chore', 'ci', 'config', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'test'],
        ],
    },
};
