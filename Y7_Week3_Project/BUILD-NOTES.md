# Runtime bundle maintenance

This is a static app; end users need no build step. The runtime source files are retained for maintenance.

After changing `runtime.js` or `runner-bootstrap.js`, rebuild `runner-bundle.js` with Node:

```js
const fs = require('node:fs');
const files = ['vendor/skulpt.min.js', 'vendor/skulpt-stdlib.js', 'runtime.js', 'runner-bootstrap.js'];
const source = files.map(f => fs.readFileSync(f, 'utf8')).join('\n;\n');
fs.writeFileSync('runner-bundle.js', 'window.PYTHON_RUNNER_SOURCE=' + JSON.stringify(source) + ';\n');
```

Run in the app folder. This mechanically bundles the locally supplied library sources; it does not send code anywhere. Respect `vendor/THIRD_PARTY_NOTICES.txt`.
