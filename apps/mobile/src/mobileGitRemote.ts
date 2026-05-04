export type MobileGitAuthStrategy = 'githubOAuth' | 'sshKey'

export type MobileGitRemote = {
  url: string
  host: string
  owner: string
  repository: string
  authStrategy: MobileGitAuthStrategy
}

export function parseMobileGitRemote(url: string): MobileGitRemote | null {
  const normalizedUrl = url.trim()
  return parseHttpRemote(normalizedUrl) ?? parseScpRemote(normalizedUrl) ?? parseSshRemote(normalizedUrl)
}

function parseHttpRemote(url: string): MobileGitRemote | null {
  const parsedUrl = parseUrl(url)
  if (!parsedUrl || !['http:', 'https:'].includes(parsedUrl.protocol)) {
    return null
  }

  return createRemote(url, parsedUrl.hostname, pathParts(parsedUrl.pathname))
}

function parseSshRemote(url: string): MobileGitRemote | null {
  const parsedUrl = parseUrl(url)
  if (!parsedUrl || parsedUrl.protocol !== 'ssh:') {
    return null
  }

  return createRemote(url, parsedUrl.hostname, pathParts(parsedUrl.pathname))
}

function parseScpRemote(url: string): MobileGitRemote | null {
  const match = /^git@([^:]+):([^/]+)\/(.+)$/.exec(url)
  if (!match) {
    return null
  }

  return createRemote(url, match[1], [match[2], stripGitSuffix(match[3])])
}

function createRemote(url: string, host: string, parts: string[]): MobileGitRemote | null {
  if (parts.length < 2) {
    return null
  }

  return {
    url,
    host,
    owner: parts[0],
    repository: stripGitSuffix(parts[1]),
    authStrategy: host === 'github.com' ? 'githubOAuth' : 'sshKey',
  }
}

function parseUrl(url: string) {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

function pathParts(pathname: string) {
  return pathname.split('/').filter(Boolean)
}

function stripGitSuffix(value: string) {
  return value.endsWith('.git') ? value.slice(0, -4) : value
}
