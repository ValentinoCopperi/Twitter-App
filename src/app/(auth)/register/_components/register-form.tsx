"use client"

import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod"
import FormInput from "./form-input";
import { Button } from "@/components/ui/button";
import { registerAction } from "@/actions/users/user-actions";
import { registerFormSchema } from "@/types/auth";
import { Separator } from "@/components/ui/separator";
import LoginButton from "@/components/login-button";
import Link from "next/link";



const RegisterForm = () => {
    const [state, formAction] = useFormState(registerAction, null)

    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const fields = [
        { name: 'username' as const, label: 'Username', type: 'text', placeholder: 'Your username' },
        { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'email@example.com' },
        { name: 'password' as const, label: 'Password', type: 'password', placeholder: '********' },
        { name: 'confirmPassword' as const, label: 'Confirm Password', type: 'password', placeholder: '********' },
    ]

    return (
        <div className="max-w-md p-6 mx-auto my-[10vh] space-y-5 bg-white rounded-lg shadow-md dark:bg-gray-800/40">

            <Form {...form}>
            <h1 className='font-semibold'>Register</h1>
                <form action={formAction} className="space-y-5">
                    {fields.map((field) => (
                        <FormInput
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            placeholder={field.placeholder}
                            control={form.control}
                        />
                    ))}
                    <Button type="submit" className="w-full">Register</Button>
                    {state?.errors && (
                        <div className="text-red-500">
                            {Object.entries(state.errors).map(([key, value]) => (
                                <p key={key}>{value}</p>
                            ))}
                        </div>
                    )}
                    {
                        state?.error && (
                            <div className="text-red-500">
                                <p>{state.error}</p>
                            </div>
                        )
                    }
                    {state?.message && <p className="text-green-500">{state.message}</p>}
                </form>


                <div className="my-6">
                    <Separator className="my-4" />
                    <LoginButton content={"Register with google"} />
                </div>

                <div className="my-6 text-center">
                    <h1 className='font-semibold'>Aleady have an account?</h1>
                    <Link href={"/login"} className='underline'>
                        Login here
                    </Link>
                </div>
            </Form>
        </div>

    )
}

export default RegisterForm