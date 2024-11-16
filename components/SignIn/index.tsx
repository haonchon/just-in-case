"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";

// import  {signInWithWallet} from "@/utils/utils"
import { cookies } from "next/headers";
import { NONCE, signInWithWallet } from "@/utils/utils";
import { PayButton } from "../Pay";

export const SignIn = () => {
  const { data: session,update,status } = useSession();
  console.log({session})
  console.log({status})
  
  return (
    // <Card className="w-full max-w-md">
    //   <CardHeader>
    //     <CardTitle>Authentication</CardTitle>
    //   </CardHeader>
    //   <CardContent className="flex flex-col items-center gap-4">
    <>
        {session ? (
          <>
            <p className="text-muted-foreground">
              Signed in as{" "}
              <span className="font-medium text-foreground">
                {session?.user?.name}
              </span>
            </p>
            {(!session.user.walletAddress ) && (<Button onClick={async ()=>{
              await signInWithWallet()
              await update()
              }}>Wallet Connect</Button>)}
            <Button variant="destructive" onClick={() => signOut()}>
              Sign out
            </Button>
            <PayButton/>
          </>
        ) : ( 
          <>
            {/* <p className="text-muted-foreground">Not signed in</p> */}
            <Button  onClick={() => signIn('worldcoin')}>Sign in with Worldcoin</Button>
          </>
        )}
        </>
    //   </CardContent>
    // </Card>
  );
};
