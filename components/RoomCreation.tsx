"use client";

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import {sendPayment} from "@/utils/utils"
export default function CreateRoomForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<boolean>(true)
  const router = useRouter()
  const handlePay = ()=>{
    sendPayment().then((res)=>{
      if(res.status === "success"){
        setPaymentStatus(true)
      }
      
    })
  }

  const handleCreateRoom = async () => {
    setIsLoading(true)
    setError(null)
    
    

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
     
      router.push(`rooms/${data.roomId}`); // Redirect to the newly created room
    } catch (err) {
      setError("An error occurred while creating the room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create a New Room</CardTitle>
      </CardHeader>
      <CardContent>
        {/* { paymentStatus ?<Button 
          onClick={handleCreateRoom} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating...' : 'Create Room'}
        </Button> : <Button onClick={handlePay} className="w-full">Pay 0.1 USDCE to create room</Button>}
        {error && (
          <p className="text-red-500 mt-2 text-sm">{error}</p>
        )} */}
        <Button 
          onClick={handleCreateRoom} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating...' : 'Create Room'}
        </Button>
      </CardContent>
    </Card>
  );
}
