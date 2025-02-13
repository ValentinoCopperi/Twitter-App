"use client"

import { follow, revalidatePosts, unfollow } from '@/actions/posts/post-actions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Post } from '@/types'
import { User } from '@prisma/client'
import { useState } from 'react'
import { toast } from 'sonner'
import PostOptions from './post-options/post-options'

interface FollowBtnProps {
    post : Post,
    user : User | null| undefined,
}

const FollowBtn = ({post,user} : FollowBtnProps) => {

    const [loading, setLoading] = useState(false)

    const[isFollowing, setIsFollowing] = useState(user?.following.some(f => f === post.user.id))
    
    const isMyPost = user?.id === post.user.id;


    const toggleFollow = async () => {

        setLoading(true);

        if(!user ) {
            toast.error("Must be logged in to follow users");
            setLoading(false);
            return;
        }

        try {
            
            if(isFollowing) {
                await unfollow(user.id,post.user.id);
                toast.success(`Unfollowed ${post.user.username}`);
                setIsFollowing(false);
            }else{
                await follow(user.id, post.user.id);
                toast.success(`Followed ${post.user.username}`);
                setIsFollowing(true);
            }

            
        } catch (error) {
            console.error(error);
            if(error instanceof Error) {
                toast.error(error.message);
            }
            toast.error("Error following user");
        } finally {
            setLoading(false);
        }

    }

  return (

    
        isMyPost ? (
            <PostOptions post={post} user={user} />
        ) : (

            <Button  onClick={toggleFollow} disabled={loading} className={cn(isMyPost && "hidden")}>
                {
                    loading ? (
                        "Loading..."
                    ) : (
                        isFollowing ? "Unfollow" : "Follow"
                    )
                }
            </Button>
        )
    
  )
}



export default FollowBtn