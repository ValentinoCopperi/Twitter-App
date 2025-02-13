import { z } from "zod"

export type CreatePostState =
| {
    errors?: {
        title?: string[]
        description?: string[]
        category?: string[]
    }
    message?: {message : string , error : boolean}
}
| undefined | null

export const createPostSchema = z.object({
    title: z.string().min(3).max(30),
    description: z.string().optional(),
    category: z.string().nonempty({message : 'Category is required'}),
})