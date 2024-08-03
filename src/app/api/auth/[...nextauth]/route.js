import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
export const authoptions = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      })
    ],
  })
export {authoptions as GET, authoptions as POST}