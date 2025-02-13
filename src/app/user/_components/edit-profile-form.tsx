import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@prisma/client"
import { FormEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { editUser } from "@/actions/users/user-actions"
import { toast } from "sonner"
import { updateSession } from "@/lib/session"

const formSchema = z.object({
    username: z.string().min(2).max(30),
    description: z.string().optional()
})



const EditProfileForm = ({ user }: { user: User }) => {


    const[loading,setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: user.username,
            description: user.description || ""
        }
    })

    const  onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            await editUser(values.username , values.description , user.id)
            toast.message("User data updated succesfully")
        } catch (error) {
            if(error instanceof Error){
                toast.error(error.message)
                return
            }
            toast.error("Internal server error")
        }finally{
            setLoading(false)
        }

    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div >
                    <div >
                        <FormField
                            control={form.control}
                            disabled={loading}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Edit your username
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            disabled={loading}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Edit your description
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} type="submit">
                        {
                            loading ? "Updating..." : "Save changes"
                        }
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}

export default EditProfileForm