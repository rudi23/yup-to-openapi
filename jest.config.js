module.exports = {
    globals: {
        'ts-jest': {
            diagnostics: false,
            tsconfig: 'tsconfig.json',
        },
    },
    moduleFileExtensions: ['js', 'ts', 'd.ts'],
    moduleNameMapper: {
        '@src/(.*)': '<rootDir>/src/$1',
    },
    preset: 'ts-jest',
    rootDir: '.',
    roots: ['<rootDir>/test'],
    verbose: true,
};
