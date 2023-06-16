import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { getEnv } from 'utils/envs'
import { prismaClient } from 'utils/prisma'
import { User } from 'utils/types'

async function upsertUser({
  email,
  name,
  image,
}: Pick<User, 'email' | 'name' | 'image'>) {
  try {
    await prismaClient.$connect()
    await prismaClient.user.upsert({
      where: { email },
      create: { email, name, image },
      update: { name, image },
    })
  } finally {
    await prismaClient.$disconnect()
  }
}

export const nextAuthOptions: AuthOptions = {
  jwt: {
    secret: getEnv('JWT_SIGNING_PRIVATE_KEY'),
  },
  providers: [
    CredentialsProvider({
      id: 'demo',
      name: 'Credentials',
      authorize() {
        const user = {
          id: 'demo',
          email: 'demo@dummy.com',
          name: 'Dummy Demo',
          image:
            'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/V8BNOaftJmYSAdW0ROdfRQw4cuWPEXxKwCLcDEAEiGQoBRBD___________8BGJ6i0f_______wE/s72-c-k-no/photo.jpg',
        }
        return user
      },
      credentials: {},
    }),
    GoogleProvider({
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await upsertUser({
          email: user.email!,
          name: user.name!,
          image: user.image!,
        })
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        const structuredUrl = new URL(url)
        const redirectPath = structuredUrl.searchParams.get('redirect')
        return redirectPath ? `${baseUrl}${redirectPath}` : baseUrl
      } catch (e) {
        return baseUrl
      }
    },
  },
  pages: {
    signIn: '/login',
  },
}
