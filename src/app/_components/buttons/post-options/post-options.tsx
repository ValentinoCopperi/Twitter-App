"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription, 
    DialogFooter 
} from "@/components/ui/dialog";
import { EllipsisVertical, LoaderIcon } from 'lucide-react';
import { Post } from "@/types";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { deletePostAction, revalidatePosts } from "@/actions/posts/post-actions";
import { useRouter } from "next/navigation";

interface PostOptionsProps {
    post : Post,
    user : User | null| undefined,
}

const PostOptions = ({post,user}:PostOptionsProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const[loading,setLoading] = useState(false);


    const handleDeleteClick = () => {
        setIsDropdownOpen(false); 
        setIsDeleteDialogOpen(true); 
    };

    const deletePost = async () => {
        setLoading(true);
        try {
            if(!user) {
                toast.error("Must be logged in to delete posts");
                return;
            }
            
            await deletePostAction(post,user.id);

            toast.success("Post deleted successfully");

            await revalidatePosts()
            
        } catch (error) {
            if(error instanceof Error) {
                toast.error("Error:" + error.message);
                return;
            }
            toast.error("Error deleting post");
        }finally {
            setLoading(false);
        }

    }

    return (
        <>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" disabled={loading}>
                        {
                            loading ? (
                                <div className="w-5 h-5 animate-spin">
                                    <LoaderIcon />
                                </div>
                            ) : (
                                <EllipsisVertical />
                            )
                        }
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Post Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        className="text-red-500 cursor-pointer"
                        onClick={handleDeleteClick}
                    >
                        Delete Post
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. The post will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={() => {
                                deletePost();
                                setIsDeleteDialogOpen(false);
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PostOptions;