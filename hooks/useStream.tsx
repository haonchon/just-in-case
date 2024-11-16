import { GetToken } from "@/server/actions/stream";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";

export default function useStream() {
  const session = useSession();

  const { data: token } = useQuery({
    queryKey: ["stream-token", session.data?.user?.id],
    queryFn: () => GetToken(session.data?.user?.id ?? ""),
  });

  if (!token) {
    return null;
  }

  const client = new StreamVideoClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY ?? "",
    user: { id: session.data?.user?.id ?? "" },
    token: token ?? "",
  });

  return client;
}
