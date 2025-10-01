import NextAuth from 'next-auth';
import connectDB from '../../../../common/db';
import User from '../../../../database/models/User';
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google"
import { errorMonitor } from 'nodemailer/lib/xoauth2';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials")
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

  ],
  pages: {
    signIn: '/',
    error: "/auth/error"
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {

        token.accessToken = user.accessToken

        // If profile with an email
        if (profile && profile.email) {
          await connectDB();
          let user = await User.findOne({ email: profile.email });

          // Create new user
          if (!user) {
            user = await User.create({
              name: profile.name || profile.email.split("@")[0],
              username: profile.email.split("@")[0],
              email: profile.email,
              password: null,
              role: 'user',
              profile: {},
              subscription: {}
            });

          }
          token.id = user._id.toString();
          token.role = user.role;
          // token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.profile = user.profile;
          token.favorites = user.favorites;
          token.subscription = user.subscription;
        }


      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.profile = token.profile;
        session.user.favorites = token.favorites;
        session.user.subscription = token.subscription;
        session.accessToken = token.accessToken
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };