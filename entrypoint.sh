#!/bin/sh -l
set -x

npm install
touch result.json
CONFIGS=$(find ./stryker -type f -name "*.conf.json")
for config in $CONFIGS; do
  npx stryker run $config
  node /evaluator.js "$config"
done

if [ $? != 0 ]; then
  echo "Execution error"
  exit 1
fi

echo ::set-output name=result::`cat result.json | base64 -w 0`
