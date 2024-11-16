
import {
    MiniKit,
    tokenToDecimals,
    Tokens,
    PayCommandInput,
    ResponseEvent,
    MiniAppPaymentPayload,
  } from "@worldcoin/minikit-js";
// export const signInWithWallet = async () => {
// 	const res = await fetch(`/api/nonce`)
// 	const { nonce } = await res.json()

// 	const generateMessageResult = MiniKit.commands.walletAuth({
// 		nonce: nonce,
// 		requestId: '0', // Optional
// 		expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
// 		notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
// 		statement: 'This is my statement and here is a link https://worldcoin.com/apps',
// 	})
// }

export const signInWithWallet = async () => {
	if (!MiniKit.isInstalled()) {
		return
	}

	const res = await fetch(`/api/nonce`)
	const { nonce } = await res.json()

	const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth({
		nonce: nonce,
		requestId: '0', // Optional
		expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
		statement: 'This is my statement and here is a link https://worldcoin.com/apps',
	})

	if (finalPayload.status === 'error') {
		return
	} else {
		const response = await fetch('/api/complete-siwe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				payload: finalPayload,
				nonce,
			}),
		})
        
        console.log("response",response)
   
	}
}


export const sendPayment = async () => {
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
    return finalPayload
}

export const NONCE = "jskdjdksfhlsfjslfjldsfjklsdjfh"