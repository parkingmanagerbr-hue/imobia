import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { agency: true },
        })

        if (!user) throw new Error('Usuário não encontrado')

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) throw new Error('Senha incorreta')

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          agencyId: user.agencyId,
          plan: user.plan,
          planStatus: user.planStatus,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id: string; role: string; agencyId: string | null; plan: string; planStatus: string }
        token.id = u.id
        token.role = u.role
        token.agencyId = u.agencyId
        token.plan = u.plan
        token.planStatus = u.planStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        const s = session.user as Record<string, unknown>
        s.id = token.id
        s.role = token.role
        s.agencyId = token.agencyId
        s.plan = token.plan
        s.planStatus = token.planStatus
      }
      return session
    },
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
}
