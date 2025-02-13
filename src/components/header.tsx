import React from 'react'
import Container from './container'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Menu from './menu'
import { ModeToggle } from './theme-toggle-button'
import { userData } from '@/lib/session'
import { User } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const Header = async () => {

    const { user, isLoggedIn } = await userData()


    return (
        <header className='border-b border-border py-3 bg-white dark:bg-black'>
            <Container className='flex flex-row justify-between items-center'>
                <div className='block lg:hidden'>
                    <Menu />
                </div>
                <div>
                    <Link href="/" className='font-semibold text-2xl'>
                        Twitter
                    </Link>
                </div>
                <div className='flex flex-row items-center space-x-3'>
                    <Link href="/user/me">
                        <Avatar>
                            <AvatarImage src={user?.image as string} />
                            <AvatarFallback>
                                {!isLoggedIn ? <User /> : getInitials(user?.username as string)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    <ModeToggle />
                </div>
            </Container>
        </header>
    )
}

export default Header