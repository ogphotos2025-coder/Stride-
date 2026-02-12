import { NextAuthOptions, Account, User, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: (process.env.GOOGLE_CLIENT_ID || '').trim(),
            clientSecret: (process.env.GOOGLE_CLIENT_SECRET || '').trim(),
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                    scope: 'openid email profile https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.activity.write',
                },
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    // Add logging to see exact errors in Vercel Logs
    logger: {
        error(code, metadata) {
            console.error('NEXTAUTH_ERROR', code, metadata)
        },
        warn(code) {
            console.warn('NEXTAUTH_WARN', code)
        },
        debug(code, metadata) {
            console.log('NEXTAUTH_DEBUG', code, metadata)
        },
    },
    callbacks: {
        async jwt({ token, account, user }: { token: JWT; account: Account | null; user?: User }) {
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = account.expires_at
            }
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.accessToken = token.accessToken as string
            session.user.id = token.id as string
            return session
        },
    },
    debug: true,
}
