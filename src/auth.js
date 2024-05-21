import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// Your own logic for dealing with plaintext password strings; be careful!

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/flow/login",
    newUser: "/flow/signup",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async credentials => {
        let user = null;

        // logic to salt and hash password
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id: credentials.username,
            password: credentials.password,
          }),
        });
        if (!authResponse.ok) {
          return null;
        }
        user = await authResponse.json();
        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.");
        }

        // return user object with the their profile data
        return user;
      },
    }),
  ],
});
