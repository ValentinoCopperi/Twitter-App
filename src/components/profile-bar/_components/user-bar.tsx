import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { User } from '@prisma/client'
import Link from 'next/link'
import React from 'react'

const UserBar = ({ user }: { user: User }) => {
    return (
        <Link href={`/user/${user.username}`} className='flex  items-center space-x-4 border-b hover:bg-gray-800 duration-150'>

            <Avatar>
                <AvatarImage src={user?.image as string} alt={user.username} />
                <AvatarFallback>
                    {
                        getInitials(user.username)
                    }
                </AvatarFallback>
            </Avatar>
            <h1>{user.username}</h1>

        </Link>
    )
}

export default UserBar