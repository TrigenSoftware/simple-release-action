import {
  getInput,
  setFailed,
  setOutput
} from '@actions/core'
import { getOctokit } from '@actions/github'
import { load } from '@simple-release/config'
import {
  ReleaserGithubAction,
  ifSetOptionsComment,
  ifReleaseCommit
} from '@simple-release/github-action'
import {
  lazyDependencyImport,
  saveDependenciesCache
} from './dependencies.js'

const workflow = getInput('workflow')

if (workflow === 'check' && ifSetOptionsComment() === false) {
  setOutput('continue', 'false')
  setOutput('workflow', 'none')
  process.exit(0)
}

const GITHUB_TOKEN = getInput('github-token')
const NODE_AUTH_TOKEN = getInput('npm-token')
const PUBLISH_TOKEN = getInput('publish-token')
const branch = getInput('branch')

process.env.NODE_AUTH_TOKEN = NODE_AUTH_TOKEN
process.env.PUBLISH_TOKEN = PUBLISH_TOKEN

try {
  const {
    project,
    releaser,
    ...options
  } = await load({
    config: true,
    project: true
  }, lazyDependencyImport)

  await saveDependenciesCache()

  const gha = new ReleaserGithubAction({
    project,
    octokit: getOctokit(GITHUB_TOKEN),
    ...releaser
  })
    .setOptions({
      ...options,
      checkout: {
        ...options.checkout,
        branch: branch || options.checkout?.branch
      }
    })

  if (workflow === 'check') {
    const isReleaseCommit = await ifReleaseCommit(gha)
    const workflow = isReleaseCommit
      ? 'release'
      : 'pull-request'

    setOutput('continue', 'true')
    setOutput('workflow', workflow)
  } else if (workflow === 'full') {
    await gha.runAction()
  } else if (workflow === 'pull-request') {
    await gha.runPullRequestAction()
  } else if (workflow === 'release') {
    await gha.runReleaseAction()
  }
} catch (error) {
  if (error instanceof Error) {
    setFailed(error.message)
  } else {
    setFailed('An unknown error occurred')
  }

  throw error
}
