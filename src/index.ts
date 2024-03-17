import { ArraySchema, isSchema, ObjectSchema } from 'yup';
import type { ExtraParams, SchemaLike } from 'yup/lib/types.d.js';
import type { AnySchema, AnyObjectSchema } from 'yup';
import type { SchemaObject } from 'openapi3-ts';
import type Lazy from 'yup/lib/Lazy.d.js';

type Meta = {
    title?: string;
    description?: string;
};

type FieldType = 'integer' | 'number' | 'string' | 'boolean' | 'object' | 'null' | 'array';

const yupToSwaggerConditions: Record<string, string[]> = {
    array: ['min', 'max'],
    number: ['min', 'max'],
    string: ['min', 'max', 'matches'],
};

const yupToSwaggerFormat: Record<string, { types: string[]; default: string | null }> = {
    mixed: {
        types: [],
        default: null,
    },
    lazy: {
        types: [],
        default: null,
    },
    array: {
        types: [],
        default: null,
    },
    object: {
        types: [],
        default: null,
    },
    boolean: {
        types: [],
        default: null,
    },
    date: {
        types: ['date', 'date-time'],
        default: 'date',
    },
    number: {
        types: ['int32', 'int64', 'float', 'double'],
        default: 'float',
    },
    string: {
        types: [
            'byte',
            'binary',
            'password',
            'email',
            'hostname',
            'image',
            'ipv4',
            'ipv6',
            'phone-number',
            'uri',
            'url',
            'uuid',
            'video',
        ],
        default: null,
    },
};

const yupToSwaggerType: Record<string, { types: FieldType[]; default: FieldType }> = {
    mixed: {
        types: [],
        default: 'object',
    },
    lazy: {
        types: [],
        default: 'object',
    },
    array: {
        types: [],
        default: 'array',
    },
    object: {
        types: [],
        default: 'object',
    },
    boolean: {
        types: [],
        default: 'boolean',
    },
    number: {
        types: ['integer'],
        default: 'number',
    },
    string: {
        types: [],
        default: 'string',
    },
    date: {
        types: [],
        default: 'string',
    },
};

function getTests(yupField: AnySchema): Record<string, ExtraParams | undefined> {
    return yupField.describe().tests.reduce(
        (agg, test) => {
            if (!test.name) {
                return agg;
            }

            return {
                ...agg,
                [test.name]: test.params,
            };
        },
        {} as Record<string, ExtraParams | undefined>
    );
}

function findTests<SearchItem extends string = string>(yupField: AnySchema, searchArr: SearchItem[]): SearchItem[] {
    const allAttrNames = Object.keys(getTests(yupField));

    return searchArr.filter((t) => allAttrNames.includes(t));
}

function getType(yupField: AnySchema): FieldType | undefined {
    const typeConfig = yupToSwaggerType[yupField.type];
    if (!typeConfig) {
        throw new Error(`Cannot find support for "${yupField.type}" type in yupToSwaggerType config.`);
    }

    const result = findTests<FieldType>(yupField, typeConfig.types);

    return result.shift() || typeConfig.default;
}

function isInteger(yupField: AnySchema) {
    const integerAttributes = findTests(yupField, ['integer']);

    return integerAttributes.length > 0;
}

function getFormat(yupField: AnySchema): string | null {
    if (isInteger(yupField)) {
        return 'int32';
    }

    const formatConfig = yupToSwaggerFormat[yupField.type] || [];
    if (!formatConfig) {
        throw new Error(`Cannot find support for "${yupField.type}" format in yupToSwaggerFormat config`);
    }

    const result = findTests(yupField, formatConfig.types);

    return result.shift() || yupToSwaggerFormat[yupField.type].default;
}

function getEnum(yupField: AnySchema): unknown[] | null {
    const values = yupField.describe().oneOf;

    return Array.isArray(values) && values.length > 0 ? values : null;
}

function getMiscAttributes(yupField: AnySchema): Record<string, string | boolean> {
    const conditionsConfig = yupToSwaggerConditions[yupField.type] || [];
    const allAttrNames = getTests(yupField);
    const result = findTests(yupField, conditionsConfig);

    function createAttributes(attrName: string) {
        switch (yupField.type) {
            case 'number':
                if (attrName === 'min' && allAttrNames?.min?.more !== undefined) {
                    return {
                        minimum: allAttrNames?.min?.more,
                        exclusiveMinimum: true,
                    };
                }
                if (attrName === 'min' && allAttrNames?.min?.min !== undefined) {
                    return {
                        minimum: allAttrNames?.min?.min,
                    };
                }
                if (attrName === 'max' && allAttrNames?.max?.less !== undefined) {
                    return {
                        maximum: allAttrNames?.max?.less,
                        exclusiveMaximum: true,
                    };
                }
                if (attrName === 'max' && allAttrNames?.max?.max !== undefined) {
                    return {
                        maximum: allAttrNames?.max?.max,
                    };
                }

                return undefined;
            case 'string':
                if (attrName === 'min' && allAttrNames?.min?.min !== undefined) {
                    return {
                        minLength: allAttrNames?.min?.min,
                    };
                }
                if (attrName === 'max' && allAttrNames?.max?.max !== undefined) {
                    return {
                        maxLength: allAttrNames?.max?.max,
                    };
                }
                if (attrName === 'matches' && allAttrNames?.matches?.regex instanceof RegExp) {
                    return {
                        pattern: allAttrNames?.matches?.regex?.toString(),
                    };
                }

                return undefined;
            case 'array':
                if (attrName === 'min' && allAttrNames?.min?.min !== undefined) {
                    return {
                        minItems: allAttrNames?.min?.min,
                    };
                }
                if (attrName === 'max' && allAttrNames?.max?.max !== undefined) {
                    return {
                        maxItems: allAttrNames?.max?.max,
                    };
                }

                return undefined;
            default:
                return undefined;
        }
    }

    return result.reduce(
        (agg, attrName) => ({
            ...agg,
            ...createAttributes(attrName),
        }),
        {}
    );
}

function getObjectProperties(fields: Record<string, AnySchema>): Record<string, SchemaObject> {
    return Object.entries(fields).reduce(
        (agg, [name, yupSchema]) => ({
            ...agg,
            [name]: parse(yupSchema),
        }),
        {} as Record<string, SchemaObject>
    );
}

function getArrayItems(yupSchema: AnySchema): SchemaObject {
    return parse(yupSchema);
}

function isRequired(yupSchema: AnySchema): boolean {
    return yupSchema.spec.presence.includes('required');
}

function getRequired(fields: Record<string, AnySchema>): string[] {
    return Object.entries(fields).reduce(
        (agg, [name, yupSchema]) => (isRequired(yupSchema) ? [...agg, name] : agg),
        [] as string[]
    );
}

function parseObject(yupSchema: AnyObjectSchema): SchemaObject {
    const meta = yupSchema.describe().meta as Meta | undefined;
    const title = meta?.title;
    const description = meta?.description;
    const properties = getObjectProperties(yupSchema.fields);
    const required = getRequired(yupSchema.fields);

    const schema: SchemaObject = {
        type: 'object',
        properties,
    };

    if (title) {
        schema.title = title;
    }
    if (description) {
        schema.description = description;
    }
    if (required.length > 0) {
        schema.required = required;
    }

    return schema;
}

function parseArray(yupSchema: ArraySchema<AnySchema>): SchemaObject {
    const meta = yupSchema.describe().meta as Meta | undefined;
    const title = meta?.title;
    const description = meta?.description;
    const items = yupSchema.innerType ? getArrayItems(yupSchema.innerType) : null;
    const miscAttrs = getMiscAttributes(yupSchema);

    const schema: SchemaObject = {
        type: 'array',
    };

    if (title) {
        schema.title = title;
    }
    if (description) {
        schema.description = description;
    }
    if (items) {
        schema.items = items;
    }
    if (Object.values(miscAttrs).length > 0) {
        return {
            ...schema,
            ...miscAttrs,
        };
    }

    return schema;
}

function isLazy(x: unknown): x is Lazy<any> {
    return isSchema(x) && x.type === 'lazy';
}

export default function parse(yupSchema: SchemaLike): SchemaObject {
    if (isLazy(yupSchema)) {
        return { type: 'object' } as SchemaObject;
    }

    const type = getType(yupSchema);
    if (type === 'object' && yupSchema instanceof ObjectSchema) {
        return parseObject(yupSchema);
    }
    if (type === 'array' && yupSchema instanceof ArraySchema) {
        return parseArray(yupSchema);
    }

    const schemaDescription = yupSchema.describe();
    const meta = schemaDescription.meta as Meta | undefined;
    const format = getFormat(yupSchema);
    const enumValues = getEnum(yupSchema);
    const miscAttrs = getMiscAttributes(yupSchema);
    const nullable = yupSchema.spec.nullable || null;
    const defaultValue = yupSchema.spec.default || null;
    const title = meta?.title || schemaDescription.label || null;
    const description = meta?.description || null;

    const result: SchemaObject = {
        type,
    };
    if (format) {
        result.format = format;
    }
    if (enumValues) {
        result.enum = enumValues;
    }
    if (nullable) {
        result.nullable = nullable;
    }
    if (defaultValue && typeof defaultValue === 'function') {
        const value = defaultValue();
        result.default = value instanceof Date ? value.toISOString() : value;
    } else if (defaultValue && defaultValue instanceof Date) {
        result.default = defaultValue.toISOString();
    } else if (defaultValue) {
        result.default = defaultValue;
    }
    if (title) {
        result.title = title;
    }
    if (description) {
        result.description = description;
    }

    if (Object.values(miscAttrs).length > 0) {
        return {
            ...result,
            ...miscAttrs,
        };
    }

    return result;
}
