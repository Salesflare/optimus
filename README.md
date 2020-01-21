# Optimus

[![Greenkeeper badge](https://badges.greenkeeper.io/Salesflare/optimus.svg)](https://greenkeeper.io/)

Transformer for Salesflare filter rules.

Available as a plain transform function, hapi 19 helper functions or client transformer.

The client build supports last 2 versions according to browserslist, see [https://browserl.ist/?q=last+2+versions](https://browserl.ist/?q=last+2+versions).
The client build is transformed through Babel but does not come with polyfills, for that we recommend [https://polyfill.io](https://polyfill.io).
This means we can use object spread in our transformer, which will be transformed, but something like Set you will have to polyfill yourself.

```js
const Optimus = require('@salesflare/optimus');
const Hapi = require('@hapi/hapi');

const server = new Hapi.Server();

const transformedFilter = Optimus.transform(oldFilter); // plain

// in a route config
{
    ...,
    // this changes the rules in request.payload to the transformed rules
    pre: [Optimus.pre.transformInPlace('payload')],
    ...
}
```

```html
<script src="./node_modules/@salesflare/optimus/dist/optimus.min.js"></script>
<script>
    var transformedFilter = Optimus.transform(oldFilter);
</script>
```
