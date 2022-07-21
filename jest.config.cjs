module.exports = {
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
        'ts-jest': {
            diagnostics: false,
            tsconfig: 'tsconfig.cjs.json',
            isolatedModules: true,
            useESM: true,
        },
    },
    moduleFileExtensions: ['js', 'ts', 'd.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    preset: 'ts-jest',
    rootDir: '.',
    roots: ['<rootDir>/test'],
    transform: { '^.+\\.ts$': 'ts-jest' },
    verbose: true,
};
