import test from 'node:test'
import assert from 'node:assert/strict'
import { helpPageTitle } from './paths.js'

test('product help pages name the product so identical titles stay unique', () => {
  assert.equal(helpPageTitle({ slug: 'assets/settings', title: 'Project settings' }), 'Project settings - Geiger Assets Help')
  assert.equal(helpPageTitle({ slug: 'flow/settings', title: 'Project settings' }), 'Project settings - Geiger Flow Help')
})

test('deep pages use the first path segment', () => {
  assert.equal(helpPageTitle({ slug: 'events/speakers/agenda', title: 'Agenda' }), 'Agenda - Geiger Events Help')
})

test('top-level pages keep the Help Center name', () => {
  assert.equal(helpPageTitle({ slug: 'welcome', title: 'Welcome' }), 'Welcome - Geiger Help Center')
})
