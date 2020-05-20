const execSync = require('child_process').execSync;
const fs = require('fs');

const buildPath = (absolutePath, filePath) => (`${absolutePath}/${filePath}`);

describe('Evaluator', () => {
  it('', () => {
    const pwd = execSync('pwd').toString().replace('\n', '');

    const evaluatorFile = buildPath(pwd, 'evaluator.js');
    const jestOutputFile = buildPath(pwd, 'tests/jest-output.json');
    const requirementsFile = buildPath(pwd, 'tests/requirements.json');
    const resultFile = buildPath(pwd, 'tests/result.json');

    const expectedResultJson = {
      github_username: 'no_actor',
      github_repository_name: 'no_repository',
      evaluations: [{
        description: "Sum module",
        grade: 3
      }, {
        description: "Power module",
        grade: 3
      }, {
        description: "Multiply module",
        grade: 1
      }]
    }

    execSync(
      `node ${evaluatorFile} ${jestOutputFile} ${requirementsFile} ${resultFile}`,
      { stdio: 'inherit' }
    );

    const evaluationFileContent = fs.readFileSync(resultFile);
    const resultJson = JSON.parse(evaluationFileContent);

    expect(resultJson).toMatchObject(expectedResultJson);
  });
});
