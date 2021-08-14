import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { prismaClient } from '../../../utils/prisma'

export default NextAuth({
  providers: [
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
    signIn: '/auth/signin',
  },
  theme: 'light',
})
