import { setFailed } from '@actions/core';
import { ActionContextImplementation } from './ActionContextImplementation';
import { createEnvironment } from './createEnvironment';

createEnvironment(new ActionContextImplementation()).catch((error) => {
  console.log('❓ Does Release Please build dist?');

  setFailed(error);
  process.exit(1);
});
