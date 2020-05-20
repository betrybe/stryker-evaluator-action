const fs = require('fs');
const testPath = 'reports/mutation/html/bind-mutation-test-report.js';
const destinyPath = 'result.json';

const CORRECT_ANSWER_GRADE = 3;
const WRONG_ANSWER_GRADE = 1;

const githubUsername = process.env.GITHUB_ACTOR || 'no_actor';
const githubRepositoryName = process.env.GITHUB_REPOSITORY || 'no_repository';

const requisiteName = process.argv[2].split('/')[2].split('.')[0];


let fullArray = [];
let evaluations = [];

// Reading previous results
const previousContent = fs.readFileSync(destinyPath, 'utf8',  (err, data) => {
  if (err) { console.log(err) };
})

if (previousContent) {
  evaluations = JSON.parse(previousContent).evaluations;
}


// Reading files from stryker data
const strykerData = fs.readFileSync( testPath, 'utf8', (err, data) => {
  if (err) { console.log(err) };
})

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
    if (mutant.status == "Killed") { score += 1 };
    mutations += 1;
  })
});

const mutationScore = (score/mutations * 100);

const requisite = { 
  description:  requisiteName, 
  grade: mutationScore == 100 ? CORRECT_ANSWER_GRADE : WRONG_ANSWER_GRADE 
}

evaluations.push(requisite);

fs.writeFileSync(destinyPath, JSON.stringify({
  github_username: githubUsername,
  github_repository_name: githubRepositoryName,
  evaluations: [...evaluations]
}));