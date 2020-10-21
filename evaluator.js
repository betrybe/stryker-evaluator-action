const fs = require('fs');
const testPath = 'reports/mutation/html/bind-mutation-test-report.js';
const destinyPath = 'result.json';

const CORRECT_ANSWER_GRADE = 3;
const WRONG_ANSWER_GRADE = 1;

const githubUsername = process.env.GITHUB_ACTOR || 'no_actor';
const githubRepositoryName = process.env.GITHUB_REPOSITORY || 'no_repository';

const requisiteName = process.argv[2].split('/')[2].split('.')[0] + ' mutation test';

let evaluations = [];

// Reading previous results
const previousContent = fs.readFileSync(destinyPath, 'utf8',  (err, data) => {
  if (err) { console.log(err) };
})

if (previousContent) {
  evaluations = JSON.parse(previousContent).evaluations;
}

let strykerData;

try {
  // Reading files from stryker data
  strykerData = fs.readFileSync(testPath, 'utf8');
  fs.unlinkSync(testPath);
} catch (err) {
  console.log('Error reading report file:', err);
}

evaluations.push(getEvaluation(strykerData));

fs.writeFileSync(destinyPath, JSON.stringify({
  github_username: githubUsername,
  github_repository_name: githubRepositoryName,
  evaluations: [...evaluations]
}));

function getEvaluation(strykerData) {
  const requisite = { 
    description: requisiteName,
    grade: WRONG_ANSWER_GRADE,
  };

  if (!strykerData) return requisite;

  let fullArray = [];

  const strykerResults = JSON.parse(strykerData.slice(60, (strykerData.length -1)));

  // Calculating mutation score
  let mutations = 0;
  let score = 0;

  Object.entries(strykerResults.files).forEach((file) => {
    file[1].mutants.forEach((mutant) => {
      fullArray.push({
        mutantId: mutant.id,
        status: mutant.status
      });
      if (mutant.status === "Killed") { score += 1 };
      mutations += 1;
    })
  });

  if (score === mutations) {
    requisite.grade = CORRECT_ANSWER_GRADE;
  }

  return requisite;
}
