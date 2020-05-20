#!/bin/sh -l
set -x

REPOSITORY_NAME=$1
REPOSITORY_BRANCH=$2

git clone --branch $REPOSITORY_BRANCH https://github.com/$REPOSITORY_NAME.git /project-tests
rm -rf /project-tests/.git
cp -r /project-tests/* .
npm install
npm install -g @stryker-mutator/core
npm install -g @stryker-mutator/javascript-mutator

CONFIGS=$(find ./stryker -type f -name "*.conf.json")
for config in $CONFIGS; do
  stryker run $config
  node /evaluator.js "$config"
done

if [ $? != 0 ]; then
  echo "Execution error"
  exit 1
fi

echo ::set-output name=result::`cat result.json | base64 -w 0`
echo ::set-output name=pr-number::$(echo "$GITHUB_REF" | awk -F / '{print $3}')
