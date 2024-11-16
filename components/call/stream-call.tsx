"use client";

import { StreamCall } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { MyControlsPanel } from "./controls";
import { MyDescriptionPanel } from "./description";
import { MyParticipantsPanel } from "./participants";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import useStream from "@/hooks/useStream";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function StreamCallComponent({ callId }: { callId: string }) {
  const client = useStream();
  const session = useSession();
  if (!client) {
    return null;
  }
  const call = client.call("audio_room", callId);
  call
    .getOrCreate({
      data: {
        video: false,
        members: [{ user_id: session.data?.user?.id ?? "" }],
        settings_override: {
          audio: {
            access_request_enabled: true,
            speaker_default_on: true,
            mic_default_on: true,
            default_device: "speaker",
          },
        },
        custom: {
          title: callId,
          description: "Talking about React",
        },
      },
    })
    .then((res) => {
      console.log(res, "res");
    });

  //   useEffect(() => {
  //     if (!client) {
  //       return;
  //     }

  //     const createCall = async () => {
  //       try {
  //         console.log(call, "call");

  //       } catch (error) {
  //         console.error("Error creating or getting call:", error);
  //       }
  //     };

  //     createCall();
  //   }, [client, callId, session.data?.user?.id]);

  return (
    <StreamCall call={call}>
      <div className="ui-layout">
        <MyDescriptionPanel />
        <MyParticipantsPanel />
        <MyControlsPanel />
      </div>
    </StreamCall>
  );
}
