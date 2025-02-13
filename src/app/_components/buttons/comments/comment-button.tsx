"use client"

import { Post } from "@/types"
import { useState } from "react"
import CommentDialog from "./comment-dialog"

interface Props {
    post : Post
}

const CommentButton = ({post} : Props) => {

    const [commentsCount,setCommentsCount] = useState(post.comments.length)

    

    return (
        <>
            <h5 className='font-semibold text-xl'>
                {commentsCount}
            </h5>
            <CommentDialog post={post} setCommentsCount={setCommentsCount} />
        </>
    )
}

export default CommentButton