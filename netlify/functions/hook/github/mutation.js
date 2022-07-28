const got = require('got');
const graphql = require('graphql');

const pkg = require('../../../../package.json');

const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;
const GITHUB_API_ENDPOINT = 'https://api.github.com/graphql';

const MUTATION = graphql`
  mutation createCommitOnBranch($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input)
  }
`;

const DEFAULT_INPUT = {
  branch: {
    nameWithOwner: new URL(pkg.repository).pathname
      .replace(/^\//, '')
      .replace(/\/$/, ''),
    branchName: 'main',
  },
  expectedHeadOid: '',
  message: {
    headline: 'chore: auto-update of wordpress data',
  },
};

module.exports = async (fileChanges, expectedHeadOid) => {
  const input = {
    ...DEFAULT_INPUT,
    expectedHeadOid,
    fileChanges,
  };

  const body = {
    variables: {
      input,
    },
    query: MUTATION,
  };

  await got(GITHUB_API_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `bearer ${GITHUB_API_TOKEN}`,
      'content-type': 'application/json',
    },
    body: body.toString(),
    responseType: 'json',
  })
    .then((res) => {
      console.log('Request to Github succeeded!');
      console.log(res.body);
    })
    .catch((e) => {
      console.error('Request to Github FAILED!');
      console.error(e);
    });
};