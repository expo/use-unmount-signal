#!/bin/bash
set -eo pipefail

echo 'Compiling TypeScript source files...'
node_modules/.bin/tsc

echo 'Copying other JavaScript files...'
find src -name '*.js' -exec cp {} build \;
