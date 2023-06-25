type TConfig = {
  appName: string
  clientUrl: string
  serverUrl: string
  jwtVerificationLifespan: string
  sessionLifespan: string
}

// appName must not have spaces will be used to name session

const config: TConfig = {
  appName: 'nodejs-api-passport-auth',
  clientUrl: 'http://localhost:5173',
  serverUrl: 'http://localhost:5000',
  jwtVerificationLifespan: '2m',
  sessionLifespan: '2m',
}

export default config
