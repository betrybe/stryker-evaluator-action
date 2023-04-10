#!/bin/bash
set -x

npm install
touch /tmp/result.json
CONFIGS=$(find ./stryker -type f -name "*.conf.json")
for config in $CONFIGS; do
  npx stryker run $config
  node "$EVALUATOR_FILE/evaluator.js" "$config"
done

if [ $? != 0 ]; then
  echo "Execution error"
  exit 1
fi

echo "result=`cat /tmp/result.json | base64 -w 0`" >> $GITHUB_OUTPUT
