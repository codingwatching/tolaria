import { describe, expect, it } from 'vitest'
import { parseMobileGitRemote } from './mobileGitRemote'

describe('mobile git remote parsing', () => {
  it('uses GitHub OAuth for GitHub HTTPS remotes', () => {
    expect(parseMobileGitRemote('https://github.com/refactoringhq/tolaria.git')).toEqual({
      url: 'https://github.com/refactoringhq/tolaria.git',
      host: 'github.com',
      owner: 'refactoringhq',
      repository: 'tolaria',
      authStrategy: 'githubOAuth',
    })
  })

  it('uses GitHub OAuth for GitHub SSH shorthand remotes', () => {
    expect(parseMobileGitRemote('git@github.com:refactoringhq/tolaria.git')).toMatchObject({
      host: 'github.com',
      owner: 'refactoringhq',
      repository: 'tolaria',
      authStrategy: 'githubOAuth',
    })
  })

  it('uses SSH keys for non-GitHub SSH remotes', () => {
    expect(parseMobileGitRemote('ssh://git@git.example.com/acme/notes.git')).toMatchObject({
      host: 'git.example.com',
      owner: 'acme',
      repository: 'notes',
      authStrategy: 'sshKey',
    })
  })

  it('uses SSH keys for non-GitHub HTTPS remotes', () => {
    expect(parseMobileGitRemote('https://gitlab.com/acme/notes.git')).toMatchObject({
      host: 'gitlab.com',
      owner: 'acme',
      repository: 'notes',
      authStrategy: 'sshKey',
    })
  })

  it('rejects non-remote input', () => {
    expect(parseMobileGitRemote('/Users/luca/Laputa')).toBeNull()
    expect(parseMobileGitRemote('')).toBeNull()
  })
})
