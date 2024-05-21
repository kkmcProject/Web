"use client";

import { useEffect } from "react";

export const MSWComponent = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (process.env.NEXT_PUBLIC_API_MOCIKNG === "enabled") {
        require("@/mocks/browser");
      }
    }
  }, []);
  return null;
};
