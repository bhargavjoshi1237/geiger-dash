const DEFAULT_ROLES = ['strategist', 'researcher', 'critic', 'writer', 'reviewer']

function numberFromEnv(name, fallback) {
  const value = Number(process.env[name])
  return Number.isFinite(value) ? value : fallback
}

function booleanFromEnv(name, fallback = false) {
  const value = process.env[name]
  if (value === undefined) return fallback
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase())
}

function parseProfiles() {
  const rawProfiles = process.env.BLOG_LLM_PROFILES
  if (rawProfiles) {
    try {
      const profiles = JSON.parse(rawProfiles)
      if (Array.isArray(profiles) && profiles.length > 0) {
        return profiles.map((profile, index) => ({
          id: profile.id || `model-${index + 1}`,
          roles: Array.isArray(profile.roles) && profile.roles.length > 0
            ? profile.roles
            : DEFAULT_ROLES,
          baseUrl: profile.baseUrl || process.env.BLOG_LLM_BASE_URL,
          apiKey: profile.apiKey || process.env.BLOG_LLM_API_KEY,
          model: profile.model,
          inputPricePerMillion: Number(profile.inputPricePerMillion || 0),
          outputPricePerMillion: Number(profile.outputPricePerMillion || 0),
        }))
      }
    } catch (error) {
      throw new Error(`BLOG_LLM_PROFILES must be valid JSON: ${error.message}`)
    }
  }

  const models = String(process.env.BLOG_LLM_MODELS || process.env.BLOG_LLM_MODEL || '')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean)

  return models.map((model, index) => ({
    id: `model-${index + 1}`,
    roles: DEFAULT_ROLES,
    baseUrl: process.env.BLOG_LLM_BASE_URL,
    apiKey: process.env.BLOG_LLM_API_KEY,
    model,
    inputPricePerMillion: numberFromEnv('BLOG_LLM_INPUT_PRICE_PER_MILLION', 0),
    outputPricePerMillion: numberFromEnv('BLOG_LLM_OUTPUT_PRICE_PER_MILLION', 0),
  }))
}

export function getBlogAutomationConfig() {
  const profiles = parseProfiles()
  const missingProfile = profiles.find(
    (profile) => !profile.baseUrl || !profile.apiKey || !profile.model
  )

  if (profiles.length === 0 || missingProfile) {
    throw new Error(
      'Configure BLOG_LLM_BASE_URL, BLOG_LLM_API_KEY, and BLOG_LLM_MODEL(S), or BLOG_LLM_PROFILES.'
    )
  }

  return {
    enabled: booleanFromEnv('BLOG_AUTOMATION_ENABLED'),
    autoPublish: booleanFromEnv('BLOG_AUTOMATION_AUTO_PUBLISH'),
    dailyLimit: Math.max(1, numberFromEnv('BLOG_AUTOMATION_DAILY_LIMIT', 10)),
    qualityThreshold: Math.min(
      100,
      Math.max(0, numberFromEnv('BLOG_AUTOMATION_QUALITY_THRESHOLD', 82))
    ),
    maxResearchResults: Math.max(
      3,
      Math.min(20, numberFromEnv('BLOG_AUTOMATION_RESEARCH_RESULTS', 8))
    ),
    authorName: process.env.BLOG_AUTOMATION_AUTHOR_NAME || 'Geiger Research Team',
    defaultCategory: process.env.BLOG_AUTOMATION_DEFAULT_CATEGORY || 'Tutorials',
    seedTopics: String(process.env.BLOG_AUTOMATION_SEED_TOPICS || '')
      .split(',')
      .map((topic) => topic.trim())
      .filter(Boolean),
    search: {
      url: process.env.BLOG_SEARCH_API_URL || 'https://api.tavily.com/search',
      apiKey: process.env.BLOG_SEARCH_API_KEY || '',
    },
    profiles,
  }
}

export function profileForRole(config, role) {
  const matches = config.profiles.filter((profile) => profile.roles.includes(role))
  const available = matches.length > 0 ? matches : config.profiles
  const roleIndex = DEFAULT_ROLES.indexOf(role)
  return available[Math.max(roleIndex, 0) % available.length]
}

