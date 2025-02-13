import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { userData } from '@/lib/session';
import React from 'react'
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import { User } from 'lucide-react';

const ProfileCard = async () => {

    const { user, isLoggedIn } = await userData()

    return (
        <Card>
            <CardHeader className='flex items-center justify-center'>
                <CardTitle>
                    <Avatar>
                        <AvatarImage src={user?.image as string} />
                        <AvatarFallback>
                            {!isLoggedIn ? <User /> : getInitials(user?.username as string)}
                        </AvatarFallback>
                    </Avatar>
                </CardTitle>
                <CardDescription>
                    <Link href="/user/me" className='hover:underline' >
                        {
                            isLoggedIn ? user?.username  : 'Guest'
                        }
                    </Link>
                </CardDescription>
            </CardHeader>
        </Card>
    )
}

export default ProfileCard