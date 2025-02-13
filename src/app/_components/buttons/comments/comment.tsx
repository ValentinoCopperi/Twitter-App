
import { deleteCommentAction } from '@/actions/posts/post-actions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { type Comment } from '@/types'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  comment: Comment,
  userId: string | undefined
  router: AppRouterInstance
  setCommentsCount: Dispatch<SetStateAction<number>>
}
const Comment = ({ comment, userId, router, setCommentsCount }: Props) => {
  const isMyComment = comment.userId === userId
  const [loading, setLoading] = useState(false)


  const deleteComment = async () => {
    setLoading(true)
    if (userId !== comment.userId) {
      toast.error("You are not authorized to delete this comment")
      setLoading(false)
      return
    }



    try {
      await deleteCommentAction(comment.id)
      toast.message("Comment deleted succesfully")
      setCommentsCount(prev => prev - 1)
      router.refresh()
    } catch (error) {
      toast.error("Error deleting comment")
    } finally {
      setLoading(false)
    }
  }



  return (
    <div key={comment.id} className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center py-2 px-3 space-y-2 sm:space-y-0 sm:space-x-3">
        <div className="flex-shrink-0 w-full sm:w-auto">
          <h1 className="font-semibold text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
            {comment.username}:
          </h1>
        </div>
        <p className="flex-grow text-sm sm:text-base break-words font-light">{comment.content}</p>
        {isMyComment && (
          <div className="flex-shrink-0 w-full sm:w-auto flex justify-start sm:justify-end mt-2 sm:mt-0">
            <Button variant="destructive" size="sm" onClick={deleteComment} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
      </div>
      <Separator className="my-2" />
    </div>
  )
}

export default Comment