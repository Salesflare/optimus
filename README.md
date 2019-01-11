# Optimus

[![Greenkeeper badge](https://badges.greenkeeper.io/Salesflare/optimus.svg)](https://greenkeeper.io/)

Transformer for Salesflare filter rules.

Available as a plain transform function, hapi 16 plugin (which exposes a server method) or client transformer.

The client build supports last 2 versions according to browserslist, see [https://browserl.ist/?q=last+2+versions](https://browserl.ist/?q=last+2+versions).
The client build is transformed through Babel but does not come with polyfills, for that I recommend [https://polyfill.io](https://polyfill.io).
This means we can use object spread in our transformer, which will be transformed, but something like Set you will have to polyfill yourself.

```js
const Optimus = require('@salesflare/optimus');
const Hapi = require('hapi');

const server = new Hapi.Server();
await server.register(Optimus);

const transformedFilter = Optimus.transform(oldFilter); // plain
const transformedFilter = server.methods.optimus.transform(oldFilter); // hapi server method
```

```html
<script src="./node_modules/@salesflare/optimus/dist/optimus.min.js"></script>
<script>
    var transformedFilter = Optimus.transform(oldFilter);
</script>
```
