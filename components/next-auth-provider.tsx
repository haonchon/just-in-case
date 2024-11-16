"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
const queryClient = new QueryClient();

export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {" "}
        <>{children} </>
      </SessionProvider>
    </QueryClientProvider>
  );
}
