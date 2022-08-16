# stryker-evaluator-action

Stryker evaluator action for Tryber projects

This action evaluate Tryber projects with [Stryker](https://www.npmjs.com/package/stryker) library.

## Inputs

- `pr_author_username`

  **Required**

  Pull Request author username.

## Outputs

- `result`

  Stryker unit tests JSON results in base64 format.

## Usage example

```yml
- name: Fetch Stryker evaluator
  uses: actions/checkout@v2
  with:
    repository: betrybe/stryker-evaluator-action
    ref: v3.1
    token: ${{ secrets.GIT_HUB_PAT }}
    path: .github/actions/stryker-evaluator

- name: Run Stryker evaluation
  id: evaluator
  uses: ./.github/actions/stryker-evaluator
  with:
    pr_author_username: ${{ github.event.inputs.pr_author_username }}
```

## How to get result output
```yml
- name: Run Stryker evaluation
  id: stryker_evaluator
  uses: ./.github/actions/stryker-evaluator
  with:
    pr_author_username: ${{ github.event.inputs.pr_author_username }}

- name: Next step
  uses: another-github-action
  with:
    param: ${{ steps.stryker_evaluator.outputs.result }}
```

## Project constraints

The description of the requirement into `.trybe/requirements.json` must be `{FILE_NAME} mutation test` where `FILE_NAME` is the real filename without the extensions.

> Example: for the `fetchItem.test.js` validation the requirement description must be `fetchItem mutation test`.

The example `fetchItem.test.js` file's code:

```javascript
describe('Test #1' () => {
  it('unit test1', () => {});
  it('unit test2', () => {});
  it('unit test3', () => {});
});

describe('Test #2' () => {
  ...
});

describe('Test #3' () => {
  ...
});
```

The `.trybe/requirements.json` file must have the following structure:

```json
{
  "requirements": [{
    "description": "fetchItem mutation test",
    "bonus": false
  }]
}
```

Each new `.test.js` file must have an equivalent `requirement`.
