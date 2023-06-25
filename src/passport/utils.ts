export function isValidProvider(provider: string | undefined) {
  if (
    provider === 'google' ||
    provider === 'facebook' ||
    provider === 'twitter' ||
    provider === 'github'
  )
    return true

  return false
}

export function getOptions(provider: string) {
  switch (provider) {
    case 'google':
      return {
        scope: ['profile', 'email'],
      }
    case 'facebook':
      return {
        scope: ['email'],
      }
    case 'twitter':
      return {}
    case 'github':
      return {
        scope: ['user:email'],
      }
    default:
      return {}
  }
}

export function getInfoFromProfile(profile: any):
  | {
      provider: string
      id: string
      name: string
      email: string
    }
  | undefined {
  switch (profile.provider) {
    case 'google':
      return {
        provider: profile.provider,
        id: profile.id.toString(),
        name: profile.displayName,
        email: profile._json.email,
      }
    case 'facebook':
      return {
        provider: 'facebook',
        id: profile.id.toString(),
        name: profile._json.first_name + ' ' + profile._json.last_name,
        email: profile._json.email,
      }
    case 'twitter':
      return {
        provider: 'twitter',
        id: profile.id.toString(),
        name: profile.displayName,
        email: profile.emails[0].value,
      }
    case 'github':
      return {
        provider: 'github',
        id: profile.id.toString(),
        name: profile.displayName,
        email: profile.emails[0].value,
      }
    default:
      return undefined
  }
}
