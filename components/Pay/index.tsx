"use client";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
  ResponseEvent,
  MiniAppPaymentPayload,
} from "@worldcoin/minikit-js";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

const sendPayment = async () => {
  const res = await fetch("/api/initiate-payment", {
    method: "POST",
  });

  const { id } = await res.json();

  const payload: PayCommandInput = {
    reference: id,
    to: "0x8b5E4bA136D3a483aC9988C20CBF0018cC687E6f",
    tokens: [ 
      {
        symbol: Tokens.USDCE,
        token_amount: tokenToDecimals(0.1, Tokens.USDCE).toString(),
      },
    ],
    description: "Watch this is a test",
  };

  
  // if (MiniKit.isInstalled(true)) {
  //   console.log("MiniKit is not installed");
  //   return
  // }

  const { finalPayload } = await MiniKit.commandsAsync.pay(payload)
  console.log({finalPayload})
  if (finalPayload.status == 'success') {
    const res = await fetch(`/api/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({payload:finalPayload}),
    })
    const payment = await res.json()
    if (payment.success) {
      // Congrats your payment was successful!
    }
  }
};

export const PayButton = () => {
  // const sendTransaction = async () => {
  //   if (!MiniKit.isInstalled()) {
  //     return;
  //   }
  
  //   const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString()
  
  //   // Transfers can also be at most 1 hour in the future.
  //   const permitTransfer = {
  //     permitted: {
  //       token: Tokens.USDCE,
  //       amount: tokenToDecimals(0.01, Tokens.USDCE).toString(),

  //     },
  //     nonce: Date.now().toString(),
  //     deadline,
  //   }
  
  //   const permitTransferArgsForm = [
  //     [permitTransfer.permitted.token, permitTransfer.permitted.amount],
  //     permitTransfer.nonce,
  //     permitTransfer.deadline,
  //   ]
  
  //   const transferDetails = {
  //     to: '0x8b5E4bA136D3a483aC9988C20CBF0018cC687E6f',
  //     requestedAmount: tokenToDecimals(0.01, Tokens.USDCE).toString(),
  //   }
  
  //   const transferDetailsArgsForm = [transferDetails.to, transferDetails.requestedAmount]
  
  //   const {commandPayload, finalPayload} = await MiniKit.commandsAsync.sendTransaction({
  //     transaction: [
  //       {
  //         address: '',
  //         abi: erc,
  //         functionName: 'signatureTransfer',
  //         args: [permitTransferArgsForm, transferDetailsArgsForm, 'PERMIT2_SIGNATURE_PLACEHOLDER_0'],
  //       },
  //     ],
  //     permit2: [
  //       {
  //         ...permitTransfer,
  //         spender: '0x34afd47fbdcc37344d1eb6a2ed53b253d4392a2f',
  //       },
  //     ],
  //   })
  // }
  
  // useEffect(() => {
  //   if (!MiniKit.isInstalled()) {
  //     console.error("MiniKit is not installed");
  //     return;
  //   }

  //   MiniKit.subscribe(
  //     ResponseEvent.MiniAppPayment,
  //     async (response: MiniAppPaymentPayload) => {
  //       if (response.status == "success") {
  //         const res = await fetch(`/api/confirm-payment`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ payload: response }),
  //         });
  //         const payment = await res.json();
  //         if (payment.success) {
  //           console.log("SUCCESS!");
  //         } else {
  //           console.log("FAILED!");
  //         }
  //       }
  //     }
  //   );

  //   return () => {
  //     MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
  //   };
  // }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Make Payment</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Button onClick={sendPayment} variant="default" className="w-full">
          <Wallet className="mr-2" />
          Pay with World ID
        </Button>
      </CardContent>
    </Card>
  );
};
