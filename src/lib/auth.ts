import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
});

export async function getCurrentUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return null;
  }

  // Create default chatbot for new users if they don't have one
  const chatbot = await prisma.chatbot.findFirst({
    where: { userId: user.id },
  });

  if (!chatbot) {
    await prisma.chatbot.create({
      data: {
        userId: user.id,
        name: "הצ'אטבוט שלי",
        systemPrompt: "אתה עוזר וירטואלי מועיל. ענה על שאלות בצורה ברורה ומועילה בעברית.",
        welcomeMessage: "שלום! איך אוכל לעזור לך היום?",
      },
    });
  }

  return user;
}
