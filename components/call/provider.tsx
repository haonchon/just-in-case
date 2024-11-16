'use client'
import { StreamVideo } from "@stream-io/video-react-sdk";
import useStream from "@/hooks/useStream";

export const StreamProvider = ({ children }: { children: React.ReactNode }) => {
  const client = useStream();
  if (!client) {
    return null;
  }
  return <StreamVideo client={client}>{children}</StreamVideo>;
};
