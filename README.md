# yup-to-openapi

Simple tool to convert [yup] object schema to [OpenApi 3 object schema](https://swagger.io/specification/#schema-object).

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/@rudi23/yup-to-openapi.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@rudi23/yup-to-openapi
[download-image]: https://img.shields.io/npm/dm/@rudi23/yup-to-openapi.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/@rudi23/yup-to-openapi
[yup]: https://github.com/jquense/yup

### Installation

Install using [`npm`][npm-url]:

```bash
npm install @rudi23/yup-to-openapi
```

NodeJS `>= 8.0.0.` is required.

### Example
```js
import yupToOpenAPI from '@src/index';

const yupSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.number().required(),
    age: yup.number().required().min(0).max(100),
    job: yup.string(),
});

const openApiSchema = yupToOpenAPI(yupSchema);
```

## LICENSE

[MIT](https://github.com/rudi23/yup-to-openapi/blob/master/LICENSE)
