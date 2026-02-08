"use server"

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession, updateSession } from "@/lib/session";
import { loginFormSchema, LoginState, registerFormSchema, RegisterState } from "@/types/auth";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";



export const getFollowedUsers = async (id: string) => {

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                following: true,
            }
        });

        if (!user || !user.following) {
            return [];
        }

        return user.following;
    } catch (error) {
        console.error("Error getting followed user IDs:", error);
        return [];
    }

}

export const getUserById = async (id: string | undefined): Promise<User | null> => {
    try {

        if (!id) return null;

        const user = await prisma.user.findFirst({ where: { id } })

        if (!user) return null;

        return user;
    } catch (error) {
        console.error(error)
        return null;
    }
}
export const getUserByUsername = async (username: string | undefined): Promise<User | null> => {
    try {

        if (!username) return null;

        const user = await prisma.user.findFirst({ where: { username } })

        if (!user) return null;

        return user;
    } catch (error) {
        console.error(error)
        return null;
    }
}
export const getUsersByUsername = async (query: string): Promise<User[] | null> => {
    try {
        const users = await prisma.user.findMany({
            where: {
                username: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            take: 10
        });

        return users || null;
    } catch (error) {
        console.error('Error searching users:', error);
        return null;
    }
};


interface UserByNextAuth {
    id: string | null | undefined;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
}

export const nextAuthAuthentication = async (user: UserByNextAuth) => {


    try {

        if (!user.id || !user.name || !user.email) return false;

        

        const existingUser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })

        if (existingUser) {
            await createSession({ id: existingUser.id, email: existingUser.email, username: existingUser.username, image: existingUser.image || "" })
            return existingUser;
        }

        const newUser = await prisma.user.create({
            data: {
                username: user.name,
                email: user.email,
                image: user.image,
                password: `next-auth-password-${user.id}`
            }
        })

        await createSession({ id: newUser.id, email: newUser.email, username: newUser.username })

        return newUser;

    } catch (error) {
        console.error(error)
        return false;
    }

}

export const editUser = async (username: string, desc: string | undefined, userId: string) => {

    try {

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username: username,
                description: desc
            }
        })


        await updateSession({
            id: userId,
            username: username,
            email: user.email,
            image: user.image || ""
        })
    } catch (error) {
        console.log(error)
        throw new Error("Internal server error")


    }

}

export const logoutAction = async () => {

    try {
        await deleteSession()
    } catch (error) {
        console.log(error)
        throw new Error("Error on logout action")
    }

}


export const registerAction = async (prevState: RegisterState, formData: FormData): Promise<RegisterState> => {

    const validatedFields = registerFormSchema.safeParse({
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, username, password } = validatedFields.data


    if (!email || !username || !password) {
        return { error: "Please complete all the fields" }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        })
        await createSession({
            id: user.id,
            email: user.email,
            username: user.username,
            image: user.image || ""
        })


    } catch (error:any) {
        if (error.code === 'P2002') {
            // This error code indicates a unique constraint violation
            if (error.meta?.target?.includes('username')) {
                return { errors: { username: ["This username is already taken"] } }
            } else if (error.meta?.target?.includes('email')) {
                return { errors: { email: ["This email is already registered"] } }
            }
        }
        return { error: "An error occurred during registration" }
    }

    redirect("/")

}

export const loginAction = async (prevState: LoginState, formData: FormData): Promise<LoginState> => {

    const validatedFields = loginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    try {
        
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(!user) {
            return {error : "User does not exist"}
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if(!passwordMatch){
            return {error : "Invalid password"}
        }

        await createSession({
            id: user.id,
            email: user.email,
            username: user.username,
            image: user.image || ""
        })

    } catch (error) {
        console.log(error)
        return {error : "Internal server error"}
    }

    redirect("/")

}
