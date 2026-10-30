// Decides whether an org's identity provider may sign in a given email. Pure.

function domainOf(email) {
  const parts = String(email || '').trim().toLowerCase().split('@')
  return parts.length === 2 && parts[0] ? parts[1] : ''
}

// The email must sit on a domain the org listed for this provider.
export function isEmailOnOrgDomain(email, emailDomains) {
  const domain = domainOf(email)
  if (!domain || !Array.isArray(emailDomains)) return false
  return emailDomains.some((allowed) => String(allowed || '').trim().toLowerCase() === domain)
}

// A provider may create new accounts, but may only sign in an existing account that already belongs to the org.
export function canSignInViaOrgProvider({ created, isMember }) {
  return Boolean(created || isMember)
}
