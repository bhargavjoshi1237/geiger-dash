import test from 'node:test'
import assert from 'node:assert/strict'
import { isAllowedRedirect, isLoopbackRedirect } from './redirects.js'

test('allows the known AI client callbacks', () => {
  assert.equal(isAllowedRedirect('https://claude.ai/api/mcp/auth_callback', {}), true)
  assert.equal(isAllowedRedirect('https://chatgpt.com/connector_platform_oauth_redirect', {}), true)
  assert.equal(isAllowedRedirect('https://chatgpt.com/connector/oauth/abc123', {}), true)
})

test('allows loopback callbacks on any port, for local clients', () => {
  assert.equal(isAllowedRedirect('http://localhost:53123/callback', {}), true)
  assert.equal(isAllowedRedirect('http://127.0.0.1:8080/callback', {}), true)
  assert.equal(isLoopbackRedirect('https://claude.ai/api/mcp/auth_callback'), false)
})

test('rejects lookalikes and unknown hosts', () => {
  assert.equal(isAllowedRedirect('https://claude.ai.evil.io/api/mcp/auth_callback', {}), false)
  assert.equal(isAllowedRedirect('https://evil.io/callback', {}), false)
  assert.equal(isAllowedRedirect('http://localhost.evil.io/callback', {}), false)
  assert.equal(isAllowedRedirect('https://chatgpt.com/connector/oauth/../../evil', {}), false)
  assert.equal(isAllowedRedirect('', {}), false)
  assert.equal(isAllowedRedirect(undefined, {}), false)
})

test('allows only the exact callback a user saved for a custom app', () => {
  const saved = ['https://agent.acme.com/oauth/callback']
  assert.equal(isAllowedRedirect('https://agent.acme.com/oauth/callback', {}, saved), true)
  assert.equal(isAllowedRedirect('https://agent.acme.com/oauth/other', {}, saved), false)
  assert.equal(isAllowedRedirect('https://agent.acme.com/oauth/callback', {}, []), false)
})

test('honours extra callbacks from the environment', () => {
  const env = { MCP_ALLOWED_REDIRECTS: 'https://cursor.com/cb, https://other.dev/cb' }
  assert.equal(isAllowedRedirect('https://cursor.com/cb', env), true)
  assert.equal(isAllowedRedirect('https://other.dev/cb', env), true)
  assert.equal(isAllowedRedirect('https://cursor.com/other', env), false)
})
