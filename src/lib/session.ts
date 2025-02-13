import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { cache } from 'react'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export interface UserPayload {
    id : string;
    email : string;
    username : string;
    image? : string;
}

export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined | any = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log(error)
    }
}

export async function updateSession(user: UserPayload) {
    const cookieStore = await cookies()
    cookieStore.delete('session')

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ user, expiresAt })

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function createSession(user: UserPayload) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ user, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

interface UserData {
    user : UserPayload | null;
    isLoggedIn : boolean;
}

export const userData = cache(async () : Promise<UserData> => {

    const cookiesStrore = await cookies()
    const session =  cookiesStrore.get('session')?.value

    if (!session) return { user : null , isLoggedIn : false }

    const payload = await decrypt(session)

    if(!payload) return { user : null , isLoggedIn : false }

    return { user : payload.user as UserPayload , isLoggedIn : true }
})