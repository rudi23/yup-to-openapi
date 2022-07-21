import * as yup from 'yup';
import type { SchemaObject } from 'openapi3-ts';
import yupToOpenAPI from '@src/index';

describe('yup-to-openapi', () => {
    describe('yup lazy schema', () => {
        it('should handle "lazy" attribute', () => {
            const input = yup.lazy((value) => {
                switch (typeof value) {
                    case 'number':
                        return yup.number();
                    case 'string':
                        return yup.string();
                    default:
                        return yup.mixed();
                }
            });
            const output: SchemaObject = { type: 'object' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });
    });

    describe('yup mixed schema', () => {
        it('should handle "mixed" attribute', () => {
            const input = yup.mixed();
            const output: SchemaObject = { type: 'object' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "label" attribute', () => {
            const input = yup.string().label('label');
            const output: SchemaObject = { type: 'string', title: 'label' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle title in "meta" attribute', () => {
            const input = yup.string().meta({ title: 'title' });
            const output: SchemaObject = { type: 'string', title: 'title' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle description in "meta" attribute', () => {
            const input = yup.string().meta({ description: 'description' });
            const output: SchemaObject = { type: 'string', description: 'description' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "nullable" attribute', () => {
            const input = yup.string().nullable();
            const output: SchemaObject = { type: 'string', nullable: true };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        describe('should handle "default" attribute', () => {
            it('that is string', () => {
                const input = yup.string().default('default value');
                const output: SchemaObject = { type: 'string', default: 'default value' };

                expect(yupToOpenAPI(input)).toEqual(output);
            });

            it('that is number', () => {
                const input = yup.number().default(1.23);
                const output: SchemaObject = { type: 'number', format: 'float', default: 1.23 };

                expect(yupToOpenAPI(input)).toEqual(output);
            });

            it('that is integer', () => {
                const input = yup.number().integer().default(100);
                const output: SchemaObject = { type: 'integer', format: 'int32', default: 100 };

                expect(yupToOpenAPI(input)).toEqual(output);
            });

            it('that is boolean', () => {
                const input = yup.boolean().default(true);
                const output: SchemaObject = { type: 'boolean', default: true };

                expect(yupToOpenAPI(input)).toEqual(output);
            });

            it('that is function returning Date object', () => {
                const input = yup.date().default(function now() {
                    return new Date('2021-01-01T00:00:00.000Z');
                });
                const output: SchemaObject = {
                    type: 'string',
                    format: 'date',
                    default: '2021-01-01T00:00:00.000Z',
                };

                expect(yupToOpenAPI(input)).toEqual(output);
            });

            it('that is Date object', () => {
                const input = yup.date().default(new Date('2021-01-01T00:00:00.000Z'));
                const output: SchemaObject = {
                    type: 'string',
                    format: 'date',
                    default: '2021-01-01T00:00:00.000Z',
                };

                expect(yupToOpenAPI(input)).toEqual(output);
            });
        });

        it('should not handle "default" attribute for array', () => {
            const input = yup.array().default(['a', 'b', 'c']);
            const output: SchemaObject = { type: 'array' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should not handle "default" attribute for object', () => {
            const input = yup
                .object({
                    foo: yup.string(),
                    bar: yup.string(),
                })
                .default({ foo: 'foo', bar: 'bar' });
            const output: SchemaObject = {
                type: 'object',
                properties: {
                    foo: { type: 'string' },
                    bar: { type: 'string' },
                },
            };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        describe('should handle "oneOf" attribute', () => {
            it('that is array of strings', () => {
                const input = yup.string().oneOf(['a', 'b', 'c']);
                const output: SchemaObject = { type: 'string', enum: ['a', 'b', 'c'] };

                expect(yupToOpenAPI(input)).toEqual(output);
            });

            it('that is array of numbers', () => {
                const input = yup.number().oneOf([1, 2, 3]);
                const output: SchemaObject = { type: 'number', format: 'float', enum: [1, 2, 3] };

                expect(yupToOpenAPI(input)).toEqual(output);
            });
        });

        it('should handle "required" attribute', () => {
            const input = yup.object({
                foo: yup.string().required(),
                bar: yup.string(),
                baz: yup.number().required(),
            });
            const output: SchemaObject = {
                type: 'object',
                properties: {
                    foo: { type: 'string' },
                    bar: { type: 'string' },
                    baz: { type: 'number', format: 'float' },
                },
                required: ['foo', 'baz'],
            };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should not handle "required" attribute for string that is not part of object schema', () => {
            const input = yup.string().required();
            const output: SchemaObject = { type: 'string' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });
    });

    describe('yup string schema', () => {
        it('should convert schema to openapi schema', () => {
            const input = yup.string();
            const output: SchemaObject = { type: 'string' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "min" attribute', () => {
            const input = yup.string().min(1);
            const output: SchemaObject = { type: 'string', minLength: 1 };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "max" attribute', () => {
            const input = yup.string().max(10);
            const output: SchemaObject = { type: 'string', maxLength: 10 };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "matches" attribute', () => {
            const input = yup.string().matches(/(hi|bye)/);
            const output: SchemaObject = { type: 'string', pattern: '/(hi|bye)/' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "email" attribute', () => {
            const input = yup.string().email();
            const output: SchemaObject = { type: 'string', format: 'email' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "url" attribute', () => {
            const input = yup.string().url();
            const output: SchemaObject = { type: 'string', format: 'url' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "uuid" attribute', () => {
            const input = yup.string().uuid();
            const output: SchemaObject = { type: 'string', format: 'uuid' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });
    });

    describe('yup number schema', () => {
        it('should convert float schema to openapi schema', () => {
            const input = yup.number();
            const output: SchemaObject = { type: 'number', format: 'float' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should convert integer schema to openapi schema', () => {
            const input = yup.number().integer();
            const output: SchemaObject = { type: 'integer', format: 'int32' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "min" attribute', () => {
            const input = yup.number().min(1);
            const output: SchemaObject = { type: 'number', format: 'float', minimum: 1 };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "max" attribute', () => {
            const input = yup.number().max(10);
            const output: SchemaObject = { type: 'number', format: 'float', maximum: 10 };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "positive" attribute', () => {
            const input = yup.number().positive();
            const output: SchemaObject = { type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "negative" attribute', () => {
            const input = yup.number().negative();
            const output: SchemaObject = { type: 'number', format: 'float', maximum: 0, exclusiveMaximum: true };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "lessThan" attribute', () => {
            const input = yup.number().lessThan(10);
            const output: SchemaObject = { type: 'number', format: 'float', maximum: 10, exclusiveMaximum: true };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "moreThan" attribute', () => {
            const input = yup.number().moreThan(1);
            const output: SchemaObject = { type: 'number', format: 'float', minimum: 1, exclusiveMinimum: true };

            expect(yupToOpenAPI(input)).toEqual(output);
        });
    });

    describe('yup boolean schema', () => {
        it('should convert schema to openapi schema', () => {
            const input = yup.boolean();
            const output: SchemaObject = { type: 'boolean' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });
    });

    describe('yup date schema', () => {
        it('should convert schema to openapi schema', () => {
            const input = yup.date();
            const output: SchemaObject = {
                type: 'string',
                format: 'date',
            };

            expect(yupToOpenAPI(input)).toEqual(output);
        });
    });

    describe('yup array schema', () => {
        it('should convert schema to openapi schema', () => {
            const input = yup.array().of(yup.string());
            const output: SchemaObject = {
                type: 'array',
                items: {
                    type: 'string',
                },
            };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "min" attribute', () => {
            const input = yup.array().min(1);
            const output: SchemaObject = {
                type: 'array',
                minItems: 1,
            };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "max" attribute', () => {
            const input = yup.array().max(1);
            const output: SchemaObject = {
                type: 'array',
                maxItems: 1,
            };

            expect(yupToOpenAPI(input)).toEqual(output);
        });
    });

    describe('yup object schema', () => {
        it('should convert schema to openapi schema', () => {
            const input = yup.object({
                foo: yup.string(),
                bar: yup.string(),
            });
            const output: SchemaObject = {
                type: 'object',
                properties: {
                    foo: { type: 'string' },
                    bar: { type: 'string' },
                },
            };

            expect(yupToOpenAPI(input)).toEqual(output);
        });
    });
});
