// Regenerate after changing python-worker.js or either bundled Skulpt library.
import {readFileSync,writeFileSync} from 'node:fs';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const worker=read('python-worker.js').replace(/\s*importScripts\('vendor\/skulpt.min.js','vendor\/skulpt-stdlib.js'\);/,'');
const source=['vendor/skulpt.min.js','vendor/skulpt-stdlib.js'].map(read).concat(worker).join('\n;\n').replace(/^\/\/# sourceMappingURL=.*$/gm,'');
writeFileSync(new URL('python-offline-bundle.js',import.meta.url),'/* Generated local Python worker source. See build-python-offline.mjs; Skulpt licenses in vendor/. */\nwindow.PYTHON_OFFLINE_WORKER_SOURCE='+JSON.stringify(source)+';\n');
