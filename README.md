# Optimus

Transformer for Salesflare filter rules.

Available as a plain transform function, hapi 16 plugin (which exposes a server method) or client transformer.

The client build supports last 2 versions according to browserslist, see [https://browserl.ist/?q=last+2+versions](https://browserl.ist/?q=last+2+versions).

```js
const Optimus = require('@salesflare/optimus');
const Hapi = require('hapi');

const server = new Hapi.Server();
await server.register(Optimus);

const transformedFilter = Optimus.transform(oldFilter); // plain
const transformedFilter = server.methods.optimusTransform(oldFilter); // hapi server method
```

```html
<script src="./node_modules/@salesflare/optimus/dist/optimus.min.js"></script>
<script>
    var transformedFilter = Optimus.transform(oldFilter);
</script>
```
