import { fileURLToPath } from 'node:url';

export const apiVersion = 'v1';

export function healthcheck() {
  return {
    status: 'ok',
    version: apiVersion
  };
}

const isDirectExecution = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  console.log(JSON.stringify(healthcheck()));
}
