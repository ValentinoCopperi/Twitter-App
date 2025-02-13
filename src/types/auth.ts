import { z } from "zod";

export const registerFormSchema = z.object({
    username: z.string().min(2).max(30),
    email: z.string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),

}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ['confirmPassword']
        });
    }
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>


export type RegisterState =
    | {
        errors?: {
            username?: string[]
            email?: string[]
            password?: string[]
            confirmPassword?: string[]
        }
        message?: string,
        error?: string
    }
    | undefined | null


export const loginFormSchema = z.object({
    email: z.string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: z.string().min(4),

})

export type LoginFormSchema = z.infer<typeof loginFormSchema>


export type LoginState =
    | {
        errors?: {
            email?: string[]
            password?: string[]
        }
        message?: string,
        error?: string
    }
    | undefined | null