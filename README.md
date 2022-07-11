# yup-to-openapi

Simple tool to convert [yup] object schema to [OpenApi 3 object schema](https://swagger.io/specification/#schema-object).

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@rudi23/yup-to-openapi.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@rudi23/yup-to-openapi
[download-image]: https://img.shields.io/npm/dm/@rudi23/yup-to-openapi.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/@rudi23/yup-to-openapi
[yup]: https://github.com/jquense/yup

## Installation

Install using [`npm`][npm-url]:

```bash
npm install @rudi23/yup-to-openapi
```

NodeJS `>= 12.0.0.` is required.

## Example

```js
import yupToOpenAPI from '@rudi23/yup-to-openapi';

const yupSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.number().required(),
    age: yup.number().required().min(0).max(100),
    job: yup.string(),
});

const openApiSchema = yupToOpenAPI(yupSchema);
```

## yup methods implemented

-   [x] mixed
    -   [x] [mixed.label(label: string)](#mixedlabellabel-string)
    -   [x] [mixed.meta({ title: string })](#mixedmeta-title-string-)
    -   [x] [mixed.meta({ description: string })](#mixedmeta-description-string-)
    -   [x] [mixed.nullable()](#mixednullable)
    -   [x] [mixed.default(value: any)](#mixeddefaultvalue-any)
    -   [x] [mixed.oneOf(arrayOfValues: Array<any>)](#mixedoneofarrayofvalues-arrayany)
    -   [x] [mixed.required()](#mixedrequired)
-   [x] [string](#string)
    -   [x] [string.min(limit: number)](#stringminlimit-number)
    -   [x] [string.max(limit: number)](#stringmaxmax-number)
    -   [x] [string.matches(regex: Regex](#stringmatchesregex-regex)
    -   [x] [string.email()](#stringemail)
    -   [x] [string.url()](#stringurl)
    -   [x] [string.uuid()](#stringuuid)
-   [x] [number](#number)
    -   [x] [number.integer()](#numberinteger)
    -   [x] [number.min(limit: number)](#numberminlimit-number)
    -   [x] [number.max(limit: number)](#numbermaxlimit-number)
    -   [x] [number.positive()](#numberpositive)
    -   [x] [number.negative()](#numbernegative)
    -   [x] [number.lessThan(max: number)](#numberlessthanmax-number)
    -   [x] [number.moreThan(min: number)](#numbermorethanmin-number)
-   [x] [boolean](#boolean)
-   [x] [date](#date)
    -   [x] [date.default(value: function | Date)](#datedefaultvalue-function--date)
-   [x] [array](#array)
    -   [x] [array.min(limit: number)](#arrayminlimit-number)
    -   [x] [array.max(limit: number)](#arraymaxlimit-number)
-   [x] [object](#object)

## API

#### `mixed.label(label: string)`

```js
const input = yup.string().label('label');
yupToOpenAPI(input); // => { type: 'string', title: 'label' }
```

#### `mixed.meta({ title: string })`

```js
const input = yup.string().meta({ title: 'title' });
yupToOpenAPI(input); // => { type: 'string', title: 'title' };
```

#### `mixed.meta({ description: string })`

```js
const input = yup.string().meta({ description: 'description' });
yupToOpenAPI(input); // => { type: 'string', description: 'description' };
```

#### `mixed.nullable()`

```js
const input = yup.string().nullable();
yupToOpenAPI(input); // => { type: 'string', nullable: true }
```

#### `mixed.default(value: any)`

```js
const input = yup.string().default('default value');
yupToOpenAPI(input); // => { type: 'string', default: 'default value' }

const input = yup.number().default(1.23);
yupToOpenAPI(input); // => { type: 'string', format: 'float', default: 1.23 }
```

#### `mixed.oneOf(arrayOfValues: Array<any>)`

```js
const input = yup.string().oneOf(['a', 'b', 'c']);
yupToOpenAPI(input); // => { type: 'string', enum: ['a', 'b', 'c'] }

const input = yup.number().oneOf([1, 2, 3]);
yupToOpenAPI(input); // => { type: 'number', format: 'float', enum: [1, 2, 3] }
```

#### `mixed.required()`

`required()` works only for object's props

```js
const input = yup.object({
    foo: yup.string().required(),
    bar: yup.string(),
    baz: yup.number().required(),
});
yupToOpenAPI(input); // =>
// {
//   type: 'object',
//   properties: {
//     foo: { type: 'string' },
//     bar: { type: 'string' },
//     baz: { type: 'number', format: 'float' },
//   },
//   required: ['foo', 'baz'],
// }
```

#### `string`

```js
const input = yup.string();
yupToOpenAPI(input); // => { type: 'string' }
```

#### `string.min(limit: number)`

```js
const input = yup.string().min(1);
yupToOpenAPI(input); // => { type: 'string', minLength: 1 }
```

#### `string.max(max: number)`

```js
const input = yup.string().max(10);
yupToOpenAPI(input); // => { type: 'string', maxLength: 10 }
```

#### `string.matches(regex: Regex)`

```js
const input = yup.string().matches(/(hi|bye)/);
yupToOpenAPI(input); // => { type: 'string', pattern: /(hi|bye)/ }
```

#### `string.email()`

```js
const input = yup.string().email();
yupToOpenAPI(input); // => { type: 'string', format: 'email' }
```

#### `string.url()`

```js
const input = yup.string().url();
yupToOpenAPI(input); // => { type: 'string', format: 'url' }
```

#### `string.uuid()`

```js
const input = yup.string().uuid();
yupToOpenAPI(input); // => { type: 'string', format: 'uuid' }
```

#### `number`

```js
const input = yup.number();
yupToOpenAPI(input); // => { type: 'integer', format: 'float' };
```

#### `number.integer()`

```js
const input = yup.number().integer();
yupToOpenAPI(input); // => { type: 'integer', format: 'int32' };
```

#### `number.min(limit: number)`

```js
const input = yup.number().min(1);
yupToOpenAPI(input); // => { type: 'number', format: 'float', minimum: 1 };
```

#### `number.max(limit: number)`

```js
const input = yup.number().max(10);
yupToOpenAPI(input); // => { type: 'number', format: 'float', maximum: 10 };
```

#### `number.positive()`

```js
const input = yup.number().positive();
yupToOpenAPI(input); // => { type: 'number', format: 'float', minimum: 0, exclusiveMinimum: true };
```

#### `number.negative()`

```js
const input = yup.number().negative();
yupToOpenAPI(input); // => { type: 'number', format: 'float', maximum: 0, exclusiveMaximum: true };
```

#### `number.lessThan(max: number)`

```js
const input = yup.number().lessThan(100);
yupToOpenAPI(input); // => { type: 'number', format: 'float', maximum: 100, exclusiveMaximum: true };
```

#### `number.moreThan(min: number)`

```js
const input = yup.number().moreThan(10);
yupToOpenAPI(input); // => { type: 'number', format: 'float', minimum: 10, exclusiveMinimum: true };
```

#### `boolean`

```js
const input = yup.boolean();
yupToOpenAPI(input); // => { type: 'boolean' };
```

#### `date`

```js
const input = yup.date();
yupToOpenAPI(input); // => { type: 'string', format: 'date' };
```

#### `date.default(value: function | Date)`

```js
const input = yup.date().default(new Date('2021-01-01T00:00:00.000Z'));
yupToOpenAPI(input); // => { type: 'string', format: 'date', default: new Date('2021-01-01T00:00:00.000Z') };

const input = yup.date().default(function now() {
    return new Date('2021-01-01T00:00:00.000Z');
});
yupToOpenAPI(input); // => { type: 'string', format: 'date', default: new Date('2021-01-01T00:00:00.000Z') };
```

#### `array`

```js
const input = yup.array().of(yup.string());
yupToOpenAPI(input); // =>
// {
//   type: 'array',
//   items: {
//     type: 'string',
//   },
// }
```

#### `array.min(limit: number)`

```js
const input = yup.array().min(1);
yupToOpenAPI(input); // =>
// {
//   type: 'array',
//   minItems: 1,
// }
```

#### `array.max(limit: number)`

```js
const input = yup.array().max(10);
yupToOpenAPI(input); // =>
// {
//   type: 'array',
//   maxItems: 10,
// }
```

#### `object`

```js
const input = yup.object({
    foo: yup.string(),
    bar: yup.string(),
});
yupToOpenAPI(input); // =>
// {
//   type: 'object',
//   properties: {
//     foo: { type: 'string' },
//     bar: { type: 'string' },
//   },
// }
```

## LICENSE

[MIT](https://github.com/rudi23/yup-to-openapi/blob/master/LICENSE)
