import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreatePostState } from '@/types/create-post'
import React from 'react'

interface Props {
    name : "title" | "description"
    state : CreatePostState
    loading : boolean
}

const TextInput = ({name , state , loading} : Props) => {
    return (
        <div>
            <FormField
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-semibold"> Insert {name} </FormLabel>
                        <FormControl>
                            <div className='relative'>
                                <Input
                                    {...field}
                                    disabled={loading}
                                    type="text"
                                    placeholder={`Your post ${name}...`}
                                />
                            </div>

                        </FormControl>

                        <div > 
                            {state?.errors?.[name] && (
                                <FormMessage className="text-red-500">
                                    {state.errors?.[name].join(', ')}
                                </FormMessage>
                            )}
                        </div>
                    </FormItem>
                )}
            />
        </div>
    )
}

export default TextInput