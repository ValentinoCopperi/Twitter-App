"use client"

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import React, { useActionState, useEffect } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Form} from '@/components/ui/form'
import { createPost } from '@/actions/posts/post-actions'
import TextInput from './text-input'
import { CreatePostState, createPostSchema } from "@/types/create-post"
import CategoryInput from './category-input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import LoginButton from '@/components/login-button'



type Names = "title" | "description"
const names: Names[] = ["title", "description"]

const CreatePostForm = () => {


    const [state, action,loading] = useActionState<CreatePostState, FormData>(createPost, null)
    const router = useRouter()
    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema)
    })
    
    useEffect(() => {
        if(state?.message?.error && state.message.message){
            toast.error(state.message.message)
        }else if(state?.message?.message && !state.message.error){
            toast.success(state.message.message)
        }

        router.refresh()

    },[state,router])


    return (
        <Card className="w-full  my-4  bg-slate-300/10 dark:bg-gray-950/80 border-gray-700/15 shadow-sm  dark:shadow-gray-600 " >
            <CardHeader>
                <CardTitle className='text-primary'>Create Post</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form action={action}>
                        <div className="grid w-full items-center">
                            <div className="flex flex-col ">
                                {
                                    names.map(name => (
                                        <TextInput key={name} name={name} state={state} loading={loading} />
                                    ))
                                }
                            </div>
                            <CategoryInput form={form} formState={state} loading={loading}/>
                        </div>
                        <div className="flex justify-end py-3 ">
                            <Button type='submit' className='w-[20%]' disabled={loading}>
                                {
                                    loading ? "Creating..." : "Create"
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreatePostForm