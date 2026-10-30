import test from 'node:test'
import assert from 'node:assert/strict'
import { canSignInViaOrgProvider, isEmailOnOrgDomain } from './email-policy.js'

test('accepts an email on a listed domain, ignoring case', () => {
  assert.equal(isEmailOnOrgDomain('Sam@Acme.com', ['acme.com']), true)
})

test('rejects an email outside the listed domains', () => {
  assert.equal(isEmailOnOrgDomain('victim@gmail.com', ['acme.com']), false)
})

test('rejects lookalike domains and subdomains', () => {
  assert.equal(isEmailOnOrgDomain('a@acme.com.evil.io', ['acme.com']), false)
  assert.equal(isEmailOnOrgDomain('a@sub.acme.com', ['acme.com']), false)
})

test('rejects malformed emails and missing domain lists', () => {
  assert.equal(isEmailOnOrgDomain('a@b@acme.com', ['acme.com']), false)
  assert.equal(isEmailOnOrgDomain('@acme.com', ['acme.com']), false)
  assert.equal(isEmailOnOrgDomain('', ['acme.com']), false)
  assert.equal(isEmailOnOrgDomain('a@acme.com', undefined), false)
})

test('an existing account outside the org cannot be signed in by its provider', () => {
  assert.equal(canSignInViaOrgProvider({ created: false, isMember: false }), false)
  assert.equal(canSignInViaOrgProvider({ created: false, isMember: true }), true)
  assert.equal(canSignInViaOrgProvider({ created: true, isMember: false }), true)
})
