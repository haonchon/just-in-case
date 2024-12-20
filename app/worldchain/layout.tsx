import type { Metadata } from "next";
import { Inter } from "next/font/google";

import MiniKitProvider from "@/components/minikit-provider";


const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen">
 
          <MiniKitProvider>
            <body className={inter.className}>
            
              {children}
   
            </body>
          </MiniKitProvider>
    
    </html>
  );
}
