// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { cookies } from "next/headers";
// import cookie from "cookie";
// // Your own logic for dealing with plaintext password strings; be careful!

// export const {
//   handlers: { GET, POST },
//   signIn,
//   signOut,
//   auth,
// } = NextAuth({
//   pages: {
//     signIn: "/flow/login",
//     newUser: "/flow/signup",
//   },
//   callbacks: {
//     jwt({ token }) {
//       console.log("auth.js jwt", token);
//       return token;
//     },
//     session({ session, newSession, user }) {
//       console.log("auth.js session", session, newSession, user);
//       return session;
//     },
//   },
//   providers: [
//     Credentials({
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       credentials: {
//         username: { label: "Username", type: "text", placeholder: "jsmith" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async credentials => {
//         let user = null;
//         console.log("아무거나");
//         // logic to salt and hash password
//         const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
//           method: "post",
//           headers: {
//             "Content-type": "application/json",
//           },
//           body: JSON.stringify({
//             id: credentials.username,
//             password: credentials.password,
//           }),
//           credentials: "include",
//         });
//         let setCookie = authResponse.headers.get("Set-Cookie");
//         console.log("set-cookie", setCookie);
//         if (setCookie) {
//           console.log("authResponse는", authResponse);
//           const parsed = cookie.parse(setCookie);
//           cookies().set("connect.sid", parsed["connect.sid"], parsed); // 브라우저에 쿠키를 심어주는 것
//         }

//         if (!authResponse.ok) {
//           return null;
//         }
//         if (authResponse.rowCount > 0) {
//           console.log("Login Success");
//         }
//         user = await authResponse.json();

//         if (!user) {
//           throw new Error("User not found.");
//         }
//         console.log(user);

//         // return user object with the their profile data
//         return user;
//       },
//     }),
//   ],
// });

import { cookies } from "next/headers";
import cookie from "cookie";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        id: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials.id && credentials.password) {
          let user = null;

          const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
            method: "post",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              id: credentials.id,
              password: credentials.password,
            }),
            credentials: "include",
          });
          let setCookie = authResponse.headers.get("Set-Cookie");
          if (setCookie) {
            const parsed = cookie.parse(setCookie);
            cookies().set("connect.sid", parsed["connect.sid"], parsed);
          }

          // Failed logging in
          if (!authResponse.ok) {
            return null;
          }
          user = await authResponse.json();

          if (!user) {
            throw new Error("User not found.");
          }
          console.log(user);
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});
