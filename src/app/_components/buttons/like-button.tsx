"use client"

import { likePostAction, revalidatePosts, unlikePostAction } from "@/actions/posts/post-actions"
import { Button } from "@/components/ui/button"
import { Post } from "@/types"
import { Heart, LoaderIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { set } from "zod"

interface LikeButtonProps {
    hasUserLiked: boolean,
    post: Post,
    userId?: string | null
    username?: string | null
}



const LikeButton = ({ hasUserLiked, post, userId, username }: LikeButtonProps) => {

    const [loading, setLoading] = useState(false)
    const[likesCount,setLikesCount] = useState(post.likes.length)
    const[userLiked,setUserLiked] = useState(hasUserLiked)

    const toggleLike = async () => {
        setLoading(true);

        if(!userId || !username) {
            toast.error("You need to be logged in to like a post");
            setLoading(false);
            return;
        }

        try {
            if (userLiked) {
                await unlikePostAction(post.id,userId);
                setUserLiked(false)
                setLikesCount(likesCount - 1)
            } else {
                await likePostAction(post.id,userId,username);
                setUserLiked(true)
                setLikesCount(likesCount + 1)
            }
        } catch (error) {
            console.error(error);
            toast.error("Error liking post");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Button variant="ghost" onClick={toggleLike} disabled={loading}>
            <span className="text-xl">{likesCount}</span>            
            {
                loading ? (
                    <LoaderIcon className="!size-7 animate-spin" />
                ) : (
                    userLiked ? <Heart className="!size-7" fill="red" color="red" /> : <Heart className="!size-7" />
                )
            }
        </Button>
    )
}

export default LikeButton