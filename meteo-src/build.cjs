// Casa Condados receives the integrated release built from the T2 sources.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');

const condados = path.resolve(__dirname, '..');
const t2 = path.resolve(process.env.METEONL_T2 || path.join(condados, '..', 'DomoticaNL V2'));
const build = path.join(t2, 'meteo-src', 'build.cjs');
if (!fs.existsSync(build)) {
  throw new Error('Indique a pasta da T2 em METEONL_T2 para gerar a versão partilhada da MeteoNL.');
}
execFileSync(process.execPath, [build, ...process.argv.slice(2), '--condados', condados], {stdio: 'inherit'});
