import fs from 'fs/promises'
import os from 'os'
import { join, dirname } from 'path'
import { createHash } from 'crypto'
import { fileURLToPath } from 'url'
import {
  saveCache,
  restoreCache
} from '@actions/cache'
import { exec } from '@actions/exec'
import { getQuery } from '@simple-release/config'
import requireResolve from './resolve.cjs'

const DIR = dirname(fileURLToPath(import.meta.url))
const DEPENDENCIES_DIR = join(os.homedir(), '.simple-release-dependencies')
const NPM_CLI = requireResolve('npm').replace('index.js', join('bin', 'npm-cli.js'))

async function getDependenciesHash() {
  try {
    const packageLockPath = join(DIR, '..', 'package-lock.json')
    const packageLockContent = await fs.readFile(packageLockPath, 'utf8')

    return createHash('sha256').update(packageLockContent).digest('hex').substring(0, 8)
  } catch {
    return ''
  }
}

async function getCacheKeyFromConfig(config) {
  const projectQuery = getQuery(config.project)
  const hostingQuery = getQuery(config.hosting)
  const packageLockHash = await getDependenciesHash()

  return [projectQuery, hostingQuery, packageLockHash].filter(Boolean).join('+')
}

async function install(pkg, version) {
  const args = ['install', pkg]

  if (version) {
    args.push(`@${version}`)
  }

  await exec(NPM_CLI, args, {
    cwd: DEPENDENCIES_DIR,
    silent: true,
    env: process.env
  })
}

async function initDependenciesDirectory() {
  await fs.mkdir(DEPENDENCIES_DIR, {
    recursive: true
  })
  await fs.writeFile(join(DEPENDENCIES_DIR, 'package.json'), '{"type":"module"}')
  await fs.writeFile(join(DEPENDENCIES_DIR, 'index.js'), 'export const importDependency = _ => import(_)')
}

async function importDependency(name) {
  const { importDependency } = await import(join(DEPENDENCIES_DIR, 'index.js'))

  return await importDependency(name)
}

const CACHE_NOT_CHECKED = 0
const CACHE_HIT = 1
const CACHE_MISS = 2
let cacheStatus = CACHE_NOT_CHECKED
let cacheKey = null

export async function lazyDependencyImport(pkg, version, config) {
  if (cacheStatus === CACHE_NOT_CHECKED) {
    cacheKey = await getCacheKeyFromConfig(config)

    const hit = await restoreCache(
      [DEPENDENCIES_DIR],
      cacheKey
    )

    if (!hit) {
      await initDependenciesDirectory()
    }

    cacheStatus = hit ? CACHE_HIT : CACHE_MISS
  }

  if (cacheStatus === CACHE_MISS) {
    await install(pkg, version)
  }

  return await importDependency(pkg)
}

export async function saveDependenciesCache() {
  if (cacheStatus === CACHE_MISS && cacheKey) {
    await saveCache(
      [DEPENDENCIES_DIR],
      cacheKey
    )
  }
}
