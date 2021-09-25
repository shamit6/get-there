import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { getEnv } from '../../../utils/envs'

export default NextAuth({
  jwt: {
    signingKey: getEnv('JWT_SIGNING_PRIVATE_KEY'),
  },
  providers: [
    CredentialsProvider({
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
      credentials: {},
    }),
    GoogleProvider({
      clientId: getEnv('GOOGLE_CLIENT_ID'),
      clientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      try {
        const structuredUrl = new URL(url)
        if (
          structuredUrl.pathname !== '/' &&
          structuredUrl.pathname !== '/login'
        ) {
          return `${baseUrl}?redirect=${structuredUrl.pathname}`
        }
        return baseUrl
      } catch (e) {
        return baseUrl
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  theme: 'light',
})
