import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Post } from '@/types'
import { MessageCircleMore } from 'lucide-react'
import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import Comment from './comment'
import { Input } from '@/components/ui/input'
import { useUser } from '@/context/user-context'
import { toast } from 'sonner'
import { commentPostAction } from '@/actions/posts/post-actions'
import { useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'


interface Props {
    post: Post,
    setCommentsCount: Dispatch<SetStateAction<number>>
}

const CommentDialog = ({ post, setCommentsCount }: Props) => {

    const [commentContent, setCommentContent] = useState("")
    const [loading, setLoading] = useState(false)
    const { user_data } = useUser()

    const router = useRouter()

    const handleCommentSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (!commentContent || commentContent.length === 0) {
            toast.error("Comment must not be null")
            setLoading(false)
            return;
        }

        if (!user_data) {
            toast.error("Must be logged in to comment on posts")
            setLoading(false)
            return;
        }

        try {
            await commentPostAction(commentContent, post.id, user_data)
            toast.message("Post added succesfully")
            setCommentsCount(prev => prev + 1)
            router.refresh()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
                return
            }
            toast.error("Error posting comment")
        } finally {
            setLoading(false)
        }

    }



    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="p-2">
                        <MessageCircleMore className="!size-7" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[725px] w-[95vw]">
                    <DialogHeader>
                        <DialogTitle>Post Comments</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="h-[50vh] rounded-md border p-4">
                        {post.comments.map(comment => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                userId={user_data?.id}
                                router={router}
                                setCommentsCount={setCommentsCount}
                            />
                        ))}
                    </ScrollArea>

                    <form className='flex flex-col sm:flex-row items-center justify-center w-full space-y-2 sm:space-y-0 sm:space-x-2' onSubmit={handleCommentSubmit}>
                        <Input
                            disabled={loading}
                            className='w-full sm:w-2/3'
                            placeholder="Add a comment..."
                            onChange={(e) => setCommentContent(e.target.value)}
                            value={commentContent}
                        />
                        <Button disabled={loading} className='w-full sm:w-1/3' type='submit'>
                            {loading ? "Posting..." : "Comment"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CommentDialog