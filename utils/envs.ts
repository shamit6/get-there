interface Envs {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  JWT_SIGNING_PRIVATE_KEY: string
}

export function getEnv(name: keyof Envs): string {
  if (!process.env[name]) {
    throw new Error(`Can't find env var "${name}"`)
  }
  return process.env[name]!
}
