import { nextAuthAuthentication } from "@/actions/users/user-actions";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers: [GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.CLIENT_SECRET as string
    })],


    callbacks: {
        async signIn({ user, account }) {

            const { email, name, image, id } = user;
            
            const newUser = await nextAuthAuthentication({ id, name, email, image });

            if (!newUser) {
                return false;
            }

            return true;

        },
    }

})

export { handler as GET, handler as POST }


