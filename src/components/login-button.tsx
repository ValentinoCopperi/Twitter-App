"use client"

import { Button } from "@/components/ui/button"
import { signIn  } from "next-auth/react"
import Image from "next/image"


const LoginButton = ({content}:{content:string}) => {


    return (
        <Button onClick={() => signIn("google")} variant="secondary" className="w-full">
            <Image src={"/google.png"} height={20} width={20} alt="google-icon"/>
            {content}
        </Button>
    )
}

export default LoginButton