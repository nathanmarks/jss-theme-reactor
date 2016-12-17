import minimist from 'minimist';
import glob from 'glob';
import Mocha from 'mocha';

require('app-module-path').addPath(`${__dirname}'./../`);

const argv = minimist(process.argv.slice(2), {
  alias: {
    m: 'module',
    g: 'grep',
  },
});

const mocha = new Mocha({
  grep: argv.grep ? argv.grep : undefined,
});

const patterns = [
  `src/**/${argv.module ? argv.module : '*'}.{spec,test}.js`,
  `test/**/${argv.module ? argv.module : '*'}.{spec,test}.js`,
];

glob(
  `{${patterns.join(',')}}`,
  {
    ignore: '**/node_modules/**',
  },
  (err, files) => {
    files.forEach((file) => mocha.addFile(file));
    mocha.run((failures) => {
      process.on('exit', () => {
        process.exit(failures);
      });
    });
  },
);
