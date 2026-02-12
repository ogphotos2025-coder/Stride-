import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@next-auth/supabase-adapter' // Import the adapter

// Initialize Supabase client for the adapter (using service_role key)
const SUPABASE_URL = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '');

if (!SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read',
        },
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: SUPABASE_URL,
    secret: SUPABASE_SERVICE_ROLE_KEY,
  }), // Use the Supabase Adapter
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) { // Restore 'account' parameter
      // Persist the OAuth access_token and the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token // Store provider's access token
      }
      // The adapter populates user.id with the Supabase UUID
      if (user) {
        token.id = user.id // Store Supabase UUID
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, such as an access_token and user id from a JWT
      session.accessToken = token.accessToken
      session.user.id = token.id as string // Assign the Supabase UUID as the user ID
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
