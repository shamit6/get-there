import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { prismaClient } from '../../../utils/prisma'

export default NextAuth({
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  providers: [
    Providers.Credentials({
      id: 'demo',
      name: 'Credentials',
      async authorize() {
        const user = {
          email: 'demo@dummy.com',
          name: 'Dummy Demo',
          image:
            'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/V8BNOaftJmYSAdW0ROdfRQw4cuWPEXxKwCLcDEAEiGQoBRBD___________8BGJ6i0f_______wE/s72-c-k-no/photo.jpg',
        }
        return user
      },
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const { email, name, image } = user

      async function upsertUser() {
        try {
          await prismaClient.$connect()
          await prismaClient.user.upsert({
            where: { email: email! },
            create: { email: email!, name, image },
            update: { name, image },
          })
        } catch (e) {
          throw e
        } finally {
          await prismaClient.$disconnect()
        }
      }
      upsertUser()

      return true
    },
    async redirect(url, baseUrl) {
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
  },
  theme: 'light',
})
