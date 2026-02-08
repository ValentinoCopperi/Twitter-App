"use client"

import { Form } from '@/components/ui/form'
import { loginFormSchema, LoginState } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormInput from '../register/_components/form-input'
import { Button } from '@/components/ui/button'
import { loginAction } from '@/actions/users/user-actions'
import { Separator } from '@/components/ui/separator'
import LoginButton from '@/components/login-button'
import Link from 'next/link'

const LoginPage = () => {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, null)

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const fields = [
    { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { name: 'password' as const, label: 'Password', type: 'password', placeholder: '********' },
  ]

  return (
    <div className="max-w-md p-6 mx-auto my-[10vh] space-y-5 bg-white rounded-lg shadow-md dark:bg-gray-800/40">
      <Form {...form}>
        <h1 className='font-semibold'>Login</h1>
        <form action={formAction} className="space-y-6">
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
          <Button type="submit" className="w-full">
            Login
          </Button>
          {state?.errors && (
            <div className="text-red-500 text-sm">
              {Object.entries(state.errors).map(([key, value]) => (
                <p key={key}>{value}</p>
              ))}
            </div>
          )}
          {state?.error && (
            <div className="text-red-500 text-sm">
              <p>{state.error}</p>
            </div>
          )}
          {state?.message && <p className="text-green-500 text-sm">{state.message}</p>}
        </form>

        <div className="my-8">
          <Separator className="my-4" />
          <LoginButton content={"Login with google"}/>
        </div>

        <div className="my-6 text-center">
          <h1 className='font-semibold'>Dont have an account?</h1>
          <Link href={"/register"} className='underline'>
            Create account
          </Link>
        </div>
      </Form>
    </div>
  )
}

export default LoginPage