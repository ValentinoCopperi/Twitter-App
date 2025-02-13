"use client"

import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User } from "@prisma/client";
import EditProfileForm from "./edit-profile-form";


const ProfileOptions = ({user} : {user:User}) => {

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="absolute top-4 right-4">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent  className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you are done.
                        </DialogDescription>
                    </DialogHeader>
                   <EditProfileForm user={user}/>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default ProfileOptions