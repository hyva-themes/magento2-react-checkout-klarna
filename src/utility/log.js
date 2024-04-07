/* eslint-disable no-console */
import config from './config';

export default function log(message) {
  if (config.debug) {
    console.trace();
    console.log(message);
  }
}
