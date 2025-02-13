"use client"

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider"
import { Toaster } from "./ui/sonner";
import { motion } from 'framer-motion';


const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration:1.3}}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SessionProvider>
                {children}
            </SessionProvider>
            <Toaster/>
        </ThemeProvider>
            
        </motion.div>
    )
}

export default Providers;