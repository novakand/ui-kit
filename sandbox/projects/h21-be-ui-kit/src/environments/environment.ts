// the file contents for the current environment will overwrite these during build.
// the build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// the list of which env maps to which file can be found in `.angular-cli.json`.

import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: false,
  debouncingTime: 200,
};
