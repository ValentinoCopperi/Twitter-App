import React from 'react'
import PostCard from './post-card'
import { Post } from '@/types'
import { userData } from '@/lib/session'
import { getUserById } from '@/actions/users/user-actions'

interface Props {
  posts: Post[]
}


const PostGrid = async ({ posts }: Props) => {

  const { isLoggedIn, user } = await userData()
  const user_data  = isLoggedIn ? await getUserById(user?.id as string) : null

  return (
    <div className='flex flex-col items-center justify-center space-y-6'>
      {
        posts.map(post => <PostCard
          key={post.id}
          post={post}
          isLoggedIn={isLoggedIn}
          user={user_data}
        />)
      }
    </div>
  )
}

export default PostGrid