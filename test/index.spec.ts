import * as yup from 'yup';
import type { SchemaObject } from 'openapi3-ts';
import yupToOpenAPI from '@src/index';

describe('yup-to-openapi', () => {
    describe('yup mixed schema', () => {
        it('should not handle "required" attribute', () => {
            const input = yup.string().required();
            const output: SchemaObject = { type: 'string' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "nullable" attribute', () => {
            const input = yup.string().nullable();
            const output: SchemaObject = { type: 'string', nullable: true };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "max" attribute', () => {
            const input = yup.string().default('default value');
            const output: SchemaObject = { type: 'string', default: 'default value' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "enum" attribute', () => {
            const input = yup.string().oneOf(['a', 'b', 'c']);
            const output: SchemaObject = { type: 'string', enum: ['a', 'b', 'c'] };

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

        it('should use title in "meta" attribute instead of label', () => {
            const input = yup.string().label('label').meta({ title: 'title' });
            const output: SchemaObject = { type: 'string', title: 'title' };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle description in "meta" attribute', () => {
            const input = yup.string().meta({ description: 'description' });
            const output: SchemaObject = { type: 'string', description: 'description' };

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
            const input = yup.number().max(1);
            const output: SchemaObject = { type: 'number', format: 'float', maximum: 1 };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "positive" attribute', () => {
            const input = yup.number().positive();
            const output: SchemaObject = { type: 'number', format: 'float', minimum: 0 };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "negative" attribute', () => {
            const input = yup.number().negative();
            const output: SchemaObject = { type: 'number', format: 'float', maximum: 0 };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "moreThan" attribute', () => {
            const input = yup.number().moreThan(10);
            const output: SchemaObject = { type: 'number', format: 'float', minimum: 10 };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "lessThan" attribute', () => {
            const input = yup.number().lessThan(100);
            const output: SchemaObject = { type: 'number', format: 'float', maximum: 100 };

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
            const input = yup.date().default(function now() {
                return new Date('2021-01-01T00:00:00.000Z');
            });
            const output: SchemaObject = {
                type: 'string',
                format: 'date',
                default: new Date('2021-01-01T00:00:00.000Z'),
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
    });

    describe('yup object schema', () => {
        it('should convert schema to openapi schema', () => {
            const input = yup.object({
                prop1: yup.string(),
                prop2: yup.string(),
            });
            const output: SchemaObject = {
                type: 'object',
                properties: {
                    prop1: { type: 'string' },
                    prop2: { type: 'string' },
                },
            };

            expect(yupToOpenAPI(input)).toEqual(output);
        });

        it('should handle "required" attribute', () => {
            const input = yup.object({
                prop1: yup.string().required(),
                prop2: yup.string(),
            });
            const output: SchemaObject = {
                type: 'object',
                properties: {
                    prop1: { type: 'string' },
                    prop2: { type: 'string' },
                },
                required: ['prop1'],
            };

            expect(yupToOpenAPI(input)).toEqual(output);
        });
    });
});
