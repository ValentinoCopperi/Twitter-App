import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { MenuIcon } from 'lucide-react'
import SideBar from './sidebar'
import { userData } from '@/lib/session'

const Menu = async () => {
     const{isLoggedIn} = await userData()
    return (
        <Sheet>
            <SheetTrigger>
                <MenuIcon/>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Twitter</SheetTitle>
                </SheetHeader>
                <SideBar isLoggedIn />
            </SheetContent>
        </Sheet>

    )
}

export default Menu