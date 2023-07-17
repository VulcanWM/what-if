import GithubProvider from "next-auth/providers/github"
import NextAuth from 'next-auth'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions);