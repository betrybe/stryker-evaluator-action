const fs = require('fs');
const testPath = 'reports/mutation/events/00006-onMutationTestReportReady.json';
const destinyPath = '/tmp/result.json';

const CORRECT_ANSWER_GRADE = 3;
const WRONG_ANSWER_GRADE = 1;

const githubUsername = process.env.INPUT_PR_AUTHOR_USERNAME || 'no_actor';
const githubRepositoryName = process.env.GITHUB_REPOSITORY || 'no_repository';

const requirementName = process.argv[2].split('/')[2].split('.')[0] + ' mutation test';

const previousResults = fs.readFileSync(destinyPath, 'utf8');

const evaluations = previousResults ? JSON.parse(previousResults).evaluations : [];

let strykerData;

try {
  strykerJSON = fs.readFileSync(testPath, 'utf8');
  strykerData = JSON.parse(strykerJSON);

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

  const fileIndex = Object.keys(strykerData.files)[0]
  const mutants = strykerData.files[fileIndex].mutants

  if(mutants.find(m => m.status === 'Survived')) {
    requirement.grade = WRONG_ANSWER_GRADE;
  } else {
    requirement.grade = CORRECT_ANSWER_GRADE;
  }

  return requirement;
}
