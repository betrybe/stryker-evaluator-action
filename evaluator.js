const fs = require('fs');
const testPath = 'reports/mutation/html/bind-mutation-test-report.js';
const destinyPath = 'result.json';

const CORRECT_ANSWER_GRADE = 3;
const WRONG_ANSWER_GRADE = 1;

const githubUsername = process.env.INPUT_PR_AUTHOR_USERNAME || 'no_actor';
const githubRepositoryName = process.env.GITHUB_REPOSITORY || 'no_repository';

const requirementName = process.argv[2].split('/')[2].split('.')[0] + ' mutation test';

const previsousResults = fs.readFileSync(destinyPath, 'utf8');

const evaluations = previsousResults ? JSON.parse(previsousResults).evaluations : [];

let strykerData;

try {
  strykerData = fs.readFileSync(testPath, 'utf8');

  // Delete report file in order not to interfere with the next test
  fs.unlinkSync(testPath);
} catch (err) {
  console.log('Error reading report file:', err);
}

evaluations.push(getEvaluation(strykerData));

fs.writeFileSync(destinyPath, JSON.stringify({
  github_username: githubUsername,
  github_repository_name: githubRepositoryName,
  evaluations,
}));

function getEvaluation(strykerData) {
  const requirement = {
    description: requirementName,
    grade: WRONG_ANSWER_GRADE,
  };

  if (!strykerData) return requirement;

  const strykerResults = JSON.parse(strykerData.slice(60, (strykerData.length -1)));

  // Calculating mutation score
  let mutations = 0;
  let score = 0;

  Object.values(strykerResults.files).forEach((testResult) => {
    testResult.mutants.forEach((mutant) => {
      if (mutant.status === "Killed") { score += 1 };
      mutations += 1;
    })
  });

  if (score === mutations) {
    requirement.grade = CORRECT_ANSWER_GRADE;
  }

  return requirement;
}
