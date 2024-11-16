"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel;
};

const verifyPayload: VerifyCommandInput = {
  action: "test-action",
  signal: "",
  verification_level: VerificationLevel.Orb,
};

const triggerVerify = () => {
  MiniKit.commands.verify(verifyPayload);
};

export const VerifyBlock = () => {
  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    MiniKit.subscribe(
      ResponseEvent.MiniAppVerifyAction,
      async (response: MiniAppVerifyActionPayload) => {
        if (response.status === "error") {
          console.log("Error payload", response);
          return;
        }

        const verifyResponse = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: response as ISuccessResult,
            action: verifyPayload.action,
            signal: verifyPayload.signal,
          }),
        });

        const verifyResponseJson = await verifyResponse.json();
        if (verifyResponseJson.status === 200) {
          console.log("Verification success!");
        }
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Identity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Button onClick={triggerVerify} className="w-full">
          <Shield className="mr-2" />
          Verify with World ID
        </Button>
      </CardContent>
    </Card>
  );
};
