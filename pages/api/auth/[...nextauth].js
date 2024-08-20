import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/mongodb"

const ADMIN_EMAILS = [
  "pereverziev.andrii@gmail.com",
  "y4t6official@gmail.com"
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    async session({ session }) {

      if (ADMIN_EMAILS.includes(session.user.email)) {
        return session;
      }
      
      return false;
    }
  }
}

export const isAdminRequest = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (ADMIN_EMAILS.includes(session?.user?.email)) {

  } else {
    res.status(401);
    res.end();
  }
}

export default NextAuth(authOptions)