// src/auth.config.ts

export const authConfig = {
  pages: {
    signIn: "/flow/login",
    newUser: "/flow/signup",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Check if the user is authenticated
      const isLoggedIn = !!auth?.user;
      // Initialize protected routes
      // Here, all routes except the login page is protected
      const isOnProtected = !nextUrl.pathname.startsWith("/flow/login") && !nextUrl.pathname.startsWith("/flow/signup");

      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false; // redirect to /login
      } else if (isLoggedIn) {
        // redirected to homepage
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
};
