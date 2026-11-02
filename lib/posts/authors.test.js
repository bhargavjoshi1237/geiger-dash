import test from 'node:test'
import assert from 'node:assert/strict'
import { authorSameAs, normalizeAuthorInput } from './authors.js'

const valid = {
  name: ' Ada Lovelace ',
  role: 'Engineer',
  bio: 'Writes about forms.',
  avatarUrl: 'https://example.com/ada.jpg',
  links: { website: 'https://ada.dev', github: 'https://github.com/ada', x: '', linkedin: '' },
}

test('a valid author is trimmed, slugged from the name and keeps only filled links', () => {
  const { ok, values } = normalizeAuthorInput(valid)
  assert.equal(ok, true)
  assert.equal(values.name, 'Ada Lovelace')
  assert.equal(values.slug, 'ada-lovelace')
  assert.equal(values.avatar_url, 'https://example.com/ada.jpg')
  assert.deepEqual(values.links, [
    { label: 'Website', url: 'https://ada.dev/' },
    { label: 'GitHub', url: 'https://github.com/ada' },
  ])
})

test('a hand-written slug must be URL safe', () => {
  assert.equal(normalizeAuthorInput({ ...valid, slug: 'ada-l' }).values.slug, 'ada-l')
  assert.equal(normalizeAuthorInput({ ...valid, slug: 'Ada L!' }).ok, false)
})

test('a name and a bio are required', () => {
  assert.equal(normalizeAuthorInput({ ...valid, name: ' ' }).ok, false)
  assert.equal(normalizeAuthorInput({ ...valid, bio: '' }).ok, false)
})

test('text that reaches JSON-LD can not contain tags', () => {
  assert.equal(normalizeAuthorInput({ ...valid, bio: '</script><script>alert(1)</script>' }).ok, false)
  assert.equal(normalizeAuthorInput({ ...valid, role: '<b>x</b>' }).ok, false)
})

test('avatars and links must be HTTPS', () => {
  assert.equal(normalizeAuthorInput({ ...valid, avatarUrl: 'http://example.com/a.jpg' }).ok, false)
  assert.equal(normalizeAuthorInput({ ...valid, links: { website: 'javascript:alert(1)' } }).ok, false)
  assert.equal(normalizeAuthorInput({ ...valid, avatarUrl: '' }).values.avatar_url, null)
})

test('sameAs lists the profile links', () => {
  assert.deepEqual(authorSameAs({ links: [{ label: 'GitHub', url: 'https://github.com/ada' }] }), ['https://github.com/ada'])
  assert.deepEqual(authorSameAs({ links: null }), [])
})
