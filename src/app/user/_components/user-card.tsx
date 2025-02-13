import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { UserPayload } from '@/lib/session'
import { getInitials } from '@/lib/utils'
import { User } from '@prisma/client'
import React from 'react'
import ProfileOptions from './profile-options'


interface Props {
    user: User,
    user_session?: UserPayload | null | undefined
}

const UserCard = ({ user, user_session }: Props) => {

    const isMyProfile = user_session?.id === user.id;


    return (
        <Card className='relative flex flex-col items-center justify-center  my-4'>
            {
                isMyProfile && (
                    <ProfileOptions user={user} />
                )
            }
            <CardHeader>
                <div className='flex flex-col items-center justify-center space-y-4'>
                    <Avatar className='!size-16'>
                        <AvatarImage src={user.image as string} />
                        <AvatarFallback>
                            {getInitials(user.username as string)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className='text-2xl'>{user.username}</CardTitle>
                    <p>
                        {user.description}
                    </p>
                    <Separator className='my-2' />
                    <CardDescription>
                        @{user.email.split('@')[0]}
                    </CardDescription>
                    <div className='flex space-x-4 h-6'>
                        <p>
                            Following : {user.following.length}
                        </p>
                        <Separator orientation='vertical' className='mx-2' />
                        <p>
                            Followers : {user.followers}
                        </p>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

export default UserCard