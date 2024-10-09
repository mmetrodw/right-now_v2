import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { getUserByEmail } from "@/data/users";

export const {
		handlers: { GET, POST },
		auth,
		signIn,
		signOut
} = NextAuth({
		session: {
			strategy: "jwt",
		},
		providers: [
			CredentialsProvider({
				async authorize(credentials) {
					if(credentials === null) return null;

					try {
						const user = getUserByEmail(credentials?.email);
						console.log(user);
						if(user) {
							const isMatch = user?.password === credentials.password;

							if(isMatch) {
								return user;
							} else {
								throw new Error("Email or Password is not correct");
							}
						} else {
							throw new Error("User not found");
						}

					} catch (error) {
						throw new Error(error);
					}
				},
			}),
			GoogleProvider({
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				authorization: {
					params: {
						promt: "consent",
						access_type: "offline",
						response_type: "code",
					},
				},
			}),
		],
		callbacks: {
			jwt({ token, user }) {
				if (user) { // User is available during sign-in
					token.id = user.id;
					token.name = user.name;
					token.custom = 'sdfsdfsdf';
				}console.log("JWT Token:", token)
				return token;
			},
			session({ session, token }) {
				session.user.id = token.id;
				session.user.custom = token.custom;
				session.user.customwwwwwwwww = token.name;
				return session;
			},
		},
});