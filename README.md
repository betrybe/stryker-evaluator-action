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
- uses: betrybe/stryker-evaluator-action@v3
  with:
    pr_author_username: ${{ github.event.inputs.pr_author_username }}
```

## How to get result output
```yml
- name: Stryker evaluator
  id: evaluator
  uses: betrybe/stryker-evaluator-action@v3
  with:
    pr_author_username: ${{ github.event.inputs.pr_author_username }}
- name: Next step
  uses: another-github-action
  with:
    param: ${{ steps.evaluator.outputs.result }}
```

## Project contraints

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

## Learn about GitHub Actions

- https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-a-docker-container-action
